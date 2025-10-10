import { useState, useEffect } from 'react';
import { authAPI, productAPI, API_BASE_URL } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi';

function MisProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyProducts = async () => {
      try {
        // Verificar autenticación
        if (!authAPI.isAuthenticated()) {
          navigate('/login');
          return;
        }

        // Obtener productos del usuario
        const response = await productAPI.getMyProducts();
        console.log('Productos del backend:', response); // Debug temporal
        
        // Mapear productos del backend al formato del frontend
        const mappedProducts = response.map(product => ({
          id: product.id,
          nombre: product.title,
          precio: product.price,
          estado: product.status === 'active' ? 'Activo' : 
                 product.status === 'sold' ? 'Vendido' : 
                 product.status === 'reserved' ? 'Reservado' : 'Inactivo',
          visitas: 0, // El backend no tiene este campo aún
          imagen: product.ProductPhotos && product.ProductPhotos.length > 0 
            ? (product.ProductPhotos[0].url.startsWith('http') 
               ? product.ProductPhotos[0].url 
               : `${API_BASE_URL}${product.ProductPhotos[0].url}`)
            : "📦", // Emoji por defecto si no hay imagen
          categoria: product.Category ? product.Category.name : 'Sin categoría',
          fecha: product.createdAt || new Date().toISOString()
        }));

        setProductos(mappedProducts);
      } catch (error) {
        console.error('Error cargando productos:', error);
        // Si hay error de autenticación, redirigir al login
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          // Para otros errores, mostrar productos vacíos
          setProductos([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadMyProducts();
  }, [navigate]);

  const handleEliminar = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      setProductos(prev => prev.filter(p => p.id !== id));
      alert('Producto eliminado exitosamente');
    }
  };

  const handleEditar = (id) => {
    alert(`Redirigiendo a editar producto ID: ${id}`);
    // navigate(`/editar-producto/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="sb-container">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sb-container">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mis Productos</h1>
            <p className="text-gray-600 mt-1">Gestiona tus publicaciones ({productos.length} productos)</p>
          </div>
          <Link
            to="/vender"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center gap-2 shadow-md"
          >
            <FiPlus className="text-xl" />
            Nuevo Producto
          </Link>
        </div>

        {productos.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {productos.map((producto) => (
              <div key={producto.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Imagen del producto */}
                  <div className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {producto.imagen && producto.imagen.startsWith('http') ? (
                      <img 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-6xl ${producto.imagen && producto.imagen.startsWith('http') ? 'hidden' : ''}`}>
                      {producto.imagen && producto.imagen.startsWith('http') ? '📦' : producto.imagen}
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{producto.nombre}</h3>
                        <p className="text-sm text-gray-500">{producto.categoria} • Publicado el {new Date(producto.fecha).toLocaleDateString('es-EC')}</p>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                        producto.estado === 'Activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {producto.estado}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mb-4 flex-wrap">
                      <span className="text-orange-600 font-bold text-2xl">${producto.precio}</span>
                      <span className="flex items-center gap-2 text-gray-600">
                        <FiEye /> {producto.visitas} visitas
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEditar(producto.id)}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <FiEdit />
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(producto.id, producto.nombre)}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <FiTrash2 />
                        Eliminar
                      </button>
                      <Link
                        to={`/producto/${producto.id}`}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <FiEye />
                        Ver publicación
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes productos publicados</h3>
            <p className="text-gray-600 mb-6">Comienza a vender tus artículos ahora</p>
            <Link
              to="/vender"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              <FiPlus />
              Publicar mi primer producto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MisProductosPage;
