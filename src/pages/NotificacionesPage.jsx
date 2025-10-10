import { useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiWifi, FiZap, FiWifiOff } from 'react-icons/fi';
import { useWebSocket, useWebSocketNotifications } from '../hooks/useWebSocket';

function NotificacionesPage() {
  const navigate = useNavigate();

  // WebSocket hooks
  const { isConnected, reconnectStatus, connect: connectWS } = useWebSocket();
  const { notifications } = useWebSocketNotifications();

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Conectar a WebSocket para recibir notificaciones
    const initWebSocket = async () => {
      try {
        await connectWS();
      } catch (error) {
        console.error('Error conectando WebSocket para notificaciones:', error);
      }
    };

    initWebSocket();
  }, [navigate, connectWS]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sb-container max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">Notificaciones</h1>
          <p className="text-gray-600 mt-1">Sistema de notificaciones en tiempo real</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FiBell className="text-6xl text-gray-300" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiZap className="text-white text-lg" />
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sistema de Notificaciones WebSockets</h3>
          
          <div className="max-w-md mx-auto">
            <div className={`flex items-center justify-center gap-3 mb-4 p-4 rounded-lg border transition-colors ${
              isConnected 
                ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-100' 
                : reconnectStatus.isReconnecting
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-100'
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-100'
            }`}>
              {isConnected ? (
                <>
                  <FiWifi className="text-green-600 text-xl" />
                  <span className="text-green-800 font-semibold">Conectado - Tiempo Real</span>
                </>
              ) : reconnectStatus.isReconnecting ? (
                <>
                  <FiWifiOff className="text-yellow-600 text-xl animate-pulse" />
                  <span className="text-yellow-800 font-semibold">
                    Reconectando... ({reconnectStatus.attempts}/{reconnectStatus.maxAttempts})
                  </span>
                </>
              ) : (
                <>
                  <FiWifiOff className="text-red-600 text-xl" />
                  <span className="text-red-800 font-semibold">Desconectado</span>
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">
              Las notificaciones ahora funcionan con <strong>WebSockets</strong> para obtener actualizaciones instantáneas sin necesidad de recargar la página.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="font-semibold text-green-800 mb-1">✅ Mensajes</div>
                <div className="text-green-600">Notificaciones instantáneas</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="font-semibold text-blue-800 mb-1">🔄 Tiempo Real</div>
                <div className="text-blue-600">Sin recargas necesarias</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="font-semibold text-purple-800 mb-1">⚡ Rápido</div>
                <div className="text-purple-600">Latencia mínima</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="font-semibold text-orange-800 mb-1">📱 Móvil</div>
                <div className="text-orange-600">Compatible con PWA</div>
              </div>
            </div>
            
            {/* Mostrar notificaciones recibidas por WebSocket */}
            {notifications.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-bold text-gray-900">Notificaciones Recientes:</h4>
                {notifications.slice(0, 5).map((notification, index) => (
                  <div key={notification.id || index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiBell className="text-blue-600" />
                        <span className="text-sm font-semibold text-blue-800">
                          {notification.title || 'Nueva notificación'}
                        </span>
                      </div>
                      <span className="text-xs text-blue-600">
                        {new Date(notification.timestamp || Date.now()).toLocaleTimeString('es-EC', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    {notification.content && (
                      <p className="text-sm text-blue-700 mt-1">{notification.content}</p>
                    )}
                  </div>
                ))}
                {notifications.length > 5 && (
                  <p className="text-xs text-gray-500 text-center">
                    y {notifications.length - 5} notificaciones más...
                  </p>
                )}
              </div>
            )}
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Estado:</strong> Sistema WebSocket funcional para notificaciones en tiempo real.
                {isConnected && <span className="text-green-600 ml-1">✅ Listo para recibir notificaciones</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificacionesPage;
