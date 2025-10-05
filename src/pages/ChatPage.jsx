import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSend, FiChevronLeft, FiImage, FiPaperclip, FiSmile } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

function ChatPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Simulación de datos del vendedor
  const vendor = {
    id: vendorId,
    name: 'Juan Pérez',
    avatar: 'J',
    verified: true,
    online: true,
    product: {
      id: 1,
      title: 'iPhone 14 Pro Max 128GB en excelente estado',
      price: 890,
      image: '📱'
    }
  };

  // Mensajes de ejemplo
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: '¡Hola! Vi tu anuncio del iPhone 14 Pro Max. ¿Está disponible?',
        sender: 'me',
        timestamp: '10:30'
      },
      {
        id: 2,
        text: '¡Hola! Sí, está disponible. ¿Te interesa?',
        sender: 'vendor',
        timestamp: '10:32'
      },
      {
        id: 3,
        text: '¿Cuál es el estado real del teléfono? ¿Tiene algún detalle?',
        sender: 'me',
        timestamp: '10:33'
      },
      {
        id: 4,
        text: 'Está en excelente estado, como nuevo. Sin rayones ni golpes. La batería está al 98%.',
        sender: 'vendor',
        timestamp: '10:35'
      }
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => {
        const updated = [...prev, newMessage];
        // Scroll después de actualizar
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
        return updated;
      });
      setMessage('');

      // Simulación de respuesta automática del vendedor
      setTimeout(() => {
        const vendorResponse = {
          id: Date.now(),
          text: '¡Perfecto! ¿Tienes alguna otra pregunta?',
          sender: 'vendor',
          timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => {
          const updated = [...prev, vendorResponse];
          requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          });
          return updated;
        });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EEE5E9' }}>
      {/* Información del Producto - Diseño coherente */}
      <div className="bg-white border-b border-gray-100">
        <div className="sb-container py-4">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm">
                {vendor.product.image}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Producto en conversación</p>
                <p className="font-bold text-gray-900 mb-1 line-clamp-1">{vendor.product.title}</p>
                <p className="text-xl font-black" style={{ color: '#CF5C36' }}>
                  ${vendor.product.price}
                </p>
              </div>
              <button
                onClick={() => navigate(`/producto/${vendor.product.id}`)}
                className="hidden sm:flex px-5 py-2.5 font-bold text-sm rounded-xl transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: '#CF5C36', color: 'white' }}
              >
                Ver producto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información del vendedor */}
      <div className="bg-white border-b border-gray-100">
        <div className="sb-container py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                {vendor.avatar}
              </div>
              {vendor.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-base text-gray-900">{vendor.name}</h2>
                {vendor.verified && <MdVerified className="text-blue-500 text-sm" />}
              </div>
              <p className="text-xs font-semibold" style={{ color: vendor.online ? '#10B981' : '#9CA3AF' }}>
                {vendor.online ? 'En línea' : 'Desconectado'}
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              <FiChevronLeft />
              Volver
            </button>
          </div>
        </div>
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1">
        <div className="sb-container py-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Indicador de inicio de conversación */}
            <div className="flex justify-center">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-500">Hoy</p>
              </div>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                  {/* Avatar para mensajes del vendedor */}
                  {msg.sender === 'vendor' && (
                    <div className="flex items-end gap-2 mb-1">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                        {vendor.avatar}
                      </div>
                      <p className="text-xs font-semibold text-gray-600">{vendor.name}</p>
                    </div>
                  )}

                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      msg.sender === 'me'
                        ? 'rounded-br-sm'
                        : 'rounded-bl-sm'
                    }`}
                    style={{
                      backgroundColor: msg.sender === 'me' ? '#CF5C36' : 'white',
                      color: msg.sender === 'me' ? 'white' : '#1F2937'
                    }}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 px-1 font-medium ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input de Mensaje - Diseño moderno */}
      <div className="bg-white border-t border-gray-100 shadow-lg sticky bottom-0">
        <div className="sb-container py-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-4xl mx-auto">
            {/* Botones de acción */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors group"
                title="Adjuntar imagen"
              >
                <FiImage className="text-xl text-gray-500 group-hover:text-orange-600 transition-colors" />
              </button>
              <button
                type="button"
                className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors group"
                title="Adjuntar archivo"
              >
                <FiPaperclip className="text-xl text-gray-500 group-hover:text-orange-600 transition-colors" />
              </button>
            </div>

            {/* Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-2xl focus:border-orange-400 focus:outline-none text-gray-700 font-medium transition-colors bg-gray-50 focus:bg-white"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiSmile className="text-xl text-gray-400" />
              </button>
            </div>

            {/* Botón de enviar */}
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-3.5 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
              style={{ backgroundColor: message.trim() ? '#CF5C36' : '#D1D5DB' }}
            >
              <FiSend className="text-xl text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
