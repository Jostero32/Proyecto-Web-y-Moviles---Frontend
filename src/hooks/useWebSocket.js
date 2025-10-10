import { useState, useEffect, useCallback, useRef } from 'react';
import webSocketService from '../services/websocket';

// Hook para manejar la conexión WebSocket
export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectStatus, setReconnectStatus] = useState({
    isReconnecting: false,
    attempts: 0,
    maxAttempts: 5
  });
  const [error, setError] = useState(null);

  const connect = useCallback(() => {
    return webSocketService.connect()
      .then(() => {
        setIsConnected(true);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setIsConnected(false);
        throw err;
      });
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setError(null);
      setReconnectStatus(webSocketService.getReconnectStatus());
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setReconnectStatus(webSocketService.getReconnectStatus());
    };

    const handleError = (error) => {
      setError(error);
      setIsConnected(false);
    };

    const handleMaxReconnectAttemptsReached = () => {
      setError(new Error('No se pudo reconectar después de varios intentos'));
      setReconnectStatus(webSocketService.getReconnectStatus());
    };

    // Suscribirse a eventos
    webSocketService.on('connected', handleConnected);
    webSocketService.on('disconnected', handleDisconnected);
    webSocketService.on('error', handleError);
    webSocketService.on('maxReconnectAttemptsReached', handleMaxReconnectAttemptsReached);

    // Cleanup
    return () => {
      webSocketService.off('connected', handleConnected);
      webSocketService.off('disconnected', handleDisconnected);
      webSocketService.off('error', handleError);
      webSocketService.off('maxReconnectAttemptsReached', handleMaxReconnectAttemptsReached);
    };
  }, []);

  return {
    isConnected,
    reconnectStatus,
    error,
    connect,
    disconnect,
    send: webSocketService.send.bind(webSocketService),
    joinConversation: webSocketService.joinConversation.bind(webSocketService),
    leaveConversation: webSocketService.leaveConversation.bind(webSocketService),
    startTyping: webSocketService.startTyping.bind(webSocketService),
    stopTyping: webSocketService.stopTyping.bind(webSocketService)
  };
};

// Hook para manejar mensajes en tiempo real
export const useWebSocketMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const conversationIdRef = useRef(conversationId);

  // Actualizar la referencia cuando cambie conversationId
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const addMessage = useCallback((message) => {
    setMessages(prevMessages => {
      // Evitar duplicados
      const exists = prevMessages.some(msg => msg.id === message.id);
      if (exists) return prevMessages;
      
      return [...prevMessages, message];
    });
  }, []);

  const updateMessage = useCallback((messageId, updates) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  const setMessagesFromAPI = useCallback((apiMessages) => {
    setMessages(apiMessages);
  }, []);

  useEffect(() => {
    const handleNewMessage = (payload) => {
      console.log('📨 Mensaje WebSocket recibido:', {
        payload,
        currentConversationId: conversationIdRef.current,
        payloadConversationId: payload.conversationId,
        currentUserId: webSocketService.currentUserId,
        payloadSenderId: payload.senderId
      });
      
      // Solo procesar mensajes de la conversación actual (comparar como strings y números)
      const payloadConvId = payload.conversationId?.toString();
      const currentConvId = conversationIdRef.current?.toString();
      
      if (payloadConvId === currentConvId) {
        console.log('✅ Procesando mensaje para conversación actual');
        
        // Mapear el mensaje del WebSocket al formato de UI
        const mappedMessage = {
          id: payload.id,
          text: payload.content,
          sender: payload.senderId === webSocketService.currentUserId ? 'me' : 'vendor',
          timestamp: formatMessageTimestamp(payload.sentAt || payload.createdAt),
          originalData: payload
        };
        
        console.log('📝 Mensaje mapeado:', mappedMessage);
        addMessage(mappedMessage);
      } else {
        console.log('🚫 Mensaje ignorado - conversación diferente');
      }
    };

    const handleUserTyping = (payload) => {
      if (payload.conversationId === conversationIdRef.current && 
          payload.userId !== webSocketService.currentUserId) {
        setTypingUsers(prev => new Set([...prev, payload.userId]));
      }
    };

    const handleUserStoppedTyping = (payload) => {
      if (payload.conversationId === conversationIdRef.current) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(payload.userId);
          return newSet;
        });
      }
    };

    // Suscribirse a eventos
    webSocketService.on('newMessage', handleNewMessage);
    webSocketService.on('userTyping', handleUserTyping);
    webSocketService.on('userStoppedTyping', handleUserStoppedTyping);

    // Unirse a la conversación si hay una seleccionada
    if (conversationId) {
      console.log('🏠 Uniéndose a conversación WebSocket:', conversationId);
      const joined = webSocketService.joinConversation(conversationId);
      if (!joined) {
        console.warn('⚠️ No se pudo unir a la conversación WebSocket (no conectado)');
      }
    }

    return () => {
      // Cleanup
      webSocketService.off('newMessage', handleNewMessage);
      webSocketService.off('userTyping', handleUserTyping);
      webSocketService.off('userStoppedTyping', handleUserStoppedTyping);
      
      // Salir de la conversación
      if (conversationId) {
        webSocketService.leaveConversation(conversationId);
      }
    };
  }, [conversationId, addMessage]);

  return {
    messages,
    typingUsers,
    addMessage,
    updateMessage,
    setMessagesFromAPI
  };
};

// Hook para manejar notificaciones en tiempo real
export const useWebSocketNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      // Evitar duplicados
      const exists = prev.some(notif => notif.id === notification.id);
      if (exists) return prev;
      
      return [notification, ...prev];
    });
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  useEffect(() => {
    const handleNewNotification = (payload) => {
      console.log('🔔 Nueva notificación WebSocket:', payload);
      addNotification(payload);
    };

    webSocketService.on('newNotification', handleNewNotification);

    return () => {
      webSocketService.off('newNotification', handleNewNotification);
    };
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead
  };
};

// Función auxiliar para formatear timestamp (movida aquí para reutilización)
const formatMessageTimestamp = (dateString) => {
  const messageDate = new Date(dateString);
  const now = new Date();
  
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  } else if (messageDate.toDateString() === new Date(now.getTime() - 86400000).toDateString()) {
    return `Ayer ${messageDate.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return messageDate.toLocaleDateString('es-EC', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};