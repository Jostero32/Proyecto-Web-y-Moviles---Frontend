import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera } from 'react-icons/fi';

function MiPerfilPage() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }
    const user = authAPI.getUserData();
    setUserData(user);
    setFormData({
      name: user?.name || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  }, [navigate]);

  const getAvatarUrl = (user) => {
    if (!user) return null;
    if (user.avatarUrl?.startsWith('data:')) return user.avatarUrl;
    if (user.avatarUrl?.startsWith('http://localhost:8080')) return user.avatarUrl;
    if (user.avatarUrl?.startsWith('/')) return `http://localhost:8080${user.avatarUrl}`;
    if (user.dni) return `http://localhost:8080/uploads/users/${user.dni}/${user.dni}.jpg`;
    return `http://localhost:8080/uploads/common/user-common.png`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', formData);
    alert('Cambios guardados exitosamente');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || '',
      lastname: userData?.lastname || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || ''
    });
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Nueva imagen cargada');
        alert('Imagen cargada. Funcionalidad de guardado en desarrollo.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sb-container">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">Gestiona tu información personal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-orange-100">
                  {getAvatarUrl(userData) ? (
                    <img
                      src={getAvatarUrl(userData)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                      👤
                    </div>
                  )}
                </div>
                <label className="absolute bottom-2 right-2 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg">
                  <FiCamera className="text-white text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Click en la cámara para cambiar</p>
            </div>

            {/* Información del usuario */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="text-orange-600" />
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="text-orange-600" />
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiMail className="text-orange-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiPhone className="text-orange-600" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="0987654321"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiMapPin className="text-orange-600" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Calle, número, ciudad"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                    >
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MiPerfilPage;
