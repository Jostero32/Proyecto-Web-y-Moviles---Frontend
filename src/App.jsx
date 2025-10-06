import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

// Componentes
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductosPage from './pages/ProductosPage';
import VenderPage from './pages/VenderPage';
import CategoriasPage from './pages/CategoriasPage';
import ProductoDetallePage from './pages/ProductoDetallePage';
import ChatPage from './pages/ChatPage';
import MiPerfilPage from './pages/MiPerfilPage';
import MisProductosPage from './pages/MisProductosPage';
import NotificacionesPage from './pages/NotificacionesPage';
import FavoritosPage from './pages/FavoritosPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();

  // Páginas donde no se muestra Header y Footer
  const excludedPages = ['/login', '/register'];

  // Ya no excluir chat del header y footer
  const shouldExcludeNavigation = excludedPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header condicional */}
      {!shouldExcludeNavigation && <Header />}

      {/* Rutas */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/producto/:id" element={<ProductoDetallePage />} />
          <Route path="/vender" element={<VenderPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:vendorId" element={<ChatPage />} />
          <Route path="/mi-perfil" element={<MiPerfilPage />} />
          <Route path="/mis-productos" element={<MisProductosPage />} />
          <Route path="/notificaciones" element={<NotificacionesPage />} />
          <Route path="/favoritos" element={<FavoritosPage />} />
        </Routes>
      </main>

      {/* Footer condicional */}
      {!shouldExcludeNavigation && <Footer />}
    </div>
  );
}

export default App;