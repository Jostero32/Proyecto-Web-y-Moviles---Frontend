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

    const handleMessageSent = (messageData) => {
      console.log('✅ Mensaje confirmado por WebSocket:', messageData);
      // Actualizar mensaje temporal con datos reales del servidor
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.pending && msg.text === messageData.content ? {
            ...msg,
            id: messageData.id,
            pending: false,
            timestamp: formatMessageTimestamp(messageData.sentAt || messageData.createdAt),
            originalData: messageData
          } : msg
        )
      );
    };

    // Suscribirse a eventos
    webSocketService.on('newMessage', handleNewMessage);
    webSocketService.on('messageSent', handleMessageSent);
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
      webSocketService.off('messageSent', handleMessageSent);
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

// Hook para manejar estado online de usuarios
export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [userStatuses, setUserStatuses] = useState(new Map()); // userId -> {status, lastSeen}

  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId?.toString());
  }, [onlineUsers]);

  const getUserStatus = useCallback((userId) => {
    return userStatuses.get(userId?.toString()) || { status: 'offline', lastSeen: null };
  }, [userStatuses]);

  const requestUserStatus = useCallback((userId) => {
    return webSocketService.requestUserStatus(userId);
  }, []);

  const requestOnlineUsers = useCallback(() => {
    return webSocketService.requestOnlineUsers();
  }, []);

  useEffect(() => {
    const handleUserOnline = (payload) => {
      const { userId, status = 'online', timestamp } = payload;
      console.log('🟢 Usuario conectado:', { userId, status });
      
      setOnlineUsers(prev => new Set([...prev, userId.toString()]));
      setUserStatuses(prev => new Map(prev).set(userId.toString(), {
        status,
        lastSeen: timestamp || new Date().toISOString()
      }));
    };

    const handleUserOffline = (payload) => {
      const { userId, timestamp } = payload;
      console.log('🔴 Usuario desconectado:', { userId });
      
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId.toString());
        return newSet;
      });
      
      setUserStatuses(prev => new Map(prev).set(userId.toString(), {
        status: 'offline',
        lastSeen: timestamp || new Date().toISOString()
      }));
    };

    const handleOnlineUsersList = (payload) => {
      const { users = [] } = payload;
      console.log('👥 Lista de usuarios online recibida:', users);
      
      const onlineUserIds = new Set(users.map(user => 
        typeof user === 'object' ? user.userId?.toString() : user?.toString()
      ));
      
      const statusMap = new Map();
      users.forEach(user => {
        if (typeof user === 'object') {
          statusMap.set(user.userId?.toString(), {
            status: user.status || 'online',
            lastSeen: user.lastSeen || new Date().toISOString()
          });
        } else {
          statusMap.set(user?.toString(), {
            status: 'online',
            lastSeen: new Date().toISOString()
          });
        }
      });
      
      setOnlineUsers(onlineUserIds);
      setUserStatuses(statusMap);
    };

    // Suscribirse a eventos
    webSocketService.on('userOnline', handleUserOnline);
    webSocketService.on('userOffline', handleUserOffline);
    webSocketService.on('onlineUsers', handleOnlineUsersList);

    // Solicitar lista inicial de usuarios online cuando se conecta
    const handleConnected = () => {
      setTimeout(() => {
        console.log('🔍 Solicitando lista inicial de usuarios online...');
        webSocketService.requestOnlineUsers();
      }, 1000); // Esperar 1 segundo después de conectar
    };

    webSocketService.on('connected', handleConnected);

    return () => {
      webSocketService.off('userOnline', handleUserOnline);
      webSocketService.off('userOffline', handleUserOffline);
      webSocketService.off('onlineUsers', handleOnlineUsersList);
      webSocketService.off('connected', handleConnected);
    };
  }, []);

  return {
    onlineUsers,
    userStatuses,
    isUserOnline,
    getUserStatus,
    requestUserStatus,
    requestOnlineUsers
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