import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiMapPin, FiHeart, FiChevronRight
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { MdVerified } from 'react-icons/md';

function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState('Todos');
  const [location, setLocation] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Todos', 'Tecnología', 'Casa y Hogar', 'Ropa y Moda', 'Deportes', 'Carros y Motos', 'Gaming'];
  const priceRanges = ['Todos', '0-100', '100-500', '500-1000', '1000+'];
  const locations = ['Todos', 'Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta', 'Loja'];

  const allProducts = [
    { id: 1, image: '📱', title: 'iPhone 14 Pro Max 128GB', price: 890, location: 'Quito Centro', category: 'Tecnología', isNew: true, verified: true },
    { id: 2, image: '🛋️', title: 'Mueble de sala esquinero moderno', price: 250, location: 'Guayaquil Norte', category: 'Casa y Hogar', isNew: false, verified: true },
    { id: 3, image: '🚲', title: 'Bicicleta de montaña Trek X-Caliber', price: 420, location: 'Cuenca', category: 'Deportes', isNew: false, verified: false },
    { id: 4, image: '⌚', title: 'Apple Watch Series 9 GPS', price: 320, location: 'Ambato', category: 'Tecnología', isNew: true, verified: true },
    { id: 5, image: '📷', title: 'Cámara Canon EOS R6', price: 1200, location: 'Manta', category: 'Tecnología', isNew: false, verified: true },
    { id: 6, image: '🎧', title: 'AirPods Pro 2da Gen', price: 180, location: 'Loja', category: 'Tecnología', isNew: true, verified: true },
    { id: 7, image: '💻', title: 'MacBook Air M2', price: 950, location: 'Quito', category: 'Tecnología', isNew: false, verified: true },
    { id: 8, image: '🎮', title: 'PlayStation 5 Digital', price: 480, location: 'Guayaquil', category: 'Gaming', isNew: false, verified: false },
    { id: 9, image: '👕', title: 'Chaqueta North Face', price: 95, location: 'Cuenca', category: 'Ropa y Moda', isNew: true, verified: true },
    { id: 10, image: '🚗', title: 'Toyota Corolla 2020', price: 15000, location: 'Quito', category: 'Carros y Motos', isNew: false, verified: true },
    { id: 11, image: '🏠', title: 'Refrigeradora LG', price: 650, location: 'Guayaquil', category: 'Casa y Hogar', isNew: true, verified: true },
    { id: 12, image: '⚽', title: 'Balón de fútbol Nike', price: 45, location: 'Ambato', category: 'Deportes', isNew: true, verified: false },
  ];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesLocation = location === 'Todos' || product.location.includes(location);

    let matchesPrice = true;
    if (priceRange !== 'Todos') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      if (max) {
        matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
      } else {
        matchesPrice = product.price >= parseInt(min);
      }
    }

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEE5E9' }}>
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="sb-container">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Productos disponibles
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra justo lo que buscas entre {allProducts.length} productos
          </p>

          {/* Barra de búsqueda */}
          <div className="relative max-w-3xl">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Botón de filtros móvil */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 lg:hidden flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold"
          >
            <FiFilter />
            Filtros
          </button>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12">
        <div className="sb-container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filtros Sidebar */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Categorías</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? 'bg-orange-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Rango de Precio</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setPriceRange(range)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        priceRange === range
                          ? 'bg-orange-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {range === 'Todos' ? 'Todos' : `$${range}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Ubicación</h3>
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        location === loc
                          ? 'bg-orange-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Mostrando <span className="font-bold">{filteredProducts.length}</span> productos
                </p>
                <select className="px-4 py-2 border rounded-lg">
                  <option>Más recientes</option>
                  <option>Menor precio</option>
                  <option>Mayor precio</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/producto/${product.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
                        {product.image}
                      </div>

                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
                            <HiSparkles className="text-sm" />
                            NUEVO
                          </span>
                        )}
                        {product.verified && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                            <MdVerified className="text-sm" />
                            Verificado
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                      >
                        <FiHeart className="text-xl text-gray-700" />
                      </button>
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[3rem]">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl font-black" style={{ color: '#CF5C36' }}>
                          ${product.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiMapPin className="flex-shrink-0" />
                        <span className="truncate">{product.location}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-2xl text-gray-400 mb-4">No se encontraron productos</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('Todos');
                      setPriceRange('Todos');
                      setLocation('Todos');
                    }}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductosPage;

