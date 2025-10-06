import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiMapPin, FiEye, FiShoppingBag } from 'react-icons/fi';

function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Simulación de productos favoritos
    setFavoritos([
      {
        id: 1,
        titulo: 'iPhone 14 Pro Max 128GB',
        precio: 890,
        imagen: '📱',
        ubicacion: 'Quito Centro',
        vendedor: 'Juan Pérez',
        fechaGuardado: '2024-01-15'
      },
      {
        id: 2,
        titulo: 'MacBook Pro M3 512GB',
        precio: 1850,
        imagen: '💻',
        ubicacion: 'Quito Norte',
        vendedor: 'María García',
        fechaGuardado: '2024-01-12'
      },
      {
        id: 3,
        titulo: 'AirPods Pro 2da Gen',
        precio: 180,
        imagen: '🎧',
        ubicacion: 'Quito Sur',
        vendedor: 'Carlos López',
        fechaGuardado: '2024-01-10'
      },
    ]);
  }, [navigate]);

  const eliminarFavorito = (id, titulo) => {
    if (window.confirm(`¿Quitar "${titulo}" de favoritos?`)) {
      setFavoritos(prev => prev.filter(fav => fav.id !== id));
    }
  };

  const eliminarTodos = () => {
    if (window.confirm('¿Eliminar todos los favoritos?')) {
      setFavoritos([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sb-container">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mis Favoritos</h1>
            <p className="text-gray-600 mt-1">
              {favoritos.length > 0
                ? `${favoritos.length} producto${favoritos.length > 1 ? 's' : ''} guardado${favoritos.length > 1 ? 's' : ''}`
                : 'No tienes favoritos guardados'}
            </p>
          </div>
          {favoritos.length > 0 && (
            <button
              onClick={eliminarTodos}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold flex items-center gap-2 border border-red-200"
            >
              <FiTrash2 />
              Eliminar todos
            </button>
          )}
        </div>

        {favoritos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((producto) => (
              <div key={producto.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                {/* Imagen del producto */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-8xl">
                  {producto.imagen}
                  <button
                    onClick={() => eliminarFavorito(producto.id, producto.titulo)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group"
                    title="Quitar de favoritos"
                  >
                    <FiHeart className="text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Información del producto */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {producto.titulo}
                  </h3>
                  <p className="text-orange-600 font-bold text-2xl mb-3">
                    ${producto.precio}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FiMapPin className="text-orange-600 flex-shrink-0" />
                    <span className="truncate">{producto.ubicacion}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Guardado el {new Date(producto.fechaGuardado).toLocaleDateString('es-EC', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      to={`/producto/${producto.id}`}
                      className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                    >
                      <FiEye />
                      Ver
                    </Link>
                    <button
                      onClick={() => eliminarFavorito(producto.id, producto.titulo)}
                      className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FiHeart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes favoritos guardados</h3>
            <p className="text-gray-600 mb-6">Explora productos y guarda los que te interesen</p>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              <FiShoppingBag />
              Explorar productos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritosPage;
