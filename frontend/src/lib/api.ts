import axios from 'axios';

// In production (Render), VITE_API_URL = https://your-backend.onrender.com/api
// In development, falls back to '/api' which Vite proxies to localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('sv_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('sv_token');
            localStorage.removeItem('sv_user');
            window.location.href = '/admin/login';
        }
        return Promise.reject(err);
    }
);

// Auth
export const authAPI = {
    login: (email: string, password: string) => API.post('/auth/login', { email, password }),
    getMe: () => API.get('/auth/me'),
};

// Gallery
export const galleryAPI = {
    getAll: (params?: Record<string, string | number>) => API.get('/gallery', { params }),
    create: (data: FormData) => API.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id: string, data: FormData | Record<string, unknown>) =>
        API.put(`/gallery/${id}`, data, { headers: { 'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json' } }),
    delete: (id: string) => API.delete(`/gallery/${id}`),
};

// Services
export const servicesAPI = {
    getAll: () => API.get('/services'),
    getAllAdmin: () => API.get('/services/all'),
    create: (data: FormData) => API.post('/services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id: string, data: FormData | Record<string, unknown>) =>
        API.put(`/services/${id}`, data, { headers: { 'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json' } }),
    delete: (id: string) => API.delete(`/services/${id}`),
};

// Frames
export const framesAPI = {
    getAll: (params?: Record<string, string>) => API.get('/frames', { params }),
    getAllAdmin: () => API.get('/frames/all'),
    create: (data: FormData) => API.post('/frames', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id: string, data: FormData | Record<string, unknown>) =>
        API.put(`/frames/${id}`, data, { headers: { 'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json' } }),
    delete: (id: string) => API.delete(`/frames/${id}`),
};

// Orders
export const ordersAPI = {
    create: (data: FormData) => API.post('/orders', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getAll: (params?: Record<string, string | number>) => API.get('/orders', { params }),
    update: (id: string, data: Record<string, unknown>) => API.put(`/orders/${id}`, data),
};



// Contact
export const contactAPI = {
    create: (data: Record<string, string>) => API.post('/contact', data),
    getAll: () => API.get('/contact'),
    markRead: (id: string) => API.put(`/contact/${id}/read`),
};

// Dashboard
export const dashboardAPI = {
    getStats: () => API.get('/dashboard/stats'),
};

export default API;
