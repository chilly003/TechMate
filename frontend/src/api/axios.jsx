import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});
// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        else {
            config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZWNobWF0ZSIsImlhdCI6MTc0MzY2OTM0NSwic3ViIjoiMTciLCJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwicm9sZSI6IlVTRVIiLCJleHAiOjE3NDM4NDkzNDV9.5B4nOzUbhEUjqcCkbs3XLjkq1CkKM5LCoQE3xPK-UnU';
        }

        return config;
        
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            // Redirect to login or handle as needed
        }
        return Promise.reject(error);
    }
);

export default api;