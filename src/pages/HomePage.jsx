import { Link } from 'react-router-dom';
import logo from '../assets/Logo de Shop&Buy.png';

function CategoryCard({ icon, title, count }) {
  return (
    <Link
      to="/"
      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{count} publicaciones</p>
    </Link>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <h3 className="font-bold text-xl text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
  );
}

function ProductCard({ image, title, price, location, isNew }) {
  return (
    <Link to="/" className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl text-gray-300">
          {image}
        </div>
        {isNew && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
            NUEVITO
          </span>
        )}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
          ❤️
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold" style={{ color: '#CF5C36' }}>${price}</span>
          <span className="text-sm text-gray-500">📍 {location}</span>
        </div>
      </div>
    </Link>
  );
}

function HomePage() {
  const categories = [
    { icon: '📱', title: 'Tecnología', count: '12.5k' },
    { icon: '🏠', title: 'Casa y Hogar', count: '8.2k' },
    { icon: '👕', title: 'Ropa y Moda', count: '15.1k' },
    { icon: '⚽', title: 'Deportes', count: '6.8k' },
    { icon: '🚗', title: 'Carros y Motos', count: '4.3k' },
    { icon: '🎮', title: 'Gaming', count: '7.9k' },
  ];

  const featuredProducts = [
    { image: '📱', title: 'iPhone 14 Pro Max 128GB', price: 890, location: 'Quito', isNew: true },
    { image: '🛋️', title: 'Mueble de sala esquinero', price: 250, location: 'Guayaquil', isNew: false },
    { image: '🚲', title: 'Bicicleta de montaña Trek', price: 420, location: 'Cuenca', isNew: false },
    { image: '⌚', title: 'Apple Watch Series 9', price: 320, location: 'Ambato', isNew: true },
    { image: '📷', title: 'Cámara Canon EOS R6', price: 1200, location: 'Manta', isNew: false },
    { image: '🎧', title: 'AirPods Pro 2da Gen', price: 180, location: 'Loja', isNew: true },
    { image: '💻', title: 'MacBook Air M2', price: 950, location: 'Machala', isNew: false },
    { image: '🎮', title: 'PlayStation 5 + 2 juegos', price: 480, location: 'Riobamba', isNew: false },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEE5E9' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-yellow-400/20"></div>
        <div className="sb-container relative py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">+50.000 panas activos</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Encuentra cosas cheveres
                <span className="block" style={{ color: '#CF5C36' }}>
                  cerca de ti
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Compra y vende cosas de segunda mano de manera segura.
                Miles de productos bacanes te están esperando.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/"
                  className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
                  style={{ backgroundColor: '#CF5C36' }}
                >
                  🚀 Dale, a explorar
                </Link>
                <Link
                  to="/"
                  className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-gray-300 text-center"
                >
                  📤 Vender algo
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-black text-gray-900">250k+</div>
                  <div className="text-sm text-gray-600">Panas</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900">1.2M+</div>
                  <div className="text-sm text-gray-600">Productos</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Satisfechos</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Contenedor principal minimalista */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 overflow-hidden">

                {/* Efectos de fondo sutiles */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50"></div>
                <div className="absolute top-8 right-8 w-20 h-20 rounded-full opacity-5" style={{ backgroundColor: '#CF5C36' }}></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full opacity-5" style={{ backgroundColor: '#EFC88B' }}></div>

                {/* Logo principal con efectos */}
                <div className="relative text-center">
                  {/* Círculos concéntricos alrededor del logo */}
                  <div className="relative inline-block">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 animate-spin" style={{ borderColor: '#CF5C36', animationDuration: '20s' }}></div>
                    <div className="absolute inset-2 rounded-full border border-dotted opacity-20 animate-spin" style={{ borderColor: '#EFC88B', animationDuration: '15s', animationDirection: 'reverse' }}></div>

                    {/* Logo central */}
                    <div className="relative p-8">
                      <img
                        src={logo}
                        alt="Shop&Buy"
                        className="w-48 h-48 object-contain mx-auto transform hover:scale-105 transition-all duration-500 ease-out"
                      />
                    </div>
                  </div>

                  {/* Título elegante */}
                  <div className="mt-8">
                    <h2 className="text-3xl font-black mb-2" style={{ color: '#CF5C36' }}>Shop&Buy</h2>
                    <p className="text-gray-600 text-lg font-medium">Ecuador's Marketplace</p>
                  </div>

                  {/* Puntos decorativos animados */}
                  <div className="flex justify-center gap-3 mt-8">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#CF5C36' }}></div>
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#EFC88B', animationDelay: '0.5s' }}></div>
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#7C7C7C', animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Efectos de brillo en las esquinas */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-white to-transparent opacity-60 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-gray-100 to-transparent opacity-40 rounded-full blur-3xl"></div>
              </div>

              {/* Partículas flotantes alrededor */}
              <div className="absolute -top-4 -left-4 w-6 h-6 rounded-full opacity-40 animate-float" style={{ backgroundColor: '#CF5C36' }}></div>
              <div className="absolute -bottom-4 -right-4 w-4 h-4 rounded-full opacity-30 animate-float" style={{ backgroundColor: '#EFC88B', animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 -right-6 w-5 h-5 rounded-full opacity-35 animate-float" style={{ backgroundColor: '#7C7C7C', animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="sb-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Busca por categorías
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra justo lo que necesitas en nuestras categorías más populares
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" style={{ backgroundColor: '#EEE5E9' }}>
        <div className="sb-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              ¿Por qué elegir Shop&Buy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plataforma más confiable y fácil para comprar y vender productos usados en Ecuador
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🛡️"
              title="100% Seguro"
              description="Verificamos a todos los usuarios y ofrecemos pagos protegidos para tu tranquilidad."
              color="#CF5C36"
            />
            <FeatureCard
              icon="📍"
              title="Cerquita tuyo"
              description="Encuentra productos en tu ciudad y ahorra en envíos comprando cerca de casa."
              color="#EFC88B"
            />
            <FeatureCard
              icon="⚡"
              title="Rapidísimo"
              description="Publica tu anuncio en menos de 2 minutos y conecta al toque con compradores."
              color="#7C7C7C"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="sb-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Productos destacados
              </h2>
              <p className="text-xl text-gray-600">
                Los artículos más populares cerquita tuyo
              </p>
            </div>
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-colors font-semibold"
            >
              Ver todos
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/"
              className="md:hidden inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Ver todos los productos
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
