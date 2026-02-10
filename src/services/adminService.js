import { baseURL } from './baseAPI';

// Dashboard statistics
export const getDashboardStats = async () => {
    try {
        const response = await baseURL.get('/admin/dashboard');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// User management
export const getAllUsers = async (page = 1, limit = 20, role = 'ALL', status = 'ALL') => {
    try {
        const response = await baseURL.get('/admin/users', {
            params: { page, limit, role, status }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const banUser = async (userId) => {
    try {
        const response = await baseURL.put(`/admin/users/${userId}/ban`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const unbanUser = async (userId) => {
    try {
        const response = await baseURL.put(`/admin/users/${userId}/unban`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// KYC management
export const getPendingKYC = async () => {
    try {
        const response = await baseURL.get('/admin/kyc/pending');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const approveKYC = async (documentId) => {
    try {
        const response = await baseURL.put(`/admin/kyc/${documentId}/approve`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const rejectKYC = async (documentId, reason) => {
    try {
        const response = await baseURL.put(`/admin/kyc/${documentId}/reject`, { reason });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
