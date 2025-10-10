// Configuración WebSocket
export const WEBSOCKET_CONFIG = {
  // URL del servidor WebSocket
  // Cambia esto según tu configuración del backend
  url: 'ws://localhost:8080',
  
  // Configuraciones de conexión
  heartbeatInterval: 30000,     // 30 segundos
  reconnectBackoff: 1.5,        // Factor de backoff exponencial
  maxReconnectAttempts: 5,      // Máximo intentos de reconexión
  
  // Timeouts
  typingTimeout: 2000,          // 2 segundos para indicador de "escribiendo"
  
  // Configuraciones de desarrollo
  enableDebugLogs: true,        // Logs de debug en consola
  enableErrorReporting: true,   // Reportar errores
};

// Detectar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.MODE === 'development';

// URLs por ambiente
export const WEBSOCKET_URLS = {
  development: 'ws://localhost:8080',
  production: 'wss://tu-dominio.com',  // Cambiar por tu dominio en producción
};

// URL automática basada en el ambiente
export const getWebSocketUrl = () => {
  return isDevelopment ? WEBSOCKET_URLS.development : WEBSOCKET_URLS.production;
};