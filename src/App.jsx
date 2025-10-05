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
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductosPage from './pages/ProductosPage';
import VenderPage from './pages/VenderPage';
import CategoriasPage from './pages/CategoriasPage';
import ProductoDetallePage from './pages/ProductoDetallePage';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();

  // Páginas donde no se muestra Header y Footer
  const excludedPages = ['/login', '/register'];
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
        </Routes>
      </main>

      {/* Footer condicional */}
      {!shouldExcludeNavigation && <Footer />}
    </div>
  );
}

export default App;