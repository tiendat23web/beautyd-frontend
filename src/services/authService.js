import { baseURL } from "./baseAPI";

export const loginUser = async (email, password) => {
    try {
        const response = await baseURL.post('/auth/login', { email, password });
        console.log('✅ Login response:', response.status, response.data);
        return response; 
    } catch (error) {
        console.error('❌ Login error:', error.response?.status, error.response?.data);
        throw error; 
    }
};

export const registerUser = async (data) => {
    try {
        const response = await baseURL.post('/auth/register', data);
        console.log('✅ Register response:', response.status);
        return response;
    } catch (error) {
        console.error('❌ Register error:', error.response?.data);
        throw error;
    }
};

export const checkEmailExists = async (email) => {
    try {
        const response = await baseURL.post('/auth/check-email', { email });
        return response;
    } catch (error) {
        console.error('❌ Check Email error:', error.response?.data);
        throw error;
    }
};

export const forgetPassword = async (email, newPassword) => {
    try {
        const response = await baseURL.post('/auth/forget-password', { email, newPassword });
        return response;
    } catch (error) {
        console.error('❌ Forget Password error:', error.response?.data);
        throw error;
    }
};

export const getProfile = async () => {
    try {
        const response = await baseURL.get('/users/profile');
        return response;
    } catch (error) {
        console.error('❌ Get Profile error:', error.response?.data);
        throw error;
    }
};

export const editProfile = async (data) => {
    try {
        const response = await baseURL.put('/users/profile', data);
        return response;
    } catch (error) {
        console.error('❌ Edit Profile error:', error.response?.data);
        throw error;
    }
};

export const changePassword = async (data) => {
    try {
        const response = await baseURL.post('/auth/change-password', data);
        return response;
    } catch (error) {
        console.error('❌ Change Password error:', error.response?.data);
        throw error; 
    }
};

// --- BỔ SUNG 2 HÀM MỚI NÀY ---

// 1. Gửi email xác thực
export const sendVerificationEmail = async () => {
    try {
        const response = await baseURL.post('/auth/send-verification');
        return response.data;
    } catch (error) {
        console.error('❌ Send Verification Email error:', error.response?.data);
        throw error;
    }
};

// 2. Xác thực token (Hàm bị thiếu gây lỗi)
export const verifyEmailToken = async (token) => {
    try {
        const response = await baseURL.post('/auth/verify-email', { token });
        return response.data;
    } catch (error) {
        console.error('❌ Verify Email Token error:', error.response?.data);
        throw error;
    }
};