import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiMapPin, FiHeart, FiChevronRight
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { MdVerified } from 'react-icons/md';
import { productAPI, categoryAPI } from '../services/api';

function ProductosPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState('Todos');
  const [location, setLocation] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todos']);
  const [loading, setLoading] = useState(true);

  // Cargar el término de búsqueda desde los parámetros de URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  // Cargar productos y categorías del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll()
        ]);
        
        setProducts(productsData);
        
        // Agregar "Todos" al inicio de las categorías
        const categoriesList = ['Todos', ...categoriesData.map(cat => cat.name)];
        setCategories(categoriesList);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const priceRanges = ['Todos', '0-100', '100-500', '500-1000', '1000+'];
  const locations = ['Todos', 'Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta', 'Loja'];

  // Función para obtener la primera imagen de un producto
  const getProductImage = (product) => {
    if (product.ProductPhotos && product.ProductPhotos.length > 0) {
      // Ordenar por position y tomar la primera
      const sortedPhotos = product.ProductPhotos.sort((a, b) => (a.position || 0) - (b.position || 0));
      return sortedPhotos[0].url;
    }
    return null;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de categoría - por ahora mantenemos simple hasta tener la relación completa
    const matchesCategory = selectedCategory === 'Todos'; // TODO: implementar filtro por categoryId
    
    // El backend no tiene location por ahora, así que lo mantenemos como true
    const matchesLocation = location === 'Todos' || true;

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
            Encuentra justo lo que buscas entre {products.length} productos
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

              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <div className="text-xl text-gray-500">Cargando productos...</div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const imageUrl = getProductImage(product);
                    return (
                      <Link
                        key={product.id}
                        to={`/producto/${product.id}`}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                      >
                        <div className="relative">
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={product.title}
                              className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
                              📦
                            </div>
                          )}

                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.status === 'activo' && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
                                <HiSparkles className="text-sm" />
                                ACTIVO
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
                            <span className="truncate">Por definir</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {!loading && filteredProducts.length === 0 && (
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
