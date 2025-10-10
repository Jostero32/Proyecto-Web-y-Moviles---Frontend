import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiMapPin, FiHeart, FiChevronRight
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { productAPI, categoryAPI } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

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
    const categoryFromUrl = searchParams.get('category');

    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
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
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="sb-container py-8">
        {/* Header de búsqueda */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Productos disponibles
          </h1>
          <p className="text-gray-600">
            {loading ? 'Cargando...' : `${filteredProducts.length} productos encontrados`}
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-lg"
          />
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-4"
          >
            <FiFilter className="w-5 h-5" />
            <span className="font-semibold">Filtros</span>
          </button>

          {showFilters && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de precio</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>
                      {range === 'Todos' ? 'Todos los precios' : `$${range}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ordenar por</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Más recientes</option>
                  <option>Menor precio</option>
                  <option>Mayor precio</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="text-xl text-gray-500">Cargando productos...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20">
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
          ) : (
            filteredProducts.map((product) => {
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
                        src={`http://localhost:8080${imageUrl}`}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📦</span>
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                      <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block px-2 py-1 bg-orange-500/90 text-white text-xs rounded-full font-semibold">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        <span>Quito</span> {/* TODO: usar location real del backend */}
                      </div>
                      <div className="flex items-center text-green-600 text-sm">
                        <MdVerified className="w-4 h-4 mr-1" />
                        <span>Verificado</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      
    </div>
  );
}

export default ProductosPage;