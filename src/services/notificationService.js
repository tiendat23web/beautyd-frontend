import { baseURL } from "./baseAPI";

// 1. Lấy danh sách thông báo
export const getNotifications = async () => {
    try {
        const response = await baseURL.get("/notifications");
        return response.data; // Hoặc response tùy vào cấu hình axios interceptor của bạn
    } catch (error) {
        console.error('Get Notifications error:', error);
        return []; 
    }
}

// 2. Đánh dấu đã đọc 1 thông báo
export const markAsRead = async (notificationId) => {
    try {
        // ⚠️ Đã sửa thành PATCH để khớp backend
        const response = await baseURL.patch(`/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        console.error('Mark as Read error:', error);
        throw error;
    }
};

// 3. Đánh dấu tất cả đã đọc
export const markAllAsRead = async () => {
    try {
        // ⚠️ Đã sửa thành PATCH và đường dẫn /mark-all-read
        const response = await baseURL.patch("/notifications/mark-all-read");
        return response.data;
    } catch (error) {
        console.error('Mark All as Read error:', error);
        throw error;
    }
};

// 4. Xóa thông báo
export const deleteNotification = async (notificationId) => {
    try {
        const response = await baseURL.delete(`/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error('Delete Notification error:', error);
        throw error;
    }
};

// 5. Đánh dấu nhiều thông báo (Optional - nếu component có dùng)
export const markMultipleAsRead = async (ids) => {
    try {
        const response = await baseURL.patch("/notifications/mark-multiple-read", { ids });
        return response.data;
    } catch (error) {
        console.error('Mark Multiple Read error:', error);
        throw error;
    }
};