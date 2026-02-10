import axios from "axios";

export const baseURL = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
    timeout: 10000,
    // BỎ headers mặc định - để axios tự động detect Content-Type
});

baseURL.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Sending request with token:', token.substring(0, 30) + '...');
        } else {
            console.log('⚠️  No token found in localStorage');
        }
        
        // Chỉ set Content-Type: application/json nếu KHÔNG phải FormData
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        // Nếu là FormData, browser sẽ tự động set Content-Type: multipart/form-data
        
        console.log('📤 Request:', config.method.toUpperCase(), config.url);
        console.log('📦 Data type:', config.data instanceof FormData ? 'FormData' : 'JSON');
        
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

baseURL.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', error.response?.status, error.config?.url);
        console.error('❌ Error details:', error.response?.data);
        
        if (error.response?.status === 401) {
            console.log('🚫 401 Unauthorized - Clearing token and redirecting to login');
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Chỉ redirect nếu không phải đang ở trang login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);