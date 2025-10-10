import { authAPI } from './api.js';
import { websocketConfig } from '../config/websocket.js';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.isReconnecting = false;
    this.messageQueue = [];
    this.eventListeners = new Map();
    this.currentUserId = null;

    // Bind methods
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.send = this.send.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.startHeartbeat = this.startHeartbeat.bind(this);
    this.stopHeartbeat = this.stopHeartbeat.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    // Setup visibility change detection
    this.setupVisibilityDetection();
  }

  async connect() {
    if (this.isConnected || this.isReconnecting) {
      return Promise.resolve();
    }

    try {
      console.log('🔌 Conectando a WebSocket...', websocketConfig.url);
      
      const token = authAPI.getAuthToken();
      const currentUser = authAPI.getUserData();
      
      if (!token || !currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      this.currentUserId = currentUser.id;
      const wsUrl = `${websocketConfig.url}?token=${token}&userId=${currentUser.id}`;
      this.ws = new WebSocket(wsUrl);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.ws.close();
          reject(new Error('Timeout de conexión WebSocket'));
        }, websocketConfig.connectionTimeout);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          console.log('✅ WebSocket conectado');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.isReconnecting = false;
          this.startHeartbeat();
          this.processMessageQueue();
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          console.log('📨 Mensaje WebSocket recibido:', JSON.parse(event.data));
          this.handleMessage(event);
        };

        this.ws.onclose = (event) => {
          clearTimeout(timeout);
          console.log('❌ WebSocket desconectado:', event.code);
          this.isConnected = false;
          this.stopHeartbeat();
          this.emit('disconnected', event);
          
          if (!this.isReconnecting && event.code !== 1000) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          console.log('❌ Error WebSocket:', error);
          this.emit('error', error);
          reject(error);
        };
      });
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      throw error;
    }
  }

  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      console.log('🔄 Procesando mensaje WebSocket:', message);

      // Manejar diferentes tipos de mensajes del backend
      switch (message.type) {
        case 'init:data':
          console.log('🚀 Datos de inicialización recibidos:', message.data);
          this.emit('init', message.data);
          // Si hay conversaciones, procesarlas
          if (message.data && Array.isArray(message.data.conversations)) {
            console.log('📫 Conversaciones iniciales:', message.data.conversations);
          }
          break;
        case 'chat:new':
          console.log('📨 Nuevo mensaje de chat recibido:', message.data);
          if (message.data && message.data.message) {
            this.emit('newMessage', message.data.message);
          }
          break;
        case 'chat:sent':
          console.log('✅ Mensaje enviado confirmado:', message.data);
          if (message.data && message.data.message) {
            this.emit('messageSent', message.data.message);
          }
          break;
        case 'notification:new':
          console.log('🔔 Nueva notificación recibida:', message.data);
          this.emit('newNotification', message.data);
          break;
        case 'chat:read:update':
          console.log('👁️ Estado de lectura actualizado:', message.data);
          this.emit('messageReadUpdate', message.data);
          break;
        case 'notification:read:confirm':
          console.log('✅ Notificación marcada como leída:', message.data);
          this.emit('notificationReadConfirm', message.data);
          break;
        case 'error':
          console.log('❌ Error del servidor:', message.message);
          this.emit('serverError', message);
          break;
        case 'newMessage':
        case 'message': // Mantener compatibilidad con tipos genéricos
          console.log('📨 Emitiendo evento newMessage:', message.payload || message.data);
          this.emit('newMessage', message.payload || message.data);
          break;
        case 'messageUpdate':
          console.log('📝 Emitiendo evento messageUpdate:', message.payload);
          this.emit('messageUpdate', message.payload);
          break;
        case 'userOnline':
          console.log('🟢 Usuario online:', message.payload);
          this.emit('userOnline', message.payload);
          break;
        case 'userOffline':
          console.log('🔴 Usuario offline:', message.payload);
          this.emit('userOffline', message.payload);
          break;
        case 'userStatusUpdate':
          console.log('👤 Estado de usuario actualizado:', message.payload);
          this.emit('userStatusUpdate', message.payload);
          break;
        case 'onlineUsers':
          console.log('👥 Lista de usuarios online:', message.payload);
          this.emit('onlineUsers', message.payload);
          break;
        case 'typingStart':
          console.log('✍️ Usuario comenzó a escribir:', message.payload);
          this.emit('typingStart', message.payload);
          break;
        case 'typingStop':
          console.log('✋ Usuario dejó de escribir:', message.payload);
          this.emit('typingStop', message.payload);
          break;
        case 'pong':
          console.log('💓 Pong recibido');
          break;
        default:
          console.log('Tipo de mensaje WebSocket desconocido:', message.type, message.payload);
          // Emitir evento genérico para mensajes desconocidos
          this.emit('message', message);
      }
    } catch (error) {
      console.error('Error al procesar mensaje WebSocket:', error);
    }
  }

  send(message) {
    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('📤 Enviando mensaje WebSocket:', message);
      this.ws.send(JSON.stringify(message));
      return true;
    } else {
      console.log('WebSocket no está conectado, no se puede enviar:', message);
      this.messageQueue.push(message);
      return false;
    }
  }

  joinConversation(conversationId) {
    console.log('🏠 Intentando unirse a conversación:', conversationId);
    const success = this.send({
      type: 'joinConversation',
      payload: { conversationId }
    });
    
    if (success) {
      console.log('✅ Unido a conversación', conversationId);
    }
    
    return success;
  }

  leaveConversation(conversationId) {
    console.log('🚪 Intentando salir de conversación:', conversationId);
    return this.send({
      type: 'leaveConversation',
      payload: { conversationId }
    });
  }

  sendMessage(conversationId, content) {
    return this.send({
      type: 'chat:send',
      conversationId: conversationId,
      content: content
    });
  }

  startTyping(conversationId) {
    return this.send({
      type: 'startTyping',
      payload: { conversationId }
    });
  }

  stopTyping(conversationId) {
    return this.send({
      type: 'stopTyping',
      payload: { conversationId }
    });
  }

  setUserStatus(status) {
    return this.send({
      type: 'userStatusChange',
      payload: { 
        status, 
        timestamp: new Date().toISOString() 
      }
    });
  }

  getUsersOnline() {
    return this.send({
      type: 'getUsersOnline',
      payload: {}
    });
  }

  requestOnlineUsers() {
    return this.send({
      type: 'requestOnlineUsers',
      payload: {}
    });
  }

  requestUserStatus(userId) {
    return this.send({
      type: 'requestUserStatus',
      payload: { userId }
    });
  }

  markMessageAsRead(messageId) {
    return this.send({
      type: 'chat:read',
      messageId: messageId
    });
  }

  markNotificationAsRead(notificationId) {
    return this.send({
      type: 'notification:read',
      notificationId: notificationId
    });
  }

  sendNotification(userId, title, body, notificationType) {
    return this.send({
      type: 'notification:send',
      userId: userId,
      title: title,
      body: body,
      notificationType: notificationType
    });
  }

  disconnect() {
    console.log('🔌 Desconectando WebSocket... Client disconnecting');
    this.isReconnecting = false;
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    
    this.isConnected = false;
    this.messageQueue = [];
    console.log('WebSocket connection to \'ws://localhost:8080/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6InJ1a2FAZ21haWwuY29tIiwicm9sZXMiOlsiVXN1YXJpbyJdLCJpYXQiOjE3NjAxMTg0MTYsImV4cCI6MTc2MDEyMjAxNn0.4T8FLXYkRp4zh8NfdcD9XGsbRc_vMvxliF2J1ZjN2zo&userId=2\' failed: WebSocket is closed before the connection is established.');
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || this.isReconnecting) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('❌ Máximo de reintentos alcanzado - WebSocket permanentemente desactivado');
        this.emit('maxReconnectAttemptsReached');
      }
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(websocketConfig.reconnectBackoff || 1.5, this.reconnectAttempts - 1);

    console.log(`🔄 Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('Error en reintento de conexión:', error);
        this.isReconnecting = false;
        
        // Si ya llegamos al máximo de intentos, no intentar más
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('❌ No se puede establecer conexión WebSocket - Continuando en modo HTTP');
          this.emit('maxReconnectAttemptsReached');
        } else {
          this.scheduleReconnect();
        }
      }
    }, delay);
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({
          type: 'ping',
          payload: { timestamp: Date.now() }
        });
      }
    }, websocketConfig.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  setupVisibilityDetection() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('focus', () => this.handleVisibilityChange('focus'));
    window.addEventListener('blur', () => this.handleVisibilityChange('blur'));
  }

  handleVisibilityChange(eventType) {
    if (!this.isConnected) return;

    if (document.hidden || eventType === 'blur') {
      console.log('👁️ Usuario cambió de pestaña (away)');
      this.setUserStatus('away');
    } else if (!document.hidden || eventType === 'focus') {
      console.log('👁️ Usuario regresó a la pestaña (online)');
      this.setUserStatus('online');
    }
  }

  // Event emitter methods
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en listener de evento ${event}:`, error);
        }
      });
    }
  }

  // Método para limpiar listeners
  removeAllListeners() {
    this.eventListeners.clear();
  }

  // Status methods
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isReconnecting: this.isReconnecting,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  getReconnectStatus() {
    return {
      isReconnecting: this.isReconnecting,
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    };
  }

  // Método público para simular mensajes (para testing)
  simulateMessage(messageData) {
    // Simular un evento de mensaje WebSocket
    const mockEvent = {
      data: JSON.stringify({
        type: 'newMessage',
        payload: messageData
      })
    };
    this.handleMessage(mockEvent);
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
export default websocketService;
