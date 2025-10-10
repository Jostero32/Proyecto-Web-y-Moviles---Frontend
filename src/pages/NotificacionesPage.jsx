import { useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiWifi, FiZap } from 'react-icons/fi';

function NotificacionesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

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
            <div className="flex items-center justify-center gap-3 mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <FiWifi className="text-blue-600 text-xl" />
              <span className="text-blue-800 font-semibold">Conexión en Tiempo Real</span>
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
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Próximamente:</strong> Panel de gestión de notificaciones, configuración de preferencias y historial completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificacionesPage;
