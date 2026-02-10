import { baseURL } from "./baseAPI";

export const getServices = async (categoryId) => {
    try {
        const response = await baseURL.get('/services', {
            params: categoryId ? { categoryId } : {}
        });
        return response;
    } catch (error) {
        console.error('Get Services error:', error);
        return { success: false, message: error.message };
    }
};


export const getServicesById = async (id) => {
    try {
        const response = await baseURL.get(`/services/${id}`);
        return response;
    } catch (error) {
        console.error('Get Services error:', error);
        return { success: false, message: error.message };
    }
};

export const getCategory = async () => {
    try {
        const response = await baseURL.get(`/categories`);
        return response;
    } catch (error) {
        console.error('Get Categories error:', error);
        return { success: false, message: error.message };
    }
};


export const getTransactionHistory = async () => {
    try {
        const response = await baseURL.get(`/users/transaction-history`);
        return response;
    } catch (error) {
        console.error('Get Categories error:', error);
        return { success: false, message: error.message };
    }
};

export const getBookingHistory = async () => {
    try {
        const response = await baseURL.get(`/users/booking-history`);
        return response;
    } catch (error) {
        console.error('Get Categories error:', error);
        return { success: false, message: error.message };
    }
};

export const searchServices = async (query) => {
    try {
        const response = await baseURL.get('/services', {
            params: { search: query }
        });
        return response;
    } catch (error) {
        console.error('Search Services error:', error);
        return { success: false, message: error.message };
    }
};

export const getServicesByProvider = async (providerId) => {
    try {
        const response = await baseURL.get(`/services/provider/${providerId}`);
        return response;
    } catch (error) {
        console.error('Get Services by Provider error:', error);
        return { success: false, message: error.message };
    }
};
