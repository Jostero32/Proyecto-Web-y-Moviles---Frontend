import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSend, FiChevronLeft, FiMessageSquare, FiSearch } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { authAPI, conversationAPI, messageAPI, userAPI, productAPI, API_BASE_URL } from '../services/api';

// Función para formatear fecha relativa para mensajes
const formatMessageTime = (dateString) => {
  const now = new Date();
  const messageDate = new Date(dateString);
  const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return messageDate.toLocaleDateString('es-EC', { month: 'short', day: 'numeric' });
};

// Función para formatear timestamp de mensaje individual
const formatMessageTimestamp = (dateString) => {
  const messageDate = new Date(dateString);
  const now = new Date();
  
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  } else if (messageDate.toDateString() === new Date(now.getTime() - 86400000).toDateString()) {
    return `Ayer ${messageDate.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return messageDate.toLocaleDateString('es-EC', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

function ChatPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // Establecer usuario actual al montar el componente
  useEffect(() => {
    const userData = authAPI.getUserData();
    if (userData?.id) {
      setCurrentUserId(userData.id);
    }
  }, []);

  // Función para refrescar mensajes sin cambiar el selectedChat
  const refreshMessages = useCallback(async () => {
    if (!selectedChat) return;
    
    try {
      const backendMessages = await conversationAPI.getConversationMessages(selectedChat.id);
      
      const userData = authAPI.getUserData();
      const currentUserIdForMapping = userData?.id || currentUserId;
      
      const mappedMessages = backendMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.senderId === currentUserIdForMapping ? 'me' : 'vendor',
        timestamp: formatMessageTimestamp(msg.sentAt || msg.createdAt),
        originalData: msg
      }));
      
        // Solo actualizar si hay cambios (evitar re-renders innecesarios)
      setMessages(prevMessages => {
        const hasChanges = prevMessages.length !== mappedMessages.length ||
          (prevMessages.length > 0 && mappedMessages.length > 0 &&
           prevMessages[prevMessages.length - 1]?.id !== mappedMessages[mappedMessages.length - 1]?.id);
        
        if (hasChanges) {
          console.log('📬 Nuevos mensajes detectados, actualizando UI...');
          
          // Auto-scroll si hay mensajes nuevos
          setTimeout(() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 100);
          
          return mappedMessages;
        }
        
        return prevMessages; // No hay cambios
      });    } catch (error) {
      console.error('Error al refrescar mensajes:', error);
    }
  }, [selectedChat, currentUserId]);

  // Auto-refresh de mensajes cada 3 segundos cuando hay chat activo
  useEffect(() => {
    if (selectedChat) {
      // Refrescar inmediatamente
      refreshMessages();
      
      // Configurar intervalo
      refreshIntervalRef.current = setInterval(refreshMessages, 3000);
      
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    } else {
      // Limpiar intervalo si no hay chat seleccionado
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }
  }, [selectedChat, refreshMessages]);

  // Función para seleccionar un chat y cargar sus mensajes
  const handleSelectChat = useCallback(async (conversation) => {
    try {
      setSelectedChat(conversation);
      setMessagesLoading(true);
      
      // Cargar mensajes de la conversación desde el backend
      const backendMessages = await conversationAPI.getConversationMessages(conversation.id);
      
      // Mapear mensajes del backend al formato UI
      const userData = authAPI.getUserData();
      const currentUserIdForMapping = userData?.id || currentUserId;
      console.log('Mapeando mensajes con currentUserId:', currentUserIdForMapping);
      console.log('Mensajes del backend:', backendMessages);
      
      const mappedMessages = backendMessages.map(msg => {
        console.log('Mapeando mensaje:', msg);
        return {
          id: msg.id,
          text: msg.content,
          sender: msg.senderId === currentUserIdForMapping ? 'me' : 'vendor',
          timestamp: formatMessageTimestamp(msg.sentAt || msg.createdAt), // Usar sentAt primero
          // Datos originales
          originalData: msg
        };
      });
      
      setMessages(mappedMessages);
      navigate(`/chat/${conversation.id}`);
      
      // Scroll al final después de cargar mensajes
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, [currentUserId, navigate]);

  // Función para cargar conversaciones desde el backend
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener el usuario actual
      const userData = authAPI.getUserData();
      console.log('Usuario actual:', userData);
      if (userData) {
        setCurrentUserId(userData.id);
        console.log('Current user ID establecido:', userData.id);
      } else {
        console.error('No se pudo obtener datos del usuario');
      }

      // Cargar conversaciones del backend
      const backendConversations = await conversationAPI.getMyConversations();
      console.log('Conversaciones del backend:', backendConversations);
      
      // Mapear conversaciones del backend al formato UI
      const mappedConversations = await Promise.all(
        backendConversations.map(async (conversation) => {
          console.log('Procesando conversación completa:', JSON.stringify(conversation, null, 2));
          
          // Determinar quién es el otro usuario (buyer o seller)
          const isCurrentUserBuyer = conversation.buyerId === userData?.id;
          const otherUserId = isCurrentUserBuyer ? conversation.sellerId : conversation.buyerId;
          
          console.log('IDs para conversación:', {
            conversationId: conversation.id,
            currentUserId: userData?.id,
            buyerId: conversation.buyerId,
            sellerId: conversation.sellerId,
            isCurrentUserBuyer,
            otherUserId
          });
          
          // Obtener información del otro usuario
          let otherUser = null;
          if (otherUserId) {
            try {
              console.log(`Intentando obtener usuario ${otherUserId} para conversación ${conversation.id}`);
              otherUser = await userAPI.getUserById(otherUserId);
              console.log('Usuario obtenido completo:', JSON.stringify(otherUser, null, 2));
              console.log('Propiedades del usuario:', {
                id: otherUser?.id,
                name: otherUser?.name,
                lastname: otherUser?.lastname,
                email: otherUser?.email,
                avatarUrl: otherUser?.avatarUrl
              });
            } catch (error) {
              console.error(`Error obteniendo usuario ${otherUserId}:`, error);
              console.error('Detalles del error:', error.response?.data);
            }
          } else {
            console.warn('otherUserId es null o undefined para la conversación', conversation.id);
          }

          // Obtener información del producto
          let product = null;
          try {
            product = await productAPI.getProductById(conversation.productId);
          } catch (error) {
            console.warn(`No se pudo obtener producto ${conversation.productId}:`, error);
          }

          // Obtener último mensaje directamente de la conversación
          let lastMessage = null;
          let lastMessageText = 'Sin mensajes';
          
          if (conversation.Messages && conversation.Messages.length > 0) {
            lastMessage = conversation.Messages[conversation.Messages.length - 1];
            lastMessageText = lastMessage.content;
          } else {
            // Si no hay mensajes en la conversación, intentar obtenerlos del API
            try {
              const messages = await conversationAPI.getConversationMessages(conversation.id);
              if (messages && messages.length > 0) {
                lastMessage = messages[messages.length - 1];
                lastMessageText = lastMessage.content;
              }
            } catch {
              console.warn('No se pudieron obtener mensajes para conversación', conversation.id);
            }
          }

          // Construcción del nombre del usuario y avatar
          let displayName = 'Usuario Desconocido';
          let avatarLetter = 'U';
          let avatarImage = null;
          
          if (otherUser) {
            // El backend usa 'name' y 'lastname', no 'firstName' y 'lastName'
            const firstName = otherUser.name || '';
            const lastName = otherUser.lastname || '';
            
            if (firstName || lastName) {
              displayName = `${firstName} ${lastName}`.trim();
              avatarLetter = (firstName[0] || lastName[0] || 'U').toUpperCase();
            } else if (otherUser.email) {
              // Si no hay nombre, usar el email completo, no solo la parte antes del @
              displayName = otherUser.email;
              avatarLetter = otherUser.email[0].toUpperCase();
            }
            
            // El backend usa 'avatarUrl', no 'profilePicture'
            if (otherUser.avatarUrl) {
              avatarImage = otherUser.avatarUrl.startsWith('http') 
                ? otherUser.avatarUrl 
                : `${API_BASE_URL}${otherUser.avatarUrl}`;
            }
          }
          
          console.log('Nombre construido:', JSON.stringify({ 
            displayName, 
            avatarLetter, 
            avatarImage,
            userFields: {
              name: otherUser?.name,
              lastname: otherUser?.lastname,
              email: otherUser?.email,
              avatarUrl: otherUser?.avatarUrl
            }
          }, null, 2));

          return {
            id: conversation.id,
            vendorName: displayName,
            vendorAvatar: avatarLetter,
            vendorImage: avatarImage, // Imagen real del usuario
            verified: otherUser?.isVerified || false,
            online: false, // El backend no maneja estado online
            product: product ? {
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.photos?.[0] ? `${API_BASE_URL}${product.photos[0]}` : '📦'
            } : {
              id: conversation.productId,
              title: 'Producto no disponible',
              price: 0,
              image: '📦'
            },
            lastMessage: lastMessageText,
            lastMessageTime: lastMessage ? formatMessageTime(lastMessage.createdAt || lastMessage.sentAt) : '',
            unread: 0, // Por ahora sin lógica de no leídos
            // Datos originales para referencia
            originalData: conversation,
            isCurrentUserBuyer
          };
        })
      );

      setConversations(mappedConversations);

      // Si hay vendorId en la URL, buscar y seleccionar esa conversación
      if (vendorId) {
        const targetConversation = mappedConversations.find(c => c.id.toString() === vendorId);
        if (targetConversation) {
          await handleSelectChat(targetConversation);
        }
      }
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [handleSelectChat, vendorId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const canSend = message.trim() && selectedChat && !sendingMessage;
    console.log('Intentando enviar mensaje:', {
      message: message.trim(),
      messageLength: message.trim().length,
      selectedChat: selectedChat?.id,
      sendingMessage,
      currentUserId,
      canSend
    });
    
    if (canSend) {
      try {
        setSendingMessage(true);
        
        // Enviar mensaje al backend
        console.log('Enviando mensaje al backend...');
        const sentMessage = await messageAPI.sendMessage(selectedChat.id, message.trim());
        console.log('Mensaje enviado:', sentMessage);
        
        // Crear mensaje local para UI inmediata
        const newMessage = {
          id: sentMessage.id,
          text: message.trim(),
          sender: 'me',
          timestamp: formatMessageTimestamp(sentMessage.sentAt || sentMessage.createdAt),
          originalData: sentMessage
        };
        
        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Scroll al final después de agregar el mensaje
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
        
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        console.error('Detalles del error completo:', JSON.stringify(error.response?.data, null, 2));
        console.error('Status del error:', error.response?.status);
        console.error('Headers del error:', error.response?.headers);
        
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
        
        // Verificar si es el error específico de notificaciones que podemos ignorar
        if (errorMessage && errorMessage.includes('Notification.title cannot be null')) {
          console.warn('Error de notificación REST detectado - Probablemente el mensaje sí se creó');
          
          // Usar la función de refresh para verificar si el mensaje se creó
          try {
            console.log('Recargando mensajes para verificar si se creó...');
            await refreshMessages();
            setMessage(''); // Limpiar input
            
            // Scroll al final
            setTimeout(() => {
              if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }, 100);
            
            console.log('✅ Mensaje enviado correctamente (error de notificación ignorado)');
            
          } catch (reloadError) {
            console.error('Error al recargar mensajes:', reloadError);
            alert('Error: No se pudo verificar si el mensaje se envió');
          }
          
        } else {
          // Otros errores sí mostrar al usuario
          alert(`Error al enviar mensaje: ${errorMessage}`);
        }
      } finally {
        setSendingMessage(false);
      }
    } else {
      console.log('No se puede enviar mensaje:', {
        hasMessage: !!message.trim(),
        hasSelectedChat: !!selectedChat,
        notSending: !sendingMessage
      });
    }
  };

  // Cargar conversaciones al montar el componente
  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadConversations();
  }, [loadConversations, navigate]);

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
              {loading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length > 0 ? (
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
                        {conv.vendorImage ? (
                          <img 
                            src={conv.vendorImage} 
                            alt={conv.vendorName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold';
                              fallback.textContent = conv.vendorAvatar;
                              e.target.parentElement.appendChild(fallback);
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                            {conv.vendorAvatar}
                          </div>
                        )}
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
                      {selectedChat.vendorImage ? (
                        <img 
                          src={selectedChat.vendorImage} 
                          alt={selectedChat.vendorName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold';
                            fallback.textContent = selectedChat.vendorAvatar;
                            e.target.parentElement.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                          {selectedChat.vendorAvatar}
                        </div>
                      )}
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
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                        {selectedChat.product.image.startsWith('http') ? (
                          <img 
                            src={selectedChat.product.image} 
                            alt={selectedChat.product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="text-2xl text-gray-400">📦</div>';
                            }}
                          />
                        ) : (
                          <div className="text-2xl">{selectedChat.product.image}</div>
                        )}
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
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-md">
                            <div className="px-4 py-3 rounded-2xl bg-gray-200 animate-pulse">
                              <div className="h-4 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                        {msg.sender === 'vendor' && (
                          <div className="flex items-end gap-2 mb-1">
                            {selectedChat.vendorImage ? (
                              <img 
                                src={selectedChat.vendorImage} 
                                alt={selectedChat.vendorName}
                                className="w-6 h-6 rounded-full object-cover border border-orange-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = 'w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold';
                                  fallback.textContent = selectedChat.vendorAvatar;
                                  e.target.parentElement.appendChild(fallback);
                                }}
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                                {selectedChat.vendorAvatar}
                              </div>
                            )}
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
                  ))
                  )}
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
                      disabled={sendingMessage}
                      className={`px-6 py-3 text-white rounded-lg transition-colors font-semibold flex items-center gap-2 ${
                        sendingMessage 
                          ? 'bg-orange-400 cursor-not-allowed' 
                          : 'bg-orange-600 hover:bg-orange-700'
                      }`}
                    >
                      <FiSend className={sendingMessage ? 'animate-pulse' : ''} />
                      {sendingMessage ? 'Enviando...' : 'Enviar'}
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
