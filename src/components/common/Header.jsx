import { Link } from 'react-router-dom';
import logo from '../../assets/Logo de Shop&Buy.png';

function Header() {
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

          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/"
              className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md"
              style={{ color: '#CF5C36' }}
            >
              Vender
            </Link>
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
