import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});
// Request interceptor
api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        // return config;

        config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZWNobWF0ZSIsImlhdCI6MTc0MjgwMTY5OCwic3ViIjoiMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJyb2xlIjoiVVNFUiIsImV4cCI6MTc0Mjk4MTY5OH0.zQE9t8dk8MLkCyhYyC6tNE5mxyfA9FBIcdibCIZpZOM';

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