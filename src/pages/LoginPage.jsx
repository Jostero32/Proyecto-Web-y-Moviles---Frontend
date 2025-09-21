import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/Logo de Shop&Buy.png';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#EEE5E9' }}>
      {/* Partículas flotantes de fondo */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 animate-morphing" style={{ backgroundColor: '#CF5C36' }}></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#EFC88B' }}></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 rounded-full opacity-5 animate-pulse" style={{ backgroundColor: '#7C7C7C' }}></div>

      {/* Contenedor principal */}
      <div className="w-full max-w-md mx-4 animate-scaleIn">
        {/* Tarjeta de login */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 glass-effect hover-elevate">
          {/* Header con logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <img
                src={logo}
                alt="Shop&Buy logo"
                className="w-20 h-20 object-contain mx-auto animate-glow"
              />
              <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 animate-spin" style={{ borderColor: '#CF5C36', animationDuration: '10s' }}></div>
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ color: '#CF5C36' }}>
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-gray-600">Entra a tu cuenta de Shop&Buy</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect"
                  placeholder="tu@email.com"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📧
                </div>
              </div>
            </div>

            {/* Campo Password */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all glass-effect"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Recordar y olvide contraseña */}
            <div className="flex items-center justify-between animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 focus:ring-orange-500"
                  style={{ accentColor: '#CF5C36' }}
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <Link
                to="#"
                className="text-sm font-medium hover:underline"
                style={{ color: '#CF5C36' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 futuristic-border animate-fadeInUp"
              style={{ backgroundColor: '#CF5C36', animationDelay: '0.5s' }}
            >
              🚀 Entrar a Shop&Buy
            </button>
          </form>

          {/* Link a registro */}
          <div className="mt-8 text-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: '#CF5C36' }}
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Link de vuelta al home */}
          <div className="mt-6 text-center animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              ← Volver al inicio
            </Link>
          </div>

          {/* Badge de seguridad difuminado dentro del div */}
          <div className="mt-8 text-center animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full opacity-50">
              <span className="text-green-500 opacity-70">🛡️</span>
              <span className="text-xs font-medium text-gray-400 opacity-80">Conexión 100% segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
