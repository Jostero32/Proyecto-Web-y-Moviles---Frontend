import { useState, useEffect } from 'react';
import { authAPI, productAPI, categoryAPI, API_BASE_URL } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiAlertCircle, FiX, FiSave, FiUpload, FiDollarSign, FiMapPin, FiTag } from 'react-icons/fi';
import LocationPicker from '../components/common/LocationPicker';

function MisProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [editModal, setEditModal] = useState({ show: false, product: null });
  const [editLoading, setEditLoading] = useState(false);
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
        
        // Mapear productos del backend al formato del frontend
        const mappedProducts = response.map(product => ({
          id: product.id,
          nombre: product.title,
          descripcion: product.description || 'Sin descripción', // Mapear descripción del backend
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

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      try {
        setLoading(true);
        
        // Llamar a la API para eliminar
        await productAPI.deleteProduct(id);
        
        // Actualizar el estado local
        setProductos(prev => prev.filter(p => p.id !== id));
        showNotification('success', `Producto "${nombre}" eliminado exitosamente`);
        
      } catch (error) {
        console.error('Error eliminando producto:', error);
        
        if (error.response?.status === 401) {
          navigate('/login');
        } else if (error.response?.status === 403) {
          showNotification('error', 'No tienes permisos para eliminar este producto');
        } else {
          const errorMsg = error.response?.data?.message || 'Error al eliminar el producto';
          showNotification('error', errorMsg);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditar = async (id) => {
    try {
      setLoading(true);
      // Obtener el producto completo del backend con todas sus fotos y datos
      const response = await productAPI.getMyProducts();
      const fullProduct = response.find(p => p.id === id);
      
      if (fullProduct) {
        setEditModal({ show: true, product: fullProduct });
      }
    } catch (error) {
      console.error('Error obteniendo producto completo:', error);
      showNotification('error', 'Error al cargar los datos del producto');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      setEditLoading(true);
      
      // Mapear campos del frontend al backend
      const productData = {
        title: updatedData.nombre,
        description: updatedData.descripcion || '',
        price: parseFloat(updatedData.precio),
        categoryId: updatedData.subcategory || updatedData.category, // Usar subcategoría si existe, sino categoría principal
        status: updatedData.estado === 'Activo' ? 'active' : 
               updatedData.estado === 'Vendido' ? 'sold' : 
               updatedData.estado === 'Reservado' ? 'reserved' : 'inactive'
      };

      // Llamar a la API para actualizar (con fotos si se agregaron)
      await productAPI.updateProduct(editModal.product.id, productData, updatedData.images || null);
      
      // Actualizar el estado local
      setProductos(prev => prev.map(p => 
        p.id === editModal.product.id 
          ? { ...p, ...updatedData }
          : p
      ));
      
      // Cerrar modal y mostrar notificación
      setEditModal({ show: false, product: null });
      showNotification('success', 'Producto actualizado exitosamente');
      
    } catch (error) {
      console.error('Error actualizando producto:', error);
      
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 403) {
        showNotification('error', 'No tienes permisos para editar este producto');
      } else {
        const errorMsg = error.response?.data?.message || 'Error al actualizar el producto';
        showNotification('error', errorMsg);
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseEdit = () => {
    setEditModal({ show: false, product: null });
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

      {/* Modal de Edición */}
      {editModal.show && (
        <EditProductModal 
          product={editModal.product}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
          loading={editLoading}
        />
      )}

      {/* Notificación */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 border-l-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className={`mr-2 ${
                notification.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}>
                {notification.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, type: '', message: '' })}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Componente Modal de Edición Completo
  function EditProductModal({ product, onSave, onClose, loading }) {
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [backendCategories, setBackendCategories] = useState([]);
    const [formData, setFormData] = useState({
      nombre: product?.title || product?.nombre || '',
      descripcion: product?.description || product?.descripcion || '',
      precio: product?.price || product?.precio || '',
      category: product?.Category || '', // Categoría por defecto
      subcategory: product?.Subcategory || '',
      estado: product?.status === 'active' ? 'Activo' : 
              product?.status === 'sold' ? 'Vendido' : 
              product?.status === 'reserved' ? 'Reservado' : 'Inactivo',
      location: product?.location || '',
      locationCoords: product?.lat && product?.lng ? 
        { lat: product.lat, lng: product.lng } : null,
      condition: product?.condition || 'usado',
      images: []
    });



    const handleLocationSelect = (locationData) => {
      setFormData({
        ...formData,
        location: locationData.address,
        locationCoords: { lat: locationData.lat, lng: locationData.lng }
      });
    };

    const removeExistingPhoto = (photoId) => {
      setExistingPhotos(prev => prev.filter(photo => photo.id !== photoId));
    };

    useEffect(() => {
      const loadData = async () => {
        try {
          // Cargar categorías del backend
          const categories = await categoryAPI.getMain();
          setBackendCategories(categories);

          if (product) {
            // Debug: Ver qué datos de ubicación llegan del backend
            console.log('Datos del producto para ubicación:', {
              state: product.state,
              city: product.city,
              neighborhood: product.neighborhood,
              latitude: product.latitude,
              longitude: product.longitude,
              category: product.Category
            });

            // Actualizar formData con los datos del producto
            setFormData({
              nombre: product.title || product.nombre || '',
              descripcion: product.description || product.descripcion || '',
              precio: product.price || product.precio || '',
              category: product.Category?.id || '',
              subcategory: '',
              estado: product.status === 'active' ? 'Activo' : 
                      product.status === 'sold' ? 'Vendido' : 
                      product.status === 'reserved' ? 'Reservado' : 'Inactivo',
              location: {
                state: product.state || '',
                city: product.city || '',
                neighborhood: product.neighborhood || ''
              },
              locationCoords: product.latitude && product.longitude ? 
                { lat: product.latitude, lng: product.longitude } : null,
              condition: product.condition || 'usado',
              images: []
            });

            // Cargar TODAS las fotos existentes del producto
            if (product.ProductPhotos && product.ProductPhotos.length > 0) {
              const photos = product.ProductPhotos.map((photo) => ({
                id: photo.id,
                photoUrl: photo.url.startsWith('http') ? photo.url : `${API_BASE_URL}${photo.url}`,
                isExisting: true
              }));
              setExistingPhotos(photos);
            } else {
              setExistingPhotos([]);
            }
          }
        } catch (error) {
          console.error('Error cargando datos del modal:', error);
        }
      };

      loadData();
    }, [product]);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validaciones básicas
      if (!formData.nombre.trim()) {
        showNotification('error', 'Por favor ingresa un nombre para el producto');
        return;
      }
      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        showNotification('error', 'Por favor ingresa un precio válido');
        return;
      }

      onSave({
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        estado: formData.estado,
        descripcion: formData.descripcion,
        category: formData.category,
        condition: formData.condition,
        images: formData.images
      });
    };

    const selectedCategoryData = backendCategories.find(cat => cat.id === formData.category);
    const subcategories = selectedCategoryData ? selectedCategoryData.subcategories : [];

    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop con efecto vidrioso */}
        <div 
          className="absolute inset-0 backdrop-blur-sm bg-black/20"
          onClick={onClose}
        ></div>
        
        {/* Modal Content */}
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl z-10">
            <h2 className="text-2xl font-bold text-gray-900">Editar Producto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="text-xl text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Nombre del producto */}
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Nombre del producto *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Ej: iPhone 14 Pro Max..."
              />
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"
                placeholder="Describe tu producto, estado, características..."
              />
            </div>

            {/* Precio y Estado en una fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Precio */}
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FiDollarSign className="text-orange-500" />
                  Precio *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>

              
              {/* Estado */}
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  Estado del producto
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Reservado">Reservado</option>
                </select>
              </div>
            </div>

             {/* Ubicación */}
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Ubicación
              </label>
              <button
                type="button"
                onClick={() => setShowLocationPicker(true)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl text-left hover:border-orange-500 transition-colors flex items-center justify-between"
              >
                <span className="text-gray-700">
                  {(formData.location?.state || formData.location?.city || formData.location?.neighborhood)
                    ? `${formData.location || 'Estado'}, ${formData.location.city || 'Ciudad'}, ${formData.location.neighborhood || 'Colonia'}`
                    : 'Seleccionar ubicación'
                  }
                </span>
                <FiMapPin className="text-gray-400" />
              </button>
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Categoría
              </label>
              <div className="grid grid-cols-2 gap-4">
                {backendCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id, subcategory: '' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === cat.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FiTag className="text-2xl mx-auto mb-2 text-orange-500" />
                    <span className="text-sm font-semibold">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategoría */}
            {subcategories.length > 0 && (
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTag className="text-orange-500" />
                  Subcategoría
                </label>
                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    {subcategories.map((sub) => (
                      <button
                        key={sub.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, subcategory: sub.value })}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                          formData.subcategory === sub.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Condición - 4 opciones como en VenderPage */}
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Condición *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              >
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado - Como nuevo</option>
                <option value="usado-bueno">Usado - Buen estado</option>
                <option value="usado-regular">Usado - Estado regular</option>
              </select>
            </div>

            {/* Imágenes del producto */}
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Imágenes del producto
              </label>
              
              {/* Fotos existentes */}
              {existingPhotos.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Fotos actuales:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {existingPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={photo.photoUrl}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(photo.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                <FiUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">Arrastra tus imágenes aquí o haz clic para seleccionar</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setFormData({ ...formData, images: [...formData.images, ...files] });
                  }}
                  className="hidden"
                  id="image-upload-edit"
                />
                <label
                  htmlFor="image-upload-edit"
                  className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  Seleccionar imágenes
                </label>
                {formData.images.length > 0 && (
                  <p className="mt-3 text-sm text-gray-600">
                    {formData.images.length} imagen(es) seleccionada(s)
                  </p>
                )}
              </div>
              
              {/* Vista previa de imágenes */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Vista previa:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

           

            {/* Botones */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 text-white rounded-xl font-bold transition-opacity shadow-lg flex items-center justify-center gap-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: '#CF5C36' }}
              >
                <FiSave />
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
        </div>

        {/* LocationPicker Modal */}
        {showLocationPicker && (
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            onClose={() => setShowLocationPicker(false)}
          />
        )}
      </>
    );
  }
}

export default MisProductosPage;
