import { baseURL } from './baseAPI';

// Add service to favorites
export const addFavorite = async (serviceId) => {
    try {
        const response = await baseURL.post('/favorites', { serviceId });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Remove service from favorites
export const removeFavorite = async (serviceId) => {
    try {
        const response = await baseURL.delete(`/favorites/${serviceId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get all user's favorite services
export const getFavorites = async () => {
    try {
        const response = await baseURL.get('/favorites/user');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Check if a service is favorited
export const checkIsFavorite = async (serviceId) => {
    try {
        const response = await baseURL.get(`/favorites/check/${serviceId}`);
        return response.data.isFavorite;
    } catch (error) {
        return false;
    }
};
