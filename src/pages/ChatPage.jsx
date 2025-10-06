import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSend, FiChevronLeft, FiMessageSquare, FiSearch } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

function ChatPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Simulación de conversaciones activas
  useEffect(() => {
    const mockConversations = [
      {
        id: '1',
        vendorName: 'Juan Pérez',
        vendorAvatar: 'J',
        verified: true,
        online: true,
        product: {
          id: 1,
          title: 'iPhone 14 Pro Max 128GB',
          price: 890,
          image: '📱'
        },
        lastMessage: 'Está en excelente estado, como nuevo.',
        lastMessageTime: '10:35',
        unread: 2,
        messages: [
          { id: 1, text: '¡Hola! Vi tu anuncio del iPhone 14 Pro Max. ¿Está disponible?', sender: 'me', timestamp: '10:30' },
          { id: 2, text: '¡Hola! Sí, está disponible. ¿Te interesa?', sender: 'vendor', timestamp: '10:32' },
          { id: 3, text: '¿Cuál es el estado real del teléfono?', sender: 'me', timestamp: '10:33' },
          { id: 4, text: 'Está en excelente estado, como nuevo. Sin rayones ni golpes.', sender: 'vendor', timestamp: '10:35' }
        ]
      },
      {
        id: '2',
        vendorName: 'María García',
        vendorAvatar: 'M',
        verified: false,
        online: false,
        product: {
          id: 2,
          title: 'MacBook Pro M3 512GB',
          price: 1850,
          image: '💻'
        },
        lastMessage: 'Perfecto, nos vemos mañana',
        lastMessageTime: 'Ayer',
        unread: 0,
        messages: [
          { id: 1, text: '¿Puedo verlo mañana?', sender: 'me', timestamp: 'Ayer 15:20' },
          { id: 2, text: 'Claro, ¿a qué hora te viene bien?', sender: 'vendor', timestamp: 'Ayer 15:25' },
          { id: 3, text: '¿A las 3pm?', sender: 'me', timestamp: 'Ayer 15:30' },
          { id: 4, text: 'Perfecto, nos vemos mañana', sender: 'vendor', timestamp: 'Ayer 15:32' }
        ]
      },
      {
        id: '3',
        vendorName: 'Carlos López',
        vendorAvatar: 'C',
        verified: true,
        online: true,
        product: {
          id: 3,
          title: 'AirPods Pro 2da Gen',
          price: 180,
          image: '🎧'
        },
        lastMessage: '¿Aceptas $150?',
        lastMessageTime: 'Hace 2 días',
        unread: 1,
        messages: [
          { id: 1, text: 'Me interesan los AirPods', sender: 'me', timestamp: 'Hace 2 días' },
          { id: 2, text: '¿Aceptas $150?', sender: 'vendor', timestamp: 'Hace 2 días' }
        ]
      }
    ];

    setConversations(mockConversations);

    // Si hay vendorId en la URL, seleccionar ese chat
    if (vendorId) {
      const chat = mockConversations.find(c => c.id === vendorId);
      if (chat) {
        setSelectedChat(chat);
        setMessages(chat.messages);
      }
    }
  }, [vendorId]);

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    setMessages(conversation.messages);
    navigate(`/chat/${conversation.id}`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Scroll al final después de agregar el mensaje
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);

      // Simulación de respuesta automática
      setTimeout(() => {
        const vendorResponse = {
          id: Date.now(),
          text: '¡Perfecto! ¿Tienes alguna otra pregunta?',
          sender: 'vendor',
          timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, vendorResponse]);

        // Scroll al final después de la respuesta
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }, 2000);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sb-container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">Mis Mensajes</h1>
          <p className="text-gray-600 mt-1">Chatea con vendedores y compradores</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Lista de Conversaciones */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            {/* Buscador */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Lista de chats */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectChat(conv)}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      selectedChat?.id === conv.id ? 'bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                          {conv.vendorAvatar}
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-gray-900 text-sm truncate">{conv.vendorName}</h3>
                            {conv.verified && <MdVerified className="text-blue-500 text-xs flex-shrink-0" />}
                          </div>
                          <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 truncate">{conv.product.title}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate flex-1">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-orange-600 text-white text-xs font-bold rounded-full">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FiMessageSquare className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500">No hay conversaciones</p>
                </div>
              )}
            </div>
          </div>

          {/* Área de Chat */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            {selectedChat ? (
              <>
                {/* Header del chat */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                        {selectedChat.vendorAvatar}
                      </div>
                      {selectedChat.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h2 className="font-bold text-gray-900">{selectedChat.vendorName}</h2>
                        {selectedChat.verified && <MdVerified className="text-blue-500" />}
                      </div>
                      <p className="text-xs text-green-600 font-semibold">
                        {selectedChat.online ? 'En línea' : 'Desconectado'}
                      </p>
                    </div>
                  </div>

                  {/* Producto en conversación */}
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                        {selectedChat.product.image}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-600 mb-1">{selectedChat.product.title}</p>
                        <p className="text-lg font-bold text-orange-600">${selectedChat.product.price}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/producto/${selectedChat.product.id}`)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                        {msg.sender === 'vendor' && (
                          <div className="flex items-end gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                              {selectedChat.vendorAvatar}
                            </div>
                            <p className="text-xs font-semibold text-gray-600">{selectedChat.vendorName}</p>
                          </div>
                        )}

                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            msg.sender === 'me'
                              ? 'bg-orange-600 text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <p className={`text-xs text-gray-400 mt-1 px-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de mensaje */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center gap-2"
                    >
                      <FiSend />
                      Enviar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FiMessageSquare className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Selecciona una conversación</h3>
                  <p className="text-gray-600">Elige un chat para comenzar a conversar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
