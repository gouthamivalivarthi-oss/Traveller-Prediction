import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smart_traveler_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const loginUser = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// Travel Prediction Services
export const predictTrip = async (tripDetails) => {
  const res = await api.post('/travel/predict', tripDetails);
  return res.data;
};

export const compareDates = async (details) => {
  const res = await api.post('/travel/compare-dates', details);
  return res.data;
};

export const calculateRisk = async (factors) => {
  const res = await api.post('/travel/risk', factors);
  return res.data;
};

// Chatbot Service
export const sendChatMessage = async (payload) => {
  const res = await api.post('/chat', payload);
  return res.data;
};

// Route Planning Services
export const searchRoutes = async (routeQuery) => {
  const res = await api.post('/routes/search', routeQuery);
  return res.data;
};

export const compareTransportModes = async (query) => {
  const res = await api.post('/routes/compare', query);
  return res.data;
};

// Holiday Services
export const getHolidays = async () => {
  const res = await api.get('/holidays');
  return res.data;
};

export const createHoliday = async (holidayData) => {
  const res = await api.post('/holidays', holidayData);
  return res.data;
};

// Trip Management Services
export const getTrips = async (status = '') => {
  const res = await api.get(`/trips${status ? `?status=${status}` : ''}`);
  return res.data;
};

export const createTrip = async (tripData) => {
  const res = await api.post('/trips', tripData);
  return res.data;
};

export const updateTrip = async (id, tripData) => {
  const res = await api.put(`/trips/${id}`, tripData);
  return res.data;
};

export const deleteTrip = async (id) => {
  const res = await api.delete(`/trips/${id}`);
  return res.data;
};

// Profile Services
export const getUserProfile = async () => {
  const res = await api.get('/profile');
  return res.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await api.put('/profile', profileData);
  return res.data;
};

// Analytics & Evaluation Services
export const getAnalytics = async () => {
  const res = await api.get('/analytics');
  return res.data;
};

// RAG Query
export const queryRAG = async (query, contextPrediction = null) => {
  const res = await api.post('/rag/query', { query, context_prediction: contextPrediction });
  return res.data;
};

export default api;
