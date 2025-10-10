import { useState, useEffect } from 'react';
import { authAPI, notificationAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheck, FiTrash2, FiPackage, FiMessageSquare, FiDollarSign, FiCheckCircle, FiHeart, FiUser, FiShoppingCart } from 'react-icons/fi';

// Mapeo de tipos de notificación del backend con UI
const getNotificationTypeConfig = (typeName) => {
  const typeConfigs = {
    // Tipos basados en el backend NotificationType
    'NEW_MESSAGE': { icon: FiMessageSquare, color: 'blue' },
    'PRODUCT_SOLD': { icon: FiDollarSign, color: 'green' },
    'PRODUCT_LIKED': { icon: FiHeart, color: 'red' },
    'PRODUCT_VIEWED': { icon: FiPackage, color: 'orange' },
    'NEW_FOLLOWER': { icon: FiUser, color: 'purple' },
    'PURCHASE_CONFIRMED': { icon: FiShoppingCart, color: 'green' },
    // Fallback para tipos desconocidos
    'DEFAULT': { icon: FiBell, color: 'gray' }
  };
  
  return typeConfigs[typeName] || typeConfigs['DEFAULT'];
};

// Función para formatear fecha relativa
const formatRelativeTime = (dateString) => {
  const now = new Date();
  const notificationDate = new Date(dateString);
  const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora mismo';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  
  return notificationDate.toLocaleDateString('es-EC', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para cargar notificaciones desde el backend
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const backendNotifications = await notificationAPI.getNotifications();
      
      // Mapear los datos del backend al formato de la UI
      const mappedNotifications = backendNotifications.map(notification => {
        const typeConfig = getNotificationTypeConfig(notification.NotificationType?.name);
        
        return {
          id: notification.id,
          tipo: notification.NotificationType?.name || 'DEFAULT',
          icono: typeConfig.icon,
          color: typeConfig.color,
          texto: notification.content,
          fecha: formatRelativeTime(notification.createdAt),
          leida: notification.isRead,
          // Datos adicionales del backend
          originalData: notification
        };
      });
      
      setNotificaciones(mappedNotifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      // En caso de error, mostrar array vacío
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadNotifications();
  }, [navigate]);

  const marcarComoLeida = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      // Actualizar estado local
      setNotificaciones(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const eliminarNotificacion = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      // Actualizar estado local
      setNotificaciones(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      await notificationAPI.markAllAsRead();
      // Actualizar estado local
      setNotificaciones(prev =>
        prev.map(notif => ({ ...notif, leida: true }))
      );
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const eliminarTodasLeidas = async () => {
    if (window.confirm('¿Eliminar todas las notificaciones leídas?')) {
      try {
        await notificationAPI.deleteAllRead();
        // Actualizar estado local
        setNotificaciones(prev => prev.filter(notif => !notif.leida));
      } catch (error) {
        console.error('Error al eliminar notificaciones leídas:', error);
      }
    }
  };

  const getColorClasses = (color, leida) => {
    if (leida) return 'border-gray-300 bg-gray-50';

    const colors = {
      blue: 'border-blue-500 bg-blue-50',
      green: 'border-green-500 bg-green-50',
      orange: 'border-orange-500 bg-orange-50'
    };
    return colors[color] || colors.orange;
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sb-container max-w-4xl">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Notificaciones</h1>
            <p className="text-gray-600 mt-1">
              {noLeidas > 0 ? `Tienes ${noLeidas} notificación${noLeidas > 1 ? 'es' : ''} nueva${noLeidas > 1 ? 's' : ''}` : 'No tienes notificaciones nuevas'}
            </p>
          </div>
          <div className="flex gap-2">
            {noLeidas > 0 && (
              <button
                onClick={marcarTodasLeidas}
                className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-semibold flex items-center gap-2 border border-green-200"
              >
                <FiCheckCircle />
                Marcar todas leídas
              </button>
            )}
            {notificaciones.some(n => n.leida) && (
              <button
                onClick={eliminarTodasLeidas}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold flex items-center gap-2 border border-red-200"
              >
                <FiTrash2 />
                Limpiar leídas
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {/* Skeleton loading para notificaciones */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-gray-300 p-4 rounded-r-xl bg-white shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {notificaciones.map((notif) => {
              const Icono = notif.icono;
              return (
                <div
                  key={notif.id}
                  className={`border-l-4 p-4 rounded-r-xl bg-white shadow-sm transition-all ${
                    getColorClasses(notif.color, notif.leida)
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !notif.leida ? `bg-${notif.color}-100` : 'bg-gray-200'
                    }`}>
                      <Icono className={`text-lg ${!notif.leida ? `text-${notif.color}-600` : 'text-gray-500'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${!notif.leida ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notif.texto}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{notif.fecha}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {!notif.leida && (
                        <button
                          onClick={() => marcarComoLeida(notif.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marcar como leída"
                        >
                          <FiCheck className="text-lg" />
                        </button>
                      )}
                      <button
                        onClick={() => eliminarNotificacion(notif.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && notificaciones.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FiBell className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes notificaciones</h3>
            <p className="text-gray-600">Cuando tengas novedades, aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificacionesPage;
