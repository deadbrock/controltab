import axios from 'axios';

// Configuração da API - produção vs desenvolvimento
const isProduction = window.location.hostname !== 'localhost';
const RAILWAY_API = 'https://controltab-production.up.railway.app/api';
const LOCAL_API = '/api';

const baseURL = isProduction ? RAILWAY_API : LOCAL_API;

console.log('🔧 API Config:', {
  hostname: window.location.hostname,
  isProduction,
  baseURL
});

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    
    // Se token expirado ou inválido, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Tablets
export const tabletsAPI = {
  getAll: (params) => api.get('/tablets', { params }),
  getById: (id) => api.get(`/tablets/${id}`),
  create: (data) => api.post('/tablets', data),
  update: (id, data) => api.put(`/tablets/${id}`, data),
  delete: (id) => api.delete(`/tablets/${id}`),
  getStatistics: () => api.get('/tablets/statistics'),
};

// Manutenções
export const manutencoesAPI = {
  getAll: (params) => api.get('/manutencoes', { params }),
  create: (data) => api.post('/manutencoes', data),
  update: (id, data) => api.put(`/manutencoes/${id}`, data),
  delete: (id) => api.delete(`/manutencoes/${id}`),
};

// Falhas
export const falhasAPI = {
  getAll: (params) => api.get('/falhas', { params }),
  create: (data) => api.post('/falhas', data),
  update: (id, data) => api.put(`/falhas/${id}`, data),
  delete: (id) => api.delete(`/falhas/${id}`),
};

// Trocas
export const trocasAPI = {
  getAll: () => api.get('/trocas'),
  getById: (id) => api.get(`/trocas/${id}`),
  create: (data) => api.post('/trocas', data),
  delete: (id) => api.delete(`/trocas/${id}`),
};

export default api;
