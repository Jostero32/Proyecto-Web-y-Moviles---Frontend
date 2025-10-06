import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiUser,
  FiPackage,
  FiBell,
  FiHeart,
  FiMessageSquare,
  FiSettings,
  FiShoppingBag,
  FiDollarSign,
  FiEye
} from 'react-icons/fi';

function UserPanelPage() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Verificar autenticación
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = authAPI.getUserData();
    setUserData(user);

    // Obtener el tab activo de la URL
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [navigate, searchParams]);

  const tabs = [
    { id: 'perfil', label: 'Mi Perfil', icon: FiUser },
    { id: 'productos', label: 'Mis Productos', icon: FiPackage },
    { id: 'notificaciones', label: 'Notificaciones', icon: FiBell },
    { id: 'favoritos', label: 'Favoritos', icon: FiHeart },
    { id: 'mensajes', label: 'Mis Mensajes', icon: FiMessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <PerfilTab userData={userData} />;
      case 'productos':
        return <ProductosTab />;
      case 'notificaciones':
        return <NotificacionesTab />;
      case 'favoritos':
        return <FavoritosTab />;
      case 'mensajes':
        return <MensajesTab />;
      default:
        return <PerfilTab userData={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sb-container">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">Panel de Usuario</h1>
          <p className="text-gray-600 mt-1">Gestiona tu cuenta y actividad</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar con tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${
                      activeTab === tab.id
                        ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Perfil
function PerfilTab({ userData }) {
  const getAvatarUrl = (user) => {
    if (!user) return null;
    if (user.avatarUrl?.startsWith('data:')) return user.avatarUrl;
    if (user.avatarUrl?.startsWith('http://localhost:8080')) return user.avatarUrl;
    if (user.avatarUrl?.startsWith('/')) return `http://localhost:8080${user.avatarUrl}`;
    if (user.dni) return `http://localhost:8080/uploads/users/${user.dni}/${user.dni}.jpg`;
    return `http://localhost:8080/uploads/common/user-common.png`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-orange-100">
            {getAvatarUrl(userData) ? (
              <img
                src={getAvatarUrl(userData)}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                👤
              </div>
            )}
          </div>
          <button className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
            Cambiar foto
          </button>
        </div>

        {/* Información del usuario */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                defaultValue={userData?.name || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                defaultValue={userData?.lastname || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue={userData?.email || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                defaultValue={userData?.phone || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <button className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de Productos
function ProductosTab() {
  const productos = [
    { id: 1, nombre: 'iPhone 13', precio: 450, estado: 'Activo', visitas: 23 },
    { id: 2, nombre: 'Bicicleta de montaña', precio: 280, estado: 'Activo', visitas: 12 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mis Productos</h2>
        <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center gap-2">
          <FiPackage />
          Nuevo Producto
        </button>
      </div>

      <div className="space-y-4">
        {productos.map((producto) => (
          <div key={producto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{producto.nombre}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-orange-600 font-bold text-xl">${producto.precio}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {producto.estado}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600 text-sm">
                    <FiEye /> {producto.visitas} visitas
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Editar
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de Notificaciones
function NotificacionesTab() {
  const notificaciones = [
    { id: 1, tipo: 'mensaje', texto: 'Nuevo mensaje de Juan sobre tu iPhone 13', fecha: 'Hace 2 horas' },
    { id: 2, tipo: 'venta', texto: 'Tu producto "Bicicleta" ha sido vendido', fecha: 'Hace 1 día' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h2>

      <div className="space-y-3">
        {notificaciones.map((notif) => (
          <div key={notif.id} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
            <p className="text-gray-900 font-medium">{notif.texto}</p>
            <p className="text-sm text-gray-600 mt-1">{notif.fecha}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de Favoritos
function FavoritosTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Favoritos</h2>

      <div className="text-center py-12">
        <FiHeart className="mx-auto text-6xl text-gray-300 mb-4" />
        <p className="text-gray-600 text-lg">No tienes productos favoritos aún</p>
        <button className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Explorar productos
        </button>
      </div>
    </div>
  );
}

// Componente de Mensajes
function MensajesTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Mensajes</h2>

      <div className="text-center py-12">
        <FiMessageSquare className="mx-auto text-6xl text-gray-300 mb-4" />
        <p className="text-gray-600 text-lg">No tienes mensajes nuevos</p>
      </div>
    </div>
  );
}

export default UserPanelPage;
