import axios from 'axios';
import Cookies from 'js-cookie';

// URL base del backend
const API_BASE_URL = 'http://localhost:8080';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos de timeout (aumentado para manejar imágenes)
});

// Funciones utilitarias para manejo seguro de cookies
// Duración de sesión en milisegundos (30 minutos)
const SESSION_DURATION_MS = 30 * 60 * 1000;

const cookieUtils = {
  // Genera una fecha de expiración a 30 minutos desde 'ahora'
  _expiryDate: () => new Date(Date.now() + SESSION_DURATION_MS),

  setAuthToken: (token) => {
    Cookies.set('authToken', token, { 
      expires: cookieUtils._expiryDate(), // Expira en 30 minutos
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      httpOnly: false
    });
  },
  
  getAuthToken: () => Cookies.get('authToken'),
  
  removeAuthToken: () => Cookies.remove('authToken'),
  
  setUserData: (userData) => {
    Cookies.set('userData', JSON.stringify(userData), {
      expires: cookieUtils._expiryDate(), // Alinear expiración con el token
      secure: window.location.protocol === 'https:',
      sameSite: 'strict'
    });
  },
  
  getUserData: () => {
    const userData = Cookies.get('userData');
    return userData ? JSON.parse(userData) : null;
  },
  
  removeUserData: () => Cookies.remove('userData'),

  // Refresca la expiración (sliding session)
  refreshSession: () => {
    const token = Cookies.get('authToken');
    if (token) {
      cookieUtils.setAuthToken(token);
    }
    const userData = Cookies.get('userData');
    if (userData) {
      cookieUtils.setUserData(JSON.parse(userData));
    }
  }
};

// Interceptor para agregar token de autenticación automáticamente
api.interceptors.request.use(
  (config) => {
    const token = cookieUtils.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Renovar expiración en cada request (sliding expiration)
      cookieUtils.refreshSession();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      cookieUtils.removeAuthToken();
      cookieUtils.removeUserData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funciones para autenticación
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/users/login', {
      email,
      password
    });
    return response.data;
  },

  register: async (formData) => {
    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  logout: () => {
    cookieUtils.removeAuthToken();
    cookieUtils.removeUserData();
  },

  // Función auxiliar para guardar token en cookie después del login
  saveAuthData: (token, userData) => {
    cookieUtils.setAuthToken(token);
    if (userData) {
      cookieUtils.setUserData(userData);
    }
  },

  // Función auxiliar para obtener datos del usuario desde cookie
  getUserData: () => {
    return cookieUtils.getUserData();
  },

  // Función auxiliar para verificar si el usuario está logueado
  isAuthenticated: () => {
    return !!cookieUtils.getAuthToken();
  }
};

// Funciones para usuarios
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  whoAmI: async () => {
    const response = await api.get('/users/whoami');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};

// Funciones para productos
export const productAPI = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  }
};

export default api;