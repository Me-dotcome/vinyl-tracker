import axios from 'axios';

// Create an axios instance that automatically attaches the JWT
const api = axios.create({
  baseURL: '/api',
});

// Before every request, attach the token from localStorage if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vinyl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ───────────────────────────────────────
export const registerUser = (email, password) =>
  api.post('/auth/register', { email, password });

export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

// ─── Records ────────────────────────────────────
export const getRecords = (filters = {}) =>
  api.get('/records', { params: filters });

export const addRecord = (recordData) =>
  api.post('/records', recordData);

export const updateRecord = (id, recordData) =>
  api.put(`/records/${id}`, recordData);

export const deleteRecord = (id) =>
  api.delete(`/records/${id}`);

// ─── Discogs ─────────────────────────────────────
export const searchDiscogs = (query) =>
  api.get('/discogs/search', { params: { q: query } });
