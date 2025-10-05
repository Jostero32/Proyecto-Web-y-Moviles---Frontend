import { Link } from 'react-router-dom';
import logo from '../assets/Logo de Shop&Buy.png';
import {
  FiSearch, FiTrendingUp, FiZap, FiMapPin, FiHeart,
  FiChevronRight, FiStar, FiUsers, FiPackage, FiClock, FiDollarSign
} from 'react-icons/fi';
import {
  HiDevicePhoneMobile,
  HiHomeModern,
  HiShoppingBag,
  HiTrophy,
  HiTruck,
  HiSparkles
} from 'react-icons/hi2';
import {
  IoGameController,
  IoCarSport,
  IoPricetag,
  IoRocket,
  IoCheckmarkCircle
} from 'react-icons/io5';
import { MdVerified, MdSecurity, MdDashboard } from 'react-icons/md';
import { useState } from 'react';

function CategoryCard({ icon: Icon, title, count, color }) {
  return (
    <Link
      to="/productos"
      className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 text-center overflow-hidden"
    >
      {/* Efecto de fondo al hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}></div>

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500"
             style={{ backgroundColor: `${color}15` }}>
          <Icon className="text-4xl" style={{ color }} />
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:scale-105 transition-transform">{title}</h3>
        <p className="text-sm font-medium" style={{ color }}>{count} productos</p>
      </div>
    </Link>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden">
      {/* Efecto de fondo animado */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{ background: `linear-gradient(135deg, ${color}08, transparent)` }}></div>

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
             style={{ backgroundColor: color }}>
          <Icon className="text-3xl text-white" />
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ProductCard({ image, title, price, location, isNew, verified }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Link to="/producto/1" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
          {image}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              <HiSparkles className="text-sm" />
              NUEVO
            </span>
          )}
          {verified && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
              <MdVerified className="text-sm" />
              Verificado
            </span>
          )}
        </div>

        {/* Botón de favorito */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:scale-110"
        >
          <FiHeart className={`text-xl ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[3rem]">
          {title}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl font-black" style={{ color: '#CF5C36' }}>
            ${price}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiMapPin className="text-base flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </Link>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2"
           style={{ backgroundColor: `${color}15` }}>
        <Icon className="text-2xl" style={{ color }} />
      </div>
      <div className="text-3xl font-black text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}

function HomePage() {
  const categories = [
    { icon: HiDevicePhoneMobile, title: 'Tecnología', count: '12.5k', color: '#CF5C36' },
    { icon: HiHomeModern, title: 'Casa y Hogar', count: '8.2k', color: '#EFC88B' },
    { icon: HiShoppingBag, title: 'Ropa y Moda', count: '15.1k', color: '#7C7C7C' },
    { icon: HiTrophy, title: 'Deportes', count: '6.8k', color: '#CF5C36' },
    { icon: IoCarSport, title: 'Carros y Motos', count: '4.3k', color: '#EFC88B' },
    { icon: IoGameController, title: 'Gaming', count: '7.9k', color: '#7C7C7C' },
  ];

  const featuredProducts = [
    { image: '📱', title: 'iPhone 14 Pro Max 128GB en excelente estado', price: 890, location: 'Quito Centro', isNew: true, verified: true },
    { image: '🛋️', title: 'Mueble de sala esquinero moderno', price: 250, location: 'Guayaquil Norte', isNew: false, verified: true },
    { image: '🚲', title: 'Bicicleta de montaña Trek X-Caliber', price: 420, location: 'Cuenca', isNew: false, verified: false },
    { image: '⌚', title: 'Apple Watch Series 9 GPS 45mm', price: 320, location: 'Ambato', isNew: true, verified: true },
    { image: '📷', title: 'Cámara Canon EOS R6 con lente 24-105mm', price: 1200, location: 'Manta', isNew: false, verified: true },
    { image: '🎧', title: 'AirPods Pro 2da Generación sellados', price: 180, location: 'Loja', isNew: true, verified: true },
    { image: '💻', title: 'MacBook Air M2 256GB Space Gray', price: 950, location: 'Machala', isNew: false, verified: true },
    { image: '🎮', title: 'PlayStation 5 Digital + 2 juegos', price: 480, location: 'Riobamba', isNew: false, verified: false },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEE5E9' }}>
      {/* Hero Section Mejorado */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-yellow-50/30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>

        <div className="sb-container relative py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-lg mb-6 border border-gray-100">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white"></div>
                </div>
                <span className="text-sm font-bold text-gray-700">+50.000 panas activos</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Encuentra cosas
                <span className="block mt-2" style={{ color: '#CF5C36' }}>
                  cheveres cerca de ti
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Compra y vende productos de segunda mano de manera segura. Miles de artículos bacanes te esperan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/productos"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  style={{ backgroundColor: '#CF5C36' }}
                >
                  <IoRocket className="text-2xl group-hover:rotate-12 transition-transform" />
                  Dale, a explorar
                  <FiChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/vender"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-gray-300 transform hover:-translate-y-1"
                >
                  <IoPricetag className="text-2xl group-hover:rotate-12 transition-transform" />
                  Vender algo
                </Link>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="relative bg-white rounded-3xl shadow-2xl p-10 overflow-hidden flex items-center justify-center">
                {/* Elementos decorativos de fondo con gradientes animados */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50"></div>
                <div className="absolute top-8 right-8 w-32 h-32 rounded-full opacity-10 animate-pulse" style={{ backgroundColor: '#CF5C36' }}></div>
                <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full opacity-10 animate-pulse" style={{ backgroundColor: '#EFC88B', animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 left-12 w-20 h-20 rounded-full opacity-5 animate-pulse" style={{ backgroundColor: '#7C7C7C', animationDelay: '2s' }}></div>

                <div className="relative text-center flex flex-col items-center justify-center">
                  {/* Logo con fondo blanco limpio - sin animaciones ni gradientes */}
                  <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
                    {/* Contenedor del logo */}
                    <div className="w-full h-full p-4 flex items-center justify-center">
                      <img
                        src={logo}
                        alt="Shop&Buy"
                        className="w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-4xl font-black mb-2" style={{ color: '#CF5C36' }}>Shop&Buy</h2>
                    <p className="text-gray-600 text-xl font-semibold">Ecuador's Marketplace</p>
                  </div>

                  <div className="flex justify-center gap-3 mt-6">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#CF5C36' }}></div>
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#EFC88B', animationDelay: '0.5s' }}></div>
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#7C7C7C', animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Efectos de brillo en las esquinas */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-white to-transparent opacity-60 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-gray-100 to-transparent opacity-40 rounded-full blur-3xl"></div>
              </div>

              {/* Cuadrados flotantes animados alrededor del bloque - más grandes y con más animación */}
              <div className="absolute -top-8 -left-8 w-16 h-16 rounded-2xl opacity-50 animate-float shadow-xl"
                   style={{ backgroundColor: '#CF5C36' }}></div>
              <div className="absolute -bottom-8 -right-8 w-14 h-14 rounded-2xl opacity-40 animate-float shadow-xl"
                   style={{ backgroundColor: '#EFC88B', animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 -right-10 w-12 h-12 rounded-full opacity-45 animate-float shadow-xl"
                   style={{ backgroundColor: '#7C7C7C', animationDelay: '1s' }}></div>
              <div className="absolute top-1/4 -left-10 w-10 h-10 rounded-2xl opacity-35 animate-float shadow-lg"
                   style={{ backgroundColor: '#EFC88B', animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-1/4 -right-6 w-8 h-8 rounded-full opacity-40 animate-float shadow-lg"
                   style={{ backgroundColor: '#CF5C36', animationDelay: '2.5s' }}></div>
            </div>
          </div>

          {/* Estadísticas centradas en toda la pantalla */}
          <div className="flex justify-center mt-12 lg:mt-16">
            <div className="grid grid-cols-3 gap-14 lg:gap-24 xl:gap-32">
              <StatCard icon={FiUsers} value="250k+" label="Usuarios" color="#CF5C36" />
              <StatCard icon={FiPackage} value="1.2M+" label="Productos" color="#EFC88B" />
              <StatCard icon={FiStar} value="98%" label="Satisfechos" color="#7C7C7C" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="sb-container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-4">
              <MdDashboard className="text-xl" style={{ color: '#CF5C36' }} />
              <span className="text-sm font-bold" style={{ color: '#CF5C36' }}>CATEGORÍAS POPULARES</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
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

          <div className="text-center mt-12">
            <Link
              to="/categorias"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Ver todas las categorías
              <FiChevronRight className="text-xl" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ backgroundColor: '#EEE5E9' }}>
        <div className="sb-container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-4 shadow-sm">
              <FiTrendingUp className="text-xl" style={{ color: '#CF5C36' }} />
              <span className="text-sm font-bold" style={{ color: '#CF5C36' }}>¿POR QUÉ SHOP&BUY?</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Tu marketplace de confianza
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plataforma más confiable y fácil para comprar y vender productos usados en Ecuador
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MdSecurity}
              title="100% Seguro"
              description="Verificamos a todos los usuarios y ofrecemos pagos protegidos para tu total tranquilidad y confianza."
              color="#CF5C36"
            />
            <FeatureCard
              icon={FiMapPin}
              title="Cerquita tuyo"
              description="Encuentra productos en tu ciudad y ahorra en envíos comprando cerca de casa o tu negocio."
              color="#EFC88B"
            />
            <FeatureCard
              icon={FiZap}
              title="Rapidísimo"
              description="Publica tu anuncio en menos de 2 minutos y conecta al toque con miles de compradores interesados."
              color="#7C7C7C"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: IoCheckmarkCircle, text: 'Sin comisiones ocultas', color: '#CF5C36' },
              { icon: HiTruck, text: 'Envíos a todo Ecuador', color: '#EFC88B' },
              { icon: FiClock, text: 'Soporte 24/7', color: '#7C7C7C' },
              { icon: FiDollarSign, text: 'Pagos seguros', color: '#CF5C36' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{ backgroundColor: `${item.color}15` }}>
                  <item.icon className="text-2xl" style={{ color: item.color }} />
                </div>
                <span className="font-semibold text-gray-900">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pt-20 pb-8 bg-white">
        <div className="sb-container">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-4">
                <FiTrendingUp className="text-xl" style={{ color: '#CF5C36' }} />
                <span className="text-sm font-bold" style={{ color: '#CF5C36' }}>LO MÁS BUSCADO</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">
                Productos destacados
              </h2>
              <p className="text-xl text-gray-600">
                Los artículos más populares cerquita tuyo
              </p>
            </div>
            <Link
              to="/productos"
              className="hidden md:inline-flex items-center gap-2 px-6 py-4 border-2 border-gray-900 rounded-2xl hover:bg-gray-900 hover:text-white transition-all font-bold group"
            >
              Ver todos
              <FiChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/productos"
              className="md:hidden inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
            >
              Ver todos los productos
              <FiChevronRight className="text-xl" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
