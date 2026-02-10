import { baseURL } from "./baseAPI";

// ✅ Lấy thông tin user (hoặc provider) theo ID
export const getUserById = async (userId) => {
    try {
        // Giả định API endpoint là /users/{id} theo chuẩn RESTful giống booking
        // Nếu backend của bạn là /api/get-user?id=... thì sửa lại dòng này nhé
        const response = await baseURL.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ✅ Lấy thông tin user đang đăng nhập (Profile)
export const getCurrentUser = async () => {
    try {
        const response = await baseURL.get("/users/profile"); // Hoặc "/auth/me" tùy backend
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ✅ Cập nhật thông tin user
export const updateUser = async (userId, userData) => {
    try {
        // Thường dùng put hoặc patch để update
        const response = await baseURL.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ✅ Lấy danh sách tất cả users (Dành cho Admin nếu cần)
export const getAllUsers = async () => {
    try {
        const response = await baseURL.get("/users");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};