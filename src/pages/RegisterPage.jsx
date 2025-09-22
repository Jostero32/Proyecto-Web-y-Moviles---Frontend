import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/Logo de Shop&Buy.png';

function RegisterPage() {
  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    name: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatarUrl: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarUrl: file
      }));

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Aquí iría la lógica de registro
    console.log('Register attempt:', formData);
  };

  return (
    <div className="h-screen relative overflow-hidden flex items-center justify-center px-4" style={{ backgroundColor: '#EEE5E9' }}>
      <div className="floating-particles absolute inset-0 pointer-events-none">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-10 animate-morphing" style={{ backgroundColor: '#CF5C36' }}></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#EFC88B' }}></div>
      <div className="w-full max-w-xl mx-auto animate-scaleIn h-full flex items-center">
        <div className="bg-white rounded-3xl shadow-2xl p-7 glass-effect hover-elevate w-full max-h-[96vh] overflow-hidden">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <img
                src={logo}
                alt="Shop&Buy logo"
                className="w-18 h-18 object-contain mx-auto animate-glow"
              />
              <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 animate-spin" style={{ borderColor: '#CF5C36', animationDuration: '10s' }}></div>
            </div>
            <h1 className="text-3xl font-black mb-3" style={{ color: '#CF5C36' }}>
              ¡Únete a Shop&Buy!
            </h1>
            <p className="text-gray-600 text-base">Crea tu cuenta y empieza a comprar y vender</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="relative inline-block">
                <div className="w-22 h-22 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 mx-auto">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: '#CF5C36' }}
                >
                  <span className="text-white text-sm">📷</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-2">
                  Nombres
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect text-base"
                  placeholder="Juan Carlos"
                  required
                />
              </div>

              <div className="animate-fadeInRight" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="lastname" className="block text-base font-semibold text-gray-700 mb-2">
                  Apellidos
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect text-base"
                  placeholder="Pérez García"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-fadeInLeft" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="dni" className="block text-base font-semibold text-gray-700 mb-2">
                  Cédula
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect text-base"
                  placeholder="1234567890"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>

              <div className="animate-fadeInRight" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-2">
                  Celular
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect text-base"
                  placeholder="0987654321"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect text-base"
                  placeholder="tu@email.com"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">
                  📧
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-fadeInLeft" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect text-base"
                    placeholder="Mínimo 8 caracteres"
                    minLength="8"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-base"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="animate-fadeInRight" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect text-base"
                    placeholder="Repite tu contraseña"
                    minLength="8"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-base"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 mt-1 rounded border-gray-300 focus:ring-orange-500 flex-shrink-0"
                  style={{ accentColor: '#CF5C36' }}
                  required
                />
                <span className="text-base text-gray-600">
                  Acepto los{' '}
                  <Link to="#" className="font-medium hover:underline" style={{ color: '#CF5C36' }}>
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link to="#" className="font-medium hover:underline" style={{ color: '#CF5C36' }}>
                    política de privacidad
                  </Link>
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-4 px-5 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 futuristic-border animate-fadeInUp text-base"
              style={{ backgroundColor: '#CF5C36', animationDelay: '0.7s' }}
            >
              Crear cuenta en Shop&Buy
            </button>
            <div className="flex justify-between items-center text-xs mt-4">
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: '#CF5C36' }}
              >
                ¿Ya tienes cuenta?
              </Link>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full opacity-50">
                <span className="text-green-500 opacity-70 text-xs">🛡️</span>
                <span className="text-xs font-medium text-gray-400 opacity-80">Seguro</span>
              </div>

              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
