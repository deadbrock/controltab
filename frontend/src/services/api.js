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

// Usuários
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, newPassword) => api.post(`/users/${id}/reset-password`, { newPassword }),
};

// Relatórios
export const relatoriosAPI = {
  geral: (params) => api.get('/relatorios/geral', { params }),
  falhas: (params) => api.get('/relatorios/falhas', { params }),
  manutencoes: (params) => api.get('/relatorios/manutencoes', { params }),
};

// Exportações (PDF e Excel)
export const exportAPI = {
  tabletsPDF: (params) => api.get('/exports/tablets/pdf', { params, responseType: 'blob' }),
  tabletsExcel: (params) => api.get('/exports/tablets/excel', { params, responseType: 'blob' }),
  falhasPDF: (params) => api.get('/exports/falhas/pdf', { params, responseType: 'blob' }),
  falhasExcel: (params) => api.get('/exports/falhas/excel', { params, responseType: 'blob' }),
  manutencoesPDF: (params) => api.get('/exports/manutencoes/pdf', { params, responseType: 'blob' }),
  manutencoesExcel: (params) => api.get('/exports/manutencoes/excel', { params, responseType: 'blob' }),
};

export default api;
