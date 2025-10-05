import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiHeart, FiShare2, FiMapPin, FiClock, FiChevronLeft,
  FiChevronRight, FiMessageCircle, FiPhone
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { MdVerified } from 'react-icons/md';

function ProductoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Simulación de datos del producto
  const product = {
    id: id,
    title: 'iPhone 14 Pro Max 128GB en excelente estado',
    price: 890,
    images: ['📱', '📱', '📱', '📱'],
    description: `iPhone 14 Pro Max de 128GB en excelente estado cosmético y funcional.

    Características:
    - Color: Morado Oscuro (Deep Purple)
    - Almacenamiento: 128GB
    - Estado de batería: 98%
    - Sin golpes ni rayones
    - Incluye caja original
    - Cargador original
    - Cable Lightning

    El teléfono funciona perfectamente, nunca ha sido reparado. Se entrega con todos sus accesorios originales y en su caja.

    Acepto cambios por otros dispositivos Apple de menor valor + diferencia.`,
    category: 'Tecnología',
    location: 'Quito Centro',
    condition: 'Usado - Como nuevo',
    publishedDate: '2 días atrás',
    views: 1234,
    isNew: true,
    verified: true,
    seller: {
      name: 'Juan Pérez',
      memberSince: 'Miembro desde 2022',
      rating: 4.8,
      totalSales: 47,
      verified: true
    }
  };

  const relatedProducts = [
    { id: 2, image: '⌚', title: 'Apple Watch Series 9', price: 320, location: 'Quito' },
    { id: 3, image: '🎧', title: 'AirPods Pro 2da Gen', price: 180, location: 'Quito Norte' },
    { id: 4, image: '💻', title: 'MacBook Air M2', price: 950, location: 'Quito Sur' },
    { id: 5, image: '📱', title: 'iPhone 13 Pro', price: 750, location: 'Quito Centro' },
  ];

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
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-9xl mb-4">
                  {product.images[selectedImage]}
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-4xl transition-all ${
                        selectedImage === idx ? 'ring-4 ring-orange-500' : 'hover:ring-2 ring-gray-300'
                      }`}
                    >
                      {img}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-black text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Categoría</p>
                    <p className="font-semibold">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Condición</p>
                    <p className="font-semibold">{product.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Vistas</p>
                    <p className="font-semibold">{product.views}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Info y Acciones */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.isNew && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
                      <HiSparkles />
                      NUEVO
                    </span>
                  )}
                  {product.verified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                      <MdVerified />
                      Verificado
                    </span>
                  )}
                </div>

                {/* Título y Precio */}
                <h1 className="text-3xl font-black text-gray-900 mb-4">
                  {product.title}
                </h1>
                <p className="text-5xl font-black mb-6" style={{ color: '#CF5C36' }}>
                  ${product.price}
                </p>

                {/* Ubicación y Fecha */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMapPin className="text-xl" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock className="text-xl" />
                    <span>Publicado {product.publishedDate}</span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="space-y-3 mb-6">
                  <button className="w-full py-4 text-white font-bold rounded-xl transition-all hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#CF5C36' }}>
                    <FiMessageCircle className="text-xl" />
                    Contactar vendedor
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`flex-1 py-3 border-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        isFavorite
                          ? 'border-red-500 text-red-500 bg-red-50'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <FiHeart className={isFavorite ? 'fill-red-500' : ''} />
                      {isFavorite ? 'Guardado' : 'Guardar'}
                    </button>
                    <button className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                      <FiShare2 />
                      Compartir
                    </button>
                  </div>
                </div>

                {/* Info del Vendedor */}
                <div className="pt-6 border-t">
                  <p className="text-sm text-gray-500 mb-3">Vendedor</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                      {product.seller.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 flex items-center gap-1">
                        {product.seller.name}
                        {product.seller.verified && <MdVerified className="text-blue-500" />}
                      </p>
                      <p className="text-sm text-gray-500">{product.seller.memberSince}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-2xl font-bold">{product.seller.rating}</span>
                      <span className="text-gray-500"> ⭐</span>
                    </div>
                    <div className="text-gray-600">
                      {product.seller.totalSales} ventas
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

          {/* Productos Relacionados */}
          <div className="mt-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Productos similares</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/producto/${item.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-2"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-6xl">
                    {item.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-2xl font-black" style={{ color: '#CF5C36' }}>${item.price}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                      <FiMapPin className="text-xs" />
                      {item.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductoDetallePage;
