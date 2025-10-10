import { authAPI } from './api';
import { WEBSOCKET_CONFIG, getWebSocketUrl } from '../config/websocket';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = WEBSOCKET_CONFIG.maxReconnectAttempts;
    this.reconnectInterval = 1000; // 1 segundo inicial
    this.isReconnecting = false;
    this.listeners = new Map();
    this.currentUserId = null;
    this.isAuthenticated = false;
    
    // Configuración
    this.config = {
      url: getWebSocketUrl(),
      heartbeatInterval: WEBSOCKET_CONFIG.heartbeatInterval,
      reconnectBackoff: WEBSOCKET_CONFIG.reconnectBackoff
    };
    
    this.heartbeatTimer = null;
  }

  // Conectar al WebSocket
  connect() {
    return new Promise((resolve, reject) => {
      try {
        // Verificar autenticación
        const userData = authAPI.getUserData();
        const token = authAPI.getAuthToken();
        
        if (!userData || !token) {
          console.warn('No hay usuario autenticado, no se puede conectar WebSocket');
          reject(new Error('No authenticated'));
          return;
        }

        this.currentUserId = userData.id;
        this.isAuthenticated = true;

        console.log('🔌 Conectando a WebSocket...', this.config.url);
        
        // Crear conexión WebSocket con token en query params
        const wsUrl = `${this.config.url}?token=${token}&userId=${userData.id}`;
        this.ws = new WebSocket(wsUrl);

        // Event listeners
        this.ws.onopen = (event) => {
          console.log('✅ WebSocket conectado');
          this.reconnectAttempts = 0;
          this.isReconnecting = false;
          this.startHeartbeat();
          
          // Emitir evento de conexión
          this.emit('connected', { userId: this.currentUserId });
          resolve(event);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 Mensaje WebSocket recibido:', data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parseando mensaje WebSocket:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('❌ WebSocket desconectado:', event.code, event.reason);
          this.stopHeartbeat();
          this.emit('disconnected', { code: event.code, reason: event.reason });
          
          // Reconectar automáticamente si no es cierre intencional
          if (!event.wasClean && this.isAuthenticated) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Error WebSocket:', error);
          const friendlyError = new Error('No se pudo conectar al servidor WebSocket. Verifica que el servidor esté ejecutándose.');
          this.emit('error', friendlyError);
          reject(friendlyError);
        };

      } catch (error) {
        console.error('Error creando WebSocket:', error);
        reject(error);
      }
    });
  }

  // Manejar mensajes recibidos
  handleMessage(data) {
    const { type, payload } = data;
    console.log('🔄 Procesando mensaje WebSocket:', { type, payload });

    switch (type) {
      case 'message':
        console.log('📨 Emitiendo evento newMessage:', payload);
        this.emit('newMessage', payload);
        break;
      
      case 'notification':
        this.emit('newNotification', payload);
        break;
      
      case 'userTyping':
        this.emit('userTyping', payload);
        break;
      
      case 'userStoppedTyping':
        this.emit('userStoppedTyping', payload);
        break;
      
      case 'conversationUpdate':
        this.emit('conversationUpdate', payload);
        break;
      
      case 'pong':
        // Respuesta al heartbeat
        console.log('💓 Heartbeat recibido');
        break;
      
      default:
        console.warn('Tipo de mensaje WebSocket desconocido:', type, payload);
        this.emit('unknownMessage', { type, payload });
    }
  }

  // Enviar mensaje
  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload });
      this.ws.send(message);
      console.log('📤 Enviando mensaje WebSocket:', { type, payload });
      return true;
    } else {
      console.warn('WebSocket no está conectado, no se puede enviar:', { type, payload });
      return false;
    }
  }

  // Unirse a una conversación específica
  joinConversation(conversationId) {
    console.log(`🏠 Intentando unirse a conversación: ${conversationId}`);
    const success = this.send('joinConversation', { conversationId });
    if (success) {
      console.log(`✅ Unido a conversación ${conversationId}`);
    } else {
      console.warn(`❌ No se pudo unir a conversación ${conversationId}`);
    }
    return success;
  }

  // Salir de una conversación
  leaveConversation(conversationId) {
    return this.send('leaveConversation', { conversationId });
  }

  // Indicar que el usuario está escribiendo
  startTyping(conversationId) {
    return this.send('startTyping', { conversationId });
  }

  // Indicar que el usuario dejó de escribir
  stopTyping(conversationId) {
    return this.send('stopTyping', { conversationId });
  }

  // Sistema de heartbeat para mantener conexión viva
  startHeartbeat() {
    this.stopHeartbeat(); // Limpiar timer anterior
    
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Reconexión automática
  scheduleReconnect() {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Máximo número de intentos de reconexión alcanzado');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;

    const delay = this.reconnectInterval * Math.pow(this.config.reconnectBackoff, this.reconnectAttempts - 1);
    
    console.log(`🔄 Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.isAuthenticated) {
        this.connect().catch(() => {
          // Si falla, scheduleReconnect se llamará automáticamente por onclose
        });
      }
    }, delay);
  }

  // Sistema de eventos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error ejecutando listener para evento ${event}:`, error);
        }
      });
    }
  }

  // Desconectar WebSocket
  disconnect() {
    console.log('🔌 Desconectando WebSocket...');
    this.isAuthenticated = false;
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
  }

  // Verificar estado de conexión
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  // Obtener estado de reconexión
  getReconnectStatus() {
    return {
      isReconnecting: this.isReconnecting,
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    };
  }
}

// Crear instancia singleton
const webSocketService = new WebSocketService();

export default webSocketService;