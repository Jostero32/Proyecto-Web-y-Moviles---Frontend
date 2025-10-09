import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiDollarSign, FiMapPin, FiTag } from 'react-icons/fi';
import { HiDevicePhoneMobile, HiHomeModern, HiShoppingBag, HiTrophy } from 'react-icons/hi2';
import { IoGameController, IoCarSport } from 'react-icons/io5';
import LocationPicker from '../components/common/LocationPicker';

function VenderPage() {
  const navigate = useNavigate();
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    locationCoords: null, // { lat, lng, address }
    condition: 'usado',
    images: []
  });

  const categories = [
    { value: 'tecnologia', label: 'Tecnología', icon: HiDevicePhoneMobile, color: '#CF5C36' },
    { value: 'hogar', label: 'Casa y Hogar', icon: HiHomeModern, color: '#EFC88B' },
    { value: 'ropa', label: 'Ropa y Moda', icon: HiShoppingBag, color: '#7C7C7C' },
    { value: 'deportes', label: 'Deportes', icon: HiTrophy, color: '#CF5C36' },
    { value: 'vehiculos', label: 'Carros y Motos', icon: IoCarSport, color: '#EFC88B' },
    { value: 'gaming', label: 'Gaming', icon: IoGameController, color: '#7C7C7C' },
  ];

  const locations = ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta', 'Loja', 'Machala', 'Riobamba'];

  const handleLocationSelect = (locationData) => {
    setFormData({
      ...formData,
      location: locationData.address,
      locationCoords: { lat: locationData.lat, lng: locationData.lng }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar al backend
    console.log('Producto a publicar:', formData);
    alert('¡Producto publicado exitosamente! 🎉');
    navigate('/productos');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#EEE5E9' }}>
      <div className="sb-container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Vende tu producto
          </h1>
          <p className="text-xl text-gray-600">
            Publica gratis y vende rápido a miles de compradores
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          {/* Categoría */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-900 mb-4">
              Categoría *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.category === cat.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <cat.icon className="text-3xl mx-auto mb-2" style={{ color: cat.color }} />
                  <span className="text-sm font-semibold">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Título del producto *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: iPhone 14 Pro Max 128GB en excelente estado"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Descripción *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu producto, incluye detalles importantes..."
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Precio y Condición */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Precio (USD) *
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Condición *
              </label>
              <select
                required
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              >
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado - Como nuevo</option>
                <option value="usado-bueno">Usado - Buen estado</option>
                <option value="usado-regular">Usado - Estado regular</option>
              </select>
            </div>
          </div>

          {/* Ubicación con Mapa */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Ubicación *
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowLocationPicker(true)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors text-left flex items-center gap-3"
              >
                <FiMapPin className="text-xl text-gray-400" />
                <span className={formData.location ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.location || 'Selecciona tu ubicación en el mapa'}
                </span>
              </button>

              {formData.location && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                  <FiMapPin className="text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900">Ubicación confirmada</p>
                    <p className="text-sm text-green-700">{formData.location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(true)}
                    className="text-sm text-green-600 hover:text-green-700 font-semibold"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Imágenes */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Imágenes del producto
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
              <FiUpload className="text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Arrastra tus imágenes aquí o haz clic para seleccionar</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold cursor-pointer hover:bg-gray-800 transition-colors"
              >
                Seleccionar imágenes
              </label>
              {formData.images.length > 0 && (
                <p className="mt-4 text-sm text-gray-600">
                  {formData.images.length} imagen(es) seleccionada(s)
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-8 py-4 text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg"
              style={{ backgroundColor: '#CF5C36' }}
            >
              Publicar producto
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-3">💡 Tips para vender rápido:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Usa fotos claras y de buena calidad</li>
            <li>✓ Describe detalladamente el estado del producto</li>
            <li>✓ Establece un precio justo y competitivo</li>
            <li>✓ Responde rápido a los mensajes de compradores</li>
          </ul>
        </div>
      </div>

      {/* Modal de selección de ubicación */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
          initialPosition={formData.locationCoords}
        />
      )}
    </div>
  );
}

export default VenderPage;
