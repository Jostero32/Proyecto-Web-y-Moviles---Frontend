import { Link } from 'react-router-dom';
import { FiChevronRight, FiTrendingUp } from 'react-icons/fi';
import { categoriesData } from '../data/categories';

function CategoriasPage() {
  const trendingCategories = [
    { name: 'Celulares iPhone', count: 2345 },
    { name: 'Laptops Gaming', count: 1890 },
    { name: 'Muebles de Sala', count: 1567 },
    { name: 'Bicicletas', count: 1234 },
    { name: 'PlayStation', count: 1123 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEE5E9' }}>
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="sb-container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-6">
            <FiTrendingUp className="text-xl" style={{ color: '#CF5C36' }} />
            <span className="text-sm font-bold" style={{ color: '#CF5C36' }}>EXPLORA POR CATEGORÍA</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Todas las categorías
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas navegando por nuestras categorías populares
          </p>
        </div>
      </section>

      {/* Categorías Principales */}
      <section className="py-16">
        <div className="sb-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesData.map((category, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <category.icon className="text-4xl" style={{ color: category.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">
                      {category.title}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: category.color }}>
                      {category.count} productos
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{category.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {category.subcategories.map((sub, idx) => (
                    <Link
                      key={idx}
                      to={`/productos?category=${category.value}&subcategory=${sub.value}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>

                <Link
                  to={`/productos?category=${category.value}`}
                  className="inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all"
                  style={{ color: category.color }}
                >
                  Ver productos
                  <FiChevronRight className="text-lg" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Trending */}
      <section className="py-16 bg-white">
        <div className="sb-container">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            🔥 Categorías más buscadas
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingCategories.map((cat, index) => (
              <Link
                key={index}
                to="/productos"
                className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <p className="font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform">
                  {cat.name}
                </p>
                <p className="text-sm text-gray-600">{cat.count} productos</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16">
        <div className="sb-container">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Publica tu producto de forma gratuita y llegá a miles de compradores
            </p>
            <Link
              to="/vender"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              Publicar gratis
              <FiChevronRight className="text-xl" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CategoriasPage;
