import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import {
  FiSearch, FiFilter, FiMapPin, FiHeart, FiChevronRight, FiNavigation, FiTag, FiChevronDown
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { MdVerified } from 'react-icons/md';
import { productAPI, favoriteAPI, authAPI, categoryAPI, API_BASE_URL } from '../services/api';
import { categoriesData } from '../data/categories';
import LocationPicker from '../components/common/LocationPicker';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Modal from '../components/common/Modal';

// Componente ProductCard con funcionalidad de favoritos
function ProductCard({ product, distance }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null });

  // Verificar si el producto está en favoritos al cargar el componente
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (authAPI.isAuthenticated() && product.id) {
        try {
          const isFav = await favoriteAPI.isFavorite(product.id);
          setIsFavorite(isFav);
        } catch (error) {
          console.error('Error verificando favorito:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [product.id]);

  // Función para manejar favoritos
  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Prevenir navegación cuando se hace clic en favoritos

    try {
      // Verificar si el usuario está autenticado
      if (!authAPI.isAuthenticated()) {
        // Mostrar modal de login
        setModalData({
          isOpen: true,
          type: 'login',
          title: 'Iniciar Sesión Requerido',
          message: 'Debes iniciar sesión para marcar productos como favoritos. ¿Quieres ir a la página de login?',
          onConfirm: () => {
            window.location.href = '/login';
          },
          confirmText: 'Ir a Login',
          cancelText: 'Cancelar'
        });
        return;
      }

      setFavoriteLoading(true);

      if (isFavorite) {
        await favoriteAPI.removeFavorite(product.id);
        setIsFavorite(false);
      } else {
        await favoriteAPI.addFavorite(product.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error al manejar favorito:', error);
      
      // Manejar casos específicos  
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.message || '';
        
        if (errorMsg.includes('ya está en favoritos') || errorMsg.includes('already')) {
          // El producto ya está en favoritos, actualizar estado local
          setIsFavorite(true);
          return;
        }
      }
      
      setModalData({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar favoritos. Inténtalo de nuevo.',
        confirmText: 'Entendido'
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (product.ProductPhotos && product.ProductPhotos.length > 0) {
      const sortedPhotos = product.ProductPhotos.sort((a, b) => (a.position || 0) - (b.position || 0));
      return sortedPhotos[0].url;
    }
    return null;
  };

  const imageUrl = getProductImage(product);

  return (
    <>
      <Link
        to={`/producto/${product.id}`}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      >
        <div className="relative">
          {imageUrl ? (
            <img
              src={`${API_BASE_URL}${imageUrl}`}
              alt={product.title}
              className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
              📦
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
                <HiSparkles className="text-sm" />
                NUEVO
              </span>
            )}
            {product.User && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                <MdVerified className="text-sm" />
                Verificado
              </span>
            )}
            {distance !== null && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                <FiMapPin className="text-sm" />
                {distance.toFixed(1)} km
              </span>
            )}
          </div>

          <button
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            className={`absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiHeart className={`text-xl ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'} ${favoriteLoading ? 'animate-pulse' : ''} transition-colors`} />
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
            <span className="truncate">{product.location || 'Ubicación no especificada'}</span>
          </div>
        </div>
      </Link>

      {/* Modal para notificaciones */}
      <Modal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        type={modalData.type}
        title={modalData.title}
        message={modalData.message}
        onConfirm={modalData.onConfirm}
        confirmText={modalData.confirmText}
        cancelText={modalData.cancelText}
      />
    </>
  );
}

function ProductosPage() {
  usePageTitle('Productos');
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos'); // Siempre será un ID numérico o 'Todos'
  const [selectedSubcategory, setSelectedSubcategory] = useState('Todos'); // Siempre será un ID numérico o 'Todos'
  const [priceRange, setPriceRange] = useState('Todos');
  const [location, setLocation] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10); // km por defecto
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendCategories, setBackendCategories] = useState([]);
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;
  // Ordenamiento
  const [sortOrder, setSortOrder] = useState('Más recientes');

  // Cargar filtros desde los parámetros de URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const categoryFromUrl = searchParams.get('category');
    const subcategoryFromUrl = searchParams.get('subcategory');
    const categoryIdFromUrl = searchParams.get('categoryId');

    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }

    // Priorizar categoryId del backend
    if (categoryIdFromUrl) {
      setSelectedCategory(categoryIdFromUrl);
    } else if (categoryFromUrl) {
      // Buscar en categorías locales primero, luego en backend cuando estén cargadas
      const localCategory = categoriesData.find(cat => cat.value === categoryFromUrl);
      if (localCategory) {
        setSelectedCategory(localCategory.label);
      } else {
        // Si no está en categorías locales, usar el valor directamente
        setSelectedCategory(categoryFromUrl);
      }
    }

    if (subcategoryFromUrl) {
      // Si es un número, usar como ID, si no, buscar el ID por nombre
      if (!isNaN(subcategoryFromUrl)) {
        setSelectedSubcategory(subcategoryFromUrl);
      } else if (backendCategories.length > 0) {
        const found = backendCategories
          .flatMap(cat => cat.subcategories || [])
          .find(sub => sub.name.toLowerCase() === subcategoryFromUrl.toLowerCase());
        if (found) setSelectedSubcategory(found.id);
        else setSelectedSubcategory(subcategoryFromUrl);
      } else {
        setSelectedSubcategory(subcategoryFromUrl);
      }
    }
  }, [searchParams]);

  // Mapear filtros de URL a categorías del backend cuando se carguen
  useEffect(() => {
    if (backendCategories.length > 0) {
      const categoryFromUrl = searchParams.get('category');
      const categoryIdFromUrl = searchParams.get('categoryId');
      
      // Si hay un parámetro category pero no categoryId, intentar mapear
      if (categoryFromUrl && !categoryIdFromUrl && selectedCategory !== 'Todos') {
        // Buscar en categorías principales
        let backendCategory = backendCategories.find(cat => 
          cat.name.toLowerCase().includes(categoryFromUrl.toLowerCase()) ||
          categoryFromUrl.toLowerCase().includes(cat.name.toLowerCase())
        );
        
        // Si no se encuentra en principales, buscar en subcategorías
        if (!backendCategory) {
          backendCategory = backendCategories
            .flatMap(cat => cat.subcategories || [])
            .find(sub => 
              sub.name.toLowerCase().includes(categoryFromUrl.toLowerCase()) ||
              categoryFromUrl.toLowerCase().includes(sub.name.toLowerCase())
            );
        }
        
        if (backendCategory) {
          setSelectedCategory(backendCategory.id);
        }
      }
    }
  }, [backendCategories, searchParams, selectedCategory]);

  // Cargar productos y categorías del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getMain() // Obtener categorías principales con subcategorías
        ]);
        
        setProducts(productsData);
        setBackendCategories(categoriesData);
        
        // Debug: Ver estructura de los datos
        console.log('Productos cargados:', productsData.slice(0, 2)); // Solo 2 para ver estructura
        console.log('Categorías cargadas:', categoriesData);
        console.log('Ejemplo de categoryId en productos:', productsData.map(p => ({ id: p.id, title: p.title, categoryId: p.categoryId })).slice(0, 3));
        
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



  // Función para calcular distancia entre dos coordenadas (fórmula de Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocationSelect = (locationData) => {
    setUserLocation(locationData);
    setLocation('Cercanos'); // Cambia el filtro a "Cercanos"
  };


  // Cambia la categoría principal y resetea subcategoría
  const handleCategoryChange = (category) => {
    // Si es 'Todos', resetea
    if (category === 'Todos') {
      setSelectedCategory('Todos');
      setSelectedSubcategory('Todos');
      return;
    }
    // Si es string, buscar el id numérico real
    let categoryId = category;
    if (typeof category === 'string' && backendCategories.length > 0) {
      // Buscar por id string o nombre
      const found = backendCategories.find(cat =>
        String(cat.id) === category ||
        cat.name.toLowerCase() === category.toLowerCase()
      );
      if (found) categoryId = found.id;
    }
    setSelectedCategory(categoryId);
    setSelectedSubcategory('Todos');
  };

  // Cambia la subcategoría
  const handleSubcategoryChange = (subcategory) => {
    if (subcategory === 'Todos') {
      setSelectedSubcategory('Todos');
      return;
    }
    let subcategoryId = subcategory;
    if (typeof subcategory === 'string' && backendCategories.length > 0) {
      const found = backendCategories
        .flatMap(cat => cat.subcategories || [])
        .find(sub => String(sub.id) === subcategory || sub.name.toLowerCase() === subcategory.toLowerCase());
      if (found) subcategoryId = found.id;
    }
    setSelectedSubcategory(subcategoryId);
  };

  // Helper para obtener información de categoría por ID (por ahora no usado)
  // const getCategoryInfo = (categoryId) => {
  //   if (!categoryId || !backendCategories.length) return null;
    
  //   // Buscar en categorías principales
  //   const mainCategory = backendCategories.find(cat => String(cat.id) === String(categoryId));
  //   if (mainCategory) return mainCategory;
    
  //   // Buscar en subcategorías
  //   for (const category of backendCategories) {
  //     if (category.subcategories) {
  //       const subcategory = category.subcategories.find(sub => String(sub.id) === String(categoryId));
  //       if (subcategory) return { ...subcategory, parentCategory: category };
  //     }
  //   }
    
  //   return null;
  // };



  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtro de categoría principal
    let matchesCategory = selectedCategory === 'Todos';
    if (!matchesCategory && (product.categoryId || product.Category?.id)) {
      const productCategoryId = product.categoryId || product.Category?.id;
      matchesCategory = String(productCategoryId) === String(selectedCategory);
      // Si no coincide, verificar si la categoría del producto es subcategoría de la seleccionada
      if (!matchesCategory && backendCategories.length > 0) {
        const parentCat = backendCategories.find(cat => String(cat.id) === String(selectedCategory));
        if (parentCat && parentCat.subcategories) {
          matchesCategory = parentCat.subcategories.some(sub => String(productCategoryId) === String(sub.id));
        }
      }
    }

    // Filtro de subcategoría
    let matchesSubcategory = selectedSubcategory === 'Todos';
    if (!matchesSubcategory && (product.categoryId || product.Category?.id)) {
      const productCategoryId = product.categoryId || product.Category?.id;
      matchesSubcategory = String(productCategoryId) === String(selectedSubcategory);
    }

    // Filtro de ubicación cercana (10 km por defecto o el radio seleccionado)
    let matchesLocation = true;
    if (location === 'Cercanos' && userLocation) {
      // El producto debe tener coordenadas válidas (lat/lng)
      const coords = product.coords || product.locationCoords;
      if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          coords.lat,
          coords.lng
        );
        matchesLocation = distance <= searchRadius;
      } else {
        matchesLocation = false;
      }
    } else if (location !== 'Todos' && location !== 'Cercanos') {
      matchesLocation = product.location && product.location.includes(location);
    }

    // Filtro de precio
    let matchesPrice = true;
    if (priceRange !== 'Todos') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      if (max) {
        matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
      } else {
        matchesPrice = product.price >= parseInt(min);
      }
    }

    return matchesSearch && matchesCategory && matchesSubcategory && matchesLocation && matchesPrice;
  });

  // Ordenar productos
  let sortedProducts = filteredProducts;
  if (userLocation && location === 'Cercanos') {
    sortedProducts = [...filteredProducts].sort((a, b) => {
      if (!a.coords || !b.coords) return 0;
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.coords.lat, a.coords.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.coords.lat, b.coords.lng);
      return distA - distB;
    });
  } else if (sortOrder === 'Menor precio') {
    sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'Mayor precio') {
    sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEE5E9' }}>
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="sb-container">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Productos disponibles
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {loading ? 'Cargando...' : `Encuentra justo lo que buscas entre ${products.length} productos`}
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
              {/* Filtro de Ubicación Cercana */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Buscar cerca de ti</h3>
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors text-left flex items-center gap-3 mb-3"
                >
                  <FiNavigation className="text-xl text-gray-400" />
                  <span className={userLocation ? 'text-gray-900 text-sm' : 'text-gray-400'}>
                    {userLocation ? `📍 ${userLocation.address.substring(0, 30)}...` : 'Seleccionar ubicación'}
                  </span>
                </button>

                {userLocation && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Radio de búsqueda</label>
                      <select
                        value={searchRadius}
                        onChange={(e) => setSearchRadius(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value={5}>5 km</option>
                        <option value={10}>10 km</option>
                        <option value={20}>20 km</option>
                        <option value={50}>50 km</option>
                        <option value={100}>100 km</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setUserLocation(null);
                        setLocation('Todos');
                      }}
                      className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Limpiar ubicación
                    </button>
                  </div>
                )}
              </div>

              {/* Categorías y Subcategorías del Backend */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Categorías</h3>
                
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Búsqueda rápida en categorías */}
                    {backendCategories.length > 3 && (
                      <div className="mb-4">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar categoría..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                            onChange={(e) => {
                              // Filtrar categorías visualmente (solo visual, no afecta filtros)
                              const searchValue = e.target.value.toLowerCase();
                              if (searchValue) {
                                document.querySelectorAll('[data-category-item]').forEach(item => {
                                  const categoryName = item.textContent.toLowerCase();
                                  item.style.display = categoryName.includes(searchValue) ? 'block' : 'none';
                                });
                              } else {
                                document.querySelectorAll('[data-category-item]').forEach(item => {
                                  item.style.display = 'block';
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                      <div className="space-y-1">
                        {/* Opción "Todos" */}
                        <button
                          onClick={() => handleCategoryChange('Todos')}
                          className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors font-medium ${
                            selectedCategory === 'Todos'
                              ? 'bg-orange-500 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          Todos
                        </button>

                        {/* Categorías del backend con subcategorías */}
                        {backendCategories.map((cat) => {
                    const isSelected = String(selectedCategory) === String(cat.id) || selectedCategory === cat.name;
                    const categorySubcategories = cat.subcategories || [];

                    return (
                      <div key={cat.id} data-category-item>
                        {/* Categoría principal */}
                        <button
                          onClick={() => handleCategoryChange(cat.id)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors font-medium flex items-center justify-between ${
                            isSelected
                              ? 'bg-orange-500 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{cat.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isSelected 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {products.filter(p => {
                                  const pCategoryId = p.categoryId || p.Category?.id;
                                  if (!pCategoryId) return false;
                                  
                                  // Contar productos de esta categoría principal
                                  if (String(pCategoryId) === String(cat.id)) return true;
                                  
                                  // También contar productos de subcategorías de esta categoría
                                  return cat.subcategories && cat.subcategories.some(sub => 
                                    String(pCategoryId) === String(sub.id)
                                  );
                                }).length}
                              </span>
                              {isSelected && categorySubcategories.length > 0 && (
                                <FiChevronDown className="text-sm" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Subcategorías (solo si la categoría está seleccionada) */}
                        {isSelected && categorySubcategories.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-orange-200 pl-3">
                            <button
                              onClick={() => handleSubcategoryChange('Todos')}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedSubcategory === 'Todos'
                                  ? 'bg-orange-100 text-orange-700 font-semibold'
                                  : 'hover:bg-gray-100 text-gray-600'
                              }`}
                            >
                              Todos
                            </button>
                            {categorySubcategories.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => handleSubcategoryChange(sub.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                  String(selectedSubcategory) === String(sub.id)
                                    ? 'bg-orange-100 text-orange-700 font-semibold'
                                    : 'hover:bg-gray-100 text-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{sub.name}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    String(selectedSubcategory) === String(sub.id)
                                      ? 'bg-orange-200 text-orange-800' 
                                      : 'bg-gray-200 text-gray-600'
                                  }`}>
                                    {products.filter(p => {
                                      const pCategoryId = p.categoryId || p.Category?.id;
                                      return pCategoryId && String(pCategoryId) === String(sub.id);
                                    }).length}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                        })}
                      </div>
                    </>
                  )}
              </div>

              {/* Rango de Precio */}
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

              
            </div>

            {/* Grid de Productos */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                {/* Información de filtros activos */}
                {(selectedCategory !== 'Todos' || selectedSubcategory !== 'Todos' || searchTerm || location !== 'Todos') && (
                  <div className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Filtros activos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory !== 'Todos' && (
                        <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full flex items-center gap-2">
                          📁 {
                            (() => {
                              // Si es string y no es un número, mostrar como texto
                              if (typeof selectedCategory === 'string' && isNaN(Number(selectedCategory))) return selectedCategory;
                              // Buscar nombre de la categoría por ID
                              const cat = backendCategories.find(c => String(c.id) === String(selectedCategory));
                              return cat ? cat.name : 'Categoría';
                            })()
                          }
                          <button onClick={() => handleCategoryChange('Todos')} className="hover:bg-orange-600 rounded-full p-1">×</button>
                        </span>
                      )}
                      {selectedSubcategory !== 'Todos' && (
                        <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full flex items-center gap-2">
                          📂 {
                            (() => {
                              // Si es string y no es un número, mostrar como texto
                              if (typeof selectedSubcategory === 'string' && isNaN(Number(selectedSubcategory))) return selectedSubcategory;
                              // Buscar nombre de la subcategoría por ID
                              const sub = backendCategories.flatMap(c => c.subcategories || []).find(s => String(s.id) === String(selectedSubcategory));
                              return sub ? sub.name : 'Subcategoría';
                            })()
                          }
                          <button onClick={() => handleSubcategoryChange('Todos')} className="hover:bg-blue-600 rounded-full p-1">×</button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center gap-2">
                          🔍 "{searchTerm}"
                          <button onClick={() => setSearchTerm('')} className="hover:bg-green-600 rounded-full p-1">×</button>
                        </span>
                      )}
                      {location !== 'Todos' && (
                        <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full flex items-center gap-2">
                          📍 {location}
                          <button onClick={() => { setLocation('Todos'); setUserLocation(null); }} className="hover:bg-purple-600 rounded-full p-1">×</button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Mostrando <span className="font-bold">{sortedProducts.length}</span> productos
                    {userLocation && location === 'Cercanos' && (
                      <span className="text-sm ml-2">a {searchRadius} km de tu ubicación</span>
                    )}
                  </p>
                  <select
                    className="px-4 py-2 border rounded-lg"
                    value={sortOrder}
                    onChange={e => {
                      setSortOrder(e.target.value);
                      setCurrentPage(1); // Reiniciar a la primera página al cambiar orden
                    }}
                  >
                    <option>Más recientes</option>
                    <option>Menor precio</option>
                    <option>Mayor precio</option>
                    {userLocation && location === 'Cercanos' && <option>Más cercanos</option>}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full flex justify-center py-20">
                    <div className="text-xl text-gray-500">Cargando productos...</div>
                  </div>
                ) : sortedProducts.length === 0 ? (
                  <div className="col-span-full text-center py-20">
                    <div className="mb-8">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-2xl text-gray-400 mb-2">No se encontraron productos</p>
                      <p className="text-gray-500 mb-6">
                        {searchTerm 
                          ? `No hay productos que coincidan con "${searchTerm}"`
                          : 'Intenta ajustar tus filtros para ver más productos'}
                      </p>
                    </div>

                    {/* Sugerencias de búsqueda */}
                    {searchTerm && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-3">¿Quizás buscabas algo como esto?</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {['celular', 'laptop', 'casa', 'auto', 'ropa', 'juegos'].filter(suggestion => 
                            !searchTerm.toLowerCase().includes(suggestion)
                          ).slice(0, 3).map(suggestion => (
                            <button
                              key={suggestion}
                              onClick={() => setSearchTerm(suggestion)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('Todos');
                        setSelectedSubcategory('Todos');
                        setPriceRange('Todos');
                        setLocation('Todos');
                        setUserLocation(null);
                      }}
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  paginatedProducts.map((product) => {
                    const distance = userLocation && location === 'Cercanos' && product.coords
                      ? calculateDistance(userLocation.lat, userLocation.lng, product.coords.lat, product.coords.lng)
                      : null;

                    return <ProductCard key={product.id} product={product} distance={distance} />
                  })
                )}
              </div>
              {/* Controles de paginación */}
              {sortedProducts.length > 0 && (
                <div className="flex justify-center mt-8 gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold border-2 ${currentPage === 1 ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-semibold border-2 ${currentPage === i + 1 ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold border-2 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de selección de ubicación */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
          initialPosition={userLocation}
        />
      )}
    </div>
  );
}

export default ProductosPage;