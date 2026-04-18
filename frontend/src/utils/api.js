import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('amalgus_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default API;

// Products
export const getProducts = (params) => API.get('/products', { params });
export const searchProducts = (q) => API.get('/products/search', { params: { q } });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getAlliedProducts = () => API.get('/products/allied');

// AI
export const matchGlass = (query) => API.post('/ai/match', { query });

// Rates
export const getTodayRates = () => API.get('/rates');
export const getRateHistory = (params) => API.get('/rates/history', { params });

// Estimate
export const getEstimate = (data) => API.post('/estimate', data);

// Service Partners
export const getServicePartners = (params) => API.get('/service-partners', { params });

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
