import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
// import webSocketService from '../services/websocket'; // DESHABILITADO - ahora se usa useNotifications.js
// import { mapWebSocketEventToNotification } from '../utils/notificationMapper'; // DESHABILITADO

// Crear el contexto
const NotificationContext = createContext();
export { NotificationContext };

// Provider del contexto
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar notificaciones existentes desde la API
  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/notifications', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📥 Notificaciones cargadas desde API (Context):', data);
        setNotifications(data || []);
      } else {
        console.error('Error cargando notificaciones:', response.status);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar nueva notificación
  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      // Evitar duplicados
      const exists = prev.some(notif => notif.id === notification.id);
      if (exists) return prev;
      
      // Mapear la notificación del WebSocket al formato esperado
      const mappedNotification = {
        id: notification.id || Date.now(),
        title: notification.title || 'Nueva notificación',
        message: notification.message || notification.content || '',
        read: notification.read || false,
        createdAt: notification.createdAt || notification.timestamp || new Date().toISOString(),
        type: notification.type || 'message',
        ...notification
      };
      
      console.log('➕ Agregando notificación (Context):', mappedNotification);
      return [mappedNotification, ...prev];
    });
  }, []);

  // Eliminar notificación
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);

  // Marcar como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Actualizar en el servidor
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      });

      if (response.ok) {
        // Actualizar en el estado local
        // Después de actualizar el estado local, emitir evento
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );

        // AGREGAR ESTA LÍNEA:
        window.dispatchEvent(new CustomEvent('notificationUpdated', { 
          detail: { type: 'markAsRead', notificationId } 
        }));
      }
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    // Marcar todas como leídas localmente primero para UX rápida
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));

    // Intentar marcar en el servidor
    try {
      await Promise.all(
        unreadNotifications.map(notification =>
          fetch(`http://localhost:8080/api/notifications/${notification.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ read: true })
          })
        )
      );
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
      // Revertir si hay error
      loadNotifications();
    }
  }, [notifications, loadNotifications]);

  // Obtener contador de notificaciones no leídas
  const unreadCount = useMemo(() => {
    return notifications.filter(notif => !notif.read).length;
  }, [notifications]);

  // Obtener las notificaciones más recientes
  const recentNotifications = useMemo(() => {
    return notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10); // Limitar a las 10 más recientes
  }, [notifications]);

  // Configurar WebSocket listeners cuando el contexto se inicializa - DESHABILITADO
  useEffect(() => {
    // FUNCIONES COMENTADAS - ahora se usa useNotifications.js
    // const handleNewNotification = (payload) => {
    //   console.log('🔔 Nueva notificación WebSocket (Context):', payload);
    //   
    //   // Usar las utilidades para mapear la notificación
    //   const mappedNotification = mapWebSocketEventToNotification(payload);
    //   
    //   addNotification(mappedNotification);
    // };

    // // Manejar mensajes directos para convertirlos en notificaciones
    // const handleDirectMessage = (payload) => {
    //   // Solo crear notificación si el mensaje no es del usuario actual
    //   if (payload.senderId !== webSocketService.currentUserId) {
    //     console.log('💬 Creando notificación de mensaje nuevo (Context):', payload);
    //     handleNewNotification({
    //       type: 'new_message',
    //       eventType: 'new_message',
    //       ...payload
    //     });
    //   }
    // };

    // Cargar notificaciones iniciales solo si hay usuario autenticado
    const checkAuthAndLoad = () => {
      const token = document.cookie.match(/authToken=([^;]+)/)?.[1];
      if (token) {
        loadNotifications();
        
        // Configurar listeners de WebSocket - DESHABILITADO (ahora se usa useNotifications.js)
        // webSocketService.on('newNotification', handleNewNotification);
        // webSocketService.on('newMessage', handleNewNotification);
        // webSocketService.on('message', handleDirectMessage);
      }
    };

    checkAuthAndLoad();

    return () => {
      // Limpiar listeners - DESHABILITADO (ahora se usa useNotifications.js)
      // webSocketService.off('newNotification', handleNewNotification);
      // webSocketService.off('newMessage', handleNewNotification);
      // webSocketService.off('message', handleDirectMessage);
    };
  }, [addNotification, loadNotifications]);

  const value = {
    notifications,
    recentNotifications,
    unreadCount,
    isLoading,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};