import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      {/* Sección de llamada a la acción */}
      <div style={{ backgroundColor: '#EFC88B' }} className="py-16">
        <div className="sb-container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              ¿Tienes algo que vender?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Únete a miles de personas que ya están ganando dinero vendiendo cosas que ya no usan.
              Es gratis, fácil y seguro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="px-8 py-4 bg-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                style={{ color: '#CF5C36' }}
              >
                🚀 Publicar mi primer anuncio
              </Link>
              <Link
                to="/"
                className="px-8 py-4 border-2 border-gray-800 text-gray-800 font-semibold rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
              >
                Ver cómo funciona
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer principal */}
      <div style={{ backgroundColor: '#000000' }} className="text-white">
        <div className="sb-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Columna 1 - Marca */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: '#CF5C36' }}>S&B</span>
                </div>
                <div>
                  <h3 className="font-black text-lg">Shop&Buy</h3>
                  <p className="text-xs text-gray-400">Tu marketplace de confianza</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Compra y vende productos de segunda mano de forma segura y sencilla.
                Miles de artículos te esperan.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  📱
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  📧
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  🐦
                </a>
              </div>
            </div>

            {/* Columna 2 - Explorar */}
            <div>
              <h4 className="font-bold text-white mb-4">Explorar</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Últimos anuncios</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Tecnología</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Hogar y jardín</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Moda</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Deportes</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Motor</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Acceder</Link></li>
              </ul>
            </div>

            {/* Columna 3 - Ayuda */}
            <div>
              <h4 className="font-bold text-white mb-4">Ayuda</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Centro de ayuda</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Cómo vender</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Cómo comprar</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Seguridad</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>

            {/* Columna 4 - Legal */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Términos y condiciones</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Política de privacidad</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Política de cookies</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Aviso legal</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Línea de copyright */}
        <div style={{ backgroundColor: '#1a1a1a' }} className="py-4">
          <div className="sb-container flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Shop&Buy. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <span>Hecho con ❤️ en Ecuador</span>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">🇪🇨 EC</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">$ USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
