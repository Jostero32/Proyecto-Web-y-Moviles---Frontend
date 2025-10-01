import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import logo from '../../assets/Logo de Shop&Buy.png';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Verificar si hay sesión activa
    const checkAuth = () => {
      if (authAPI.isAuthenticated()) {
        setIsLoggedIn(true);
        const user = authAPI.getUserData();
        setUserData(user);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkAuth();
    
    // Revisar cada 30 segundos si sigue autenticado
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    window.location.href = '/';
  };

  // Función para obtener avatar URL
  const getAvatarUrl = (user) => {
    if (!user) return null;
    
    // Si es una URL completa, usarla directamente
    if (user.avatarUrl?.startsWith('http') || user.avatarUrl?.startsWith('data:')) {
      return user.avatarUrl;
    }
    
    // Si es una ruta del servidor, construir URL completa
    if (user.avatarUrl?.startsWith('/')) {
      return `http://localhost:8080${user.avatarUrl}`;
    }
    
    // Fallback
    return null;
  };

  // Función para obtener rol del usuario
  const getUserRole = (user) => {
    if (!user) return 'Usuario';
    
    // Si viene en el token decodificado
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles[0] || 'Usuario';
    }
    
    // Si no hay roles, intentar decodificar el token actual
    if (authAPI.isAuthenticated()) {
      try {
        const token = document.cookie.match(/authToken=([^;]+)/)?.[1];
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.roles?.[0] || 'Usuario';
        }
      } catch (error) {
        console.log('Error decodificando token para rol:', error);
      }
    }
    
    // Fallback
    return user.role || 'Usuario';
  };

  // Función para obtener nombre del usuario
  const getUserName = (user) => {
    if (!user) return 'Usuario';
    
    // Si tiene nombre y apellido
    if (user.name) {
      return `${user.name} ${user.lastname || ''}`.trim();
    }
    
    // Si no hay nombre, intentar decodificar el token
    if (authAPI.isAuthenticated()) {
      try {
        const token = document.cookie.match(/authToken=([^;]+)/)?.[1];
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.email) {
            return payload.email.split('@')[0]; // Usar parte antes del @
          }
        }
      } catch (error) {
        console.log('Error decodificando token para nombre:', error);
      }
    }
    
    // Fallback usando email si está disponible
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Usuario';
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Barra principal */}
      <div style={{ backgroundColor: '#CF5C36' }}>
        <div className="sb-container flex items-center justify-between py-4">
          {/* Logo y marca */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={logo}
                alt="Shop&Buy logo"
                className="h-12 w-12 rounded-xl shadow-md bg-white p-1 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="text-white">
              <h1 className="font-black text-xl tracking-tight">Shop&Buy</h1>
              <p className="text-xs opacity-90 -mt-1">Compra • Vende • Descubre</p>
            </div>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-white hover:text-yellow-200 font-medium transition-colors">
              Explorar
            </Link>
            <Link to="/" className="text-white hover:text-yellow-200 font-medium transition-colors">
              Categorías
            </Link>
            <Link to="/" className="text-white hover:text-yellow-200 font-medium transition-colors">
              Cómo funciona
            </Link>
          </nav>

          {/* Botones de acción o perfil de usuario */}
          <div className="flex items-center gap-3">
            {isLoggedIn && userData ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {/* Avatar circular */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 border-2 border-white/30">
                    {getAvatarUrl(userData) ? (
                      <img
                        src={getAvatarUrl(userData)}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-lg">
                        👤
                      </div>
                    )}
                  </div>
                  
                  {/* Info del usuario */}
                  <div className="text-left text-white hidden sm:block">
                    <p className="font-semibold text-sm leading-tight">
                      {getUserName(userData)}
                    </p>
                    <p className="text-xs opacity-75 leading-tight">
                      {getUserRole(userData)}
                    </p>
                  </div>
                  
                  {/* Flecha */}
                  <div className="text-white/70">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Mi perfil
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Mis pedidos
                    </Link>
                    <Link
                      to="/sell"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Vender producto
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                  style={{ color: '#CF5C36' }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ backgroundColor: '#EEE5E9' }} className="border-b border-gray-200">
        <div className="sb-container py-3">
          <form className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="search"
                placeholder="¿Qué estás buscando? iPhone, sofá, bicicleta..."
                className="w-full pl-12 pr-24 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-gray-700"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                style={{ backgroundColor: '#CF5C36' }}
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}

export default Header;
