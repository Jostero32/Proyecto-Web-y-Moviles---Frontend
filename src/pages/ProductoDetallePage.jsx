import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiMapPin, FiChevronLeft, FiMessageCircle
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { MdVerified } from 'react-icons/md';
import { productAPI, categoryAPI, userAPI, conversationAPI, authAPI, API_BASE_URL } from '../services/api';

function ProductoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactingVendor, setContactingVendor] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productAPI.getProductById(id);
        
        // Obtener información de categoría usando categoryId
        let categoryInfo = 'Sin categoría';
        let subcategoryInfo = '';
        
        if (productData.categoryId) {
          try {
            // Obtener todas las categorías para encontrar la correcta
            const allCategories = await categoryAPI.getAll();
            const productCategory = allCategories.find(cat => String(cat.id) === String(productData.categoryId));
            
            if (productCategory) {
              if (productCategory.parentCategoryId) {
                // Es una subcategoría
                subcategoryInfo = productCategory.name;
                const parentCategory = allCategories.find(cat => String(cat.id) === String(productCategory.parentCategoryId));
                categoryInfo = parentCategory ? parentCategory.name : 'Sin categoría';
              } else {
                // Es una categoría principal
                categoryInfo = productCategory.name;
              }
            }
          } catch (error) {
            console.error('Error obteniendo categorías:', error);
          }
        }
        
        // Obtener información del vendedor usando sellerId
        let sellerInfo = {
          name: 'Usuario desconocido',
          memberSince: 'Miembro nuevo',
          avatar: null
        };
        
        if (productData.sellerId) {
          try {
            const sellerData = await userAPI.getUserById(productData.sellerId);
            sellerInfo = {
              name: `${sellerData.name}${sellerData.lastname ? ' ' + sellerData.lastname : ''}`.trim(),
              memberSince: sellerData.createdAt ? 
                `Miembro desde ${new Date(sellerData.createdAt).getFullYear()}` : 'Miembro nuevo',
              avatar: sellerData.avatarUrl ? 
                (sellerData.avatarUrl.startsWith('http') ? sellerData.avatarUrl : `${API_BASE_URL}${sellerData.avatarUrl}`) : null
            };
          } catch (error) {
            console.error('Error obteniendo datos del vendedor:', error);
          }
        }
        
        // Mapear datos del backend al formato esperado por el componente
        const mappedProduct = {
          id: productData.id,
          title: productData.title,
          price: productData.price,
          description: productData.description || 'Sin descripción disponible',
          location: productData.location || 'Ubicación no especificada',
          category: categoryInfo,
          subcategory: subcategoryInfo,
          condition: productData.status === 'active' ? 'Activo' : 
                    productData.status === 'sold' ? 'Vendido' : 
                    productData.status === 'reserved' ? 'Reservado' : 'Inactivo',
          images: productData.ProductPhotos && productData.ProductPhotos.length > 0 
            ? productData.ProductPhotos.map(photo => 
                photo.url.startsWith('http') ? photo.url : `${API_BASE_URL}${photo.url}`
              )
            : ['📦'], // Emoji por defecto si no hay imágenes
          seller: sellerInfo
        };
        
        setProduct(mappedProduct);
      } catch (error) {
        console.error('Error cargando producto:', error);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);



  // Estados de loading y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EEE5E9' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EEE5E9' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el producto</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EEE5E9' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEE5E9' }}>
      {/* Contenido Principal */}
      <section className="py-8">
        <div className="sb-container">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-semibold"
          >
            <FiChevronLeft />
            Volver
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Columna Izquierda - Imágenes */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                {/* Imagen Principal */}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                  {product.images[selectedImage].startsWith('http') ? (
                    <img 
                      src={product.images[selectedImage]} 
                      alt={product.title}
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="text-9xl">
                      {product.images[selectedImage]}
                    </div>
                  )}
                  <div className="w-full h-full items-center justify-center text-9xl hidden">
                    📦
                  </div>
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square bg-gray-100 rounded-xl flex items-center justify-center transition-all overflow-hidden ${
                        selectedImage === idx ? 'ring-4 ring-orange-500' : 'hover:ring-2 ring-gray-300'
                      }`}
                    >
                      {img.startsWith('http') ? (
                        <img 
                          src={img} 
                          alt={`${product.title} ${idx + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="text-4xl">
                          {img}
                        </div>
                      )}
                      <div className="w-full h-full items-center justify-center text-4xl hidden">
                        📦
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-black text-gray-900 mb-4">Descripción</h2>
                <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 max-h-64 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-8 pt-8 border-t">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Categoría</p>
                    <p className="font-semibold">
                      {product.category}
                      {product.subcategory && (
                        <span className="text-gray-600"> → {product.subcategory}</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estado</p>
                    <p className="font-semibold">{product.condition}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Info y Acciones */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                {/* Estado del producto */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full ${
                    product.condition === 'Activo' ? 'bg-green-500 text-white' :
                    product.condition === 'Vendido' ? 'bg-gray-500 text-white' :
                    product.condition === 'Reservado' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.condition}
                  </span>
                </div>

                {/* Título y Precio */}
                <h1 className="text-3xl font-black text-gray-900 mb-4">
                  {product.title}
                </h1>
                <p className="text-5xl font-black mb-6" style={{ color: '#CF5C36' }}>
                  ${product.price}
                </p>

                {/* Ubicación */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMapPin className="text-xl" />
                    <span>{product.location}</span>
                  </div>
                </div>

                {/* Botón de Acción */}
                <div className="mb-6">
                  <button
                    onClick={() => alert('Funcionalidad de chat próximamente')}
                    className="w-full py-4 text-white font-bold rounded-xl transition-all hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#CF5C36' }}>
                    <FiMessageCircle className="text-xl" />
                    Contactar vendedor
                  </button>
                </div>

                {/* Info del Vendedor */}
                <div className="pt-6 border-t">
                  <p className="text-sm text-gray-500 mb-3">Vendedor</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold overflow-hidden">
                      {product.seller.avatar ? (
                        <img 
                          src={product.seller.avatar} 
                          alt={product.seller.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {product.seller.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="w-full h-full items-center justify-center text-white font-bold hidden">
                        {product.seller.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {product.seller.name}
                      </p>
                      <p className="text-sm text-gray-500">{product.seller.memberSince}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Consejos de Seguridad - Tarjeta separada */}
              <div className="bg-yellow-50 rounded-3xl p-6 shadow-lg mt-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🔒 Consejos de seguridad
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Verifica el producto antes de pagar</li>
                  <li>• Reúnete en lugares públicos</li>
                  <li>• No transfieras dinero sin ver el producto</li>
                  <li>• Desconfía de precios muy bajos</li>
                </ul>
              </div>
            </div>
          </div>


        </div>
      </section>
    </div>
  );
}

export default ProductoDetallePage;
