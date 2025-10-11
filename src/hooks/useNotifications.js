import { useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../services/api';
import webSocketService from '../services/websocket';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar notificaciones desde la API (persistencia)
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await notificationAPI.getAllNotifications();
      
      // Mapear y ordenar por fecha (más recientes primero)
      const mappedNotifications = data.map(notification => ({
        id: notification.id,
        title: notification.title || 'Nueva notificación',
        message: notification.message,
        read: notification.read || false,
        createdAt: notification.createdAt,
        typeId: notification.typeId,
        userId: notification.userId,
        // Agregar campos adicionales para compatibilidad
        type: getNotificationType(notification.typeId),
        timestamp: notification.createdAt
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotifications(mappedNotifications);
      console.log('📥 Notificaciones cargadas desde API:', mappedNotifications);
      
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError(err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función auxiliar para determinar el tipo de notificación
  const getNotificationType = (typeId) => {
    // Mapear typeId a tipo de notificación
    switch (typeId) {
      case 1:
        return 'message';
      case 2:
        return 'product';
      case 3:
        return 'system';
      default:
        return 'general';
    }
  };

  // Agregar nueva notificación (desde WebSocket)
  const addNotification = useCallback((newNotification) => {
    setNotifications(prev => {
      // Evitar duplicados
      const exists = prev.some(notif => notif.id === newNotification.id);
      if (exists) {
        return prev;
      }

      const mappedNotification = {
        id: newNotification.id || Date.now(),
        title: newNotification.title || 'Nueva notificación',
        message: newNotification.message || newNotification.content || '',
        read: false, // Las nuevas notificaciones siempre son no leídas
        createdAt: newNotification.createdAt || new Date().toISOString(),
        typeId: newNotification.typeId,
        userId: newNotification.userId,
        type: getNotificationType(newNotification.typeId),
        timestamp: newNotification.createdAt || new Date().toISOString()
      };

      console.log('➕ Nueva notificación agregada:', mappedNotification);
      
      // Agregar al inicio del array (más reciente primero)
      return [mappedNotification, ...prev];
    });
  }, []);

  // Marcar como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Actualizar en el servidor
      await notificationAPI.markAsRead(notificationId);
      
      // Actualizar en el estado local
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      console.log('✅ Notificación marcada como leída:', notificationId);
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
      setError(err.message);
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      // Marcar todas como leídas localmente para UX rápida
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );

      // Marcar en el servidor
      await Promise.all(
        unreadNotifications.map(notification =>
          notificationAPI.markAsRead(notification.id)
        )
      );
      
      console.log('✅ Todas las notificaciones marcadas como leídas');
    } catch (err) {
      console.error('Error marcando todas las notificaciones como leídas:', err);
      setError(err.message);
      // Recargar notificaciones en caso de error
      loadNotifications();
    }
  }, [notifications, loadNotifications]);

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
      
      console.log('🗑️ Notificación eliminada:', notificationId);
    } catch (err) {
      console.error('Error eliminando notificación:', err);
      setError(err.message);
    }
  }, []);

  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Obtener notificaciones recientes (últimas 10)
  const recentNotifications = notifications.slice(0, 10);

  // Configurar listeners de WebSocket
  useEffect(() => {
    const handleNewNotification = (payload) => {
      console.log('🔔 Nueva notificación WebSocket:', payload);
      
      // Mapear payload del WebSocket al formato de notificación
      const mappedPayload = {
        id: payload.id,
        title: payload.title || 'Nuevo mensaje',
        message: payload.message || payload.content || '',
        typeId: payload.typeId || 1, // Default a mensaje
        userId: payload.userId,
        createdAt: payload.createdAt || new Date().toISOString(),
        ...payload
      };

      addNotification(mappedPayload);
    };

    const handleNewMessage = (payload) => {
      // Solo crear notificación si el mensaje no es del usuario actual
      if (payload.senderId && payload.senderId !== webSocketService.currentUserId) {
        console.log('💬 Creando notificación de mensaje nuevo:', payload);
        
        const notificationPayload = {
          id: `msg_${payload.id}_${Date.now()}`, // ID único para notificación
          title: 'Nuevo mensaje',
          message: `${payload.senderName || 'Alguien'} te ha enviado un mensaje`,
          typeId: 1, // Tipo mensaje
          userId: webSocketService.currentUserId,
          createdAt: payload.sentAt || payload.createdAt || new Date().toISOString(),
          originalMessage: payload
        };

        addNotification(notificationPayload);
      }
    };

    // Registrar listeners
    webSocketService.on('newNotification', handleNewNotification);
    webSocketService.on('newMessage', handleNewMessage);

    return () => {
      // Limpiar listeners
      webSocketService.off('newNotification', handleNewNotification);
      webSocketService.off('newMessage', handleNewMessage);
    };
  }, [addNotification]);

  // Cargar notificaciones al montar el hook
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    recentNotifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

export default useNotifications;