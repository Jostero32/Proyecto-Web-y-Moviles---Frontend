import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheck, FiTrash2, FiPackage, FiMessageSquare, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Simulación de notificaciones
    setNotificaciones([
      {
        id: 1,
        tipo: 'mensaje',
        icono: FiMessageSquare,
        color: 'blue',
        texto: 'Nuevo mensaje de Juan sobre tu iPhone 13 Pro',
        fecha: 'Hace 2 horas',
        leida: false
      },
      {
        id: 2,
        tipo: 'venta',
        icono: FiDollarSign,
        color: 'green',
        texto: 'Tu producto "MacBook Air M2" ha sido vendido',
        fecha: 'Hace 1 día',
        leida: false
      },
      {
        id: 3,
        tipo: 'producto',
        icono: FiPackage,
        color: 'orange',
        texto: 'Tu publicación "Bicicleta de montaña" ha recibido 5 nuevas visitas',
        fecha: 'Hace 2 días',
        leida: true
      },
      {
        id: 4,
        tipo: 'mensaje',
        icono: FiMessageSquare,
        color: 'blue',
        texto: 'María preguntó por tu bicicleta',
        fecha: 'Hace 3 días',
        leida: true
      },
    ]);
  }, [navigate]);

  const marcarComoLeida = (id) => {
    setNotificaciones(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const eliminarNotificacion = (id) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
  };

  const marcarTodasLeidas = () => {
    setNotificaciones(prev =>
      prev.map(notif => ({ ...notif, leida: true }))
    );
  };

  const eliminarTodasLeidas = () => {
    if (window.confirm('¿Eliminar todas las notificaciones leídas?')) {
      setNotificaciones(prev => prev.filter(notif => !notif.leida));
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

        {notificaciones.length === 0 && (
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
