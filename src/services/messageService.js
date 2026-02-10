import { baseURL } from './baseAPI';

// Send message
export const sendMessage = async (receiverId, content) => {
    try {
        const response = await baseURL.post('/messages', {
            receiverId,
            content
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get conversations list
export const getConversations = async () => {
    try {
        const response = await baseURL.get('/messages/conversations');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get messages with specific user
export const getMessages = async (userId) => {
    try {
        const response = await baseURL.get(`/messages/conversation/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Mark message as read
export const markAsRead = async (messageId) => {
    try {
        const response = await baseURL.put(`/messages/${messageId}/read`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Mark all messages in conversation as read
export const markAllAsRead = async (userId) => {
    try {
        const response = await baseURL.put(`/messages/conversation/${userId}/read-all`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
