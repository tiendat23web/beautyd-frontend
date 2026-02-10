import { baseURL } from "./baseAPI";

export const createBooking = async (bookingData) => {
    try {
        const response = await baseURL.post('/bookings', bookingData);
        return response;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get user's bookings (with optional status filter)
export const getUserBookings = async (status = null) => {
    try {
        const params = status ? { status } : {};
        const response = await baseURL.get('/bookings', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
    try {
        const response = await baseURL.get(`/bookings/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Cancel booking
export const cancelBooking = async (bookingId, cancelReason) => {
    try {
        const response = await baseURL.put(`/bookings/${bookingId}/cancel`, {
            cancelReason,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update booking status (for providers/admins)
export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await baseURL.put(`/bookings/${bookingId}/status`, {
            status,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


export const sendFeedback = async (bookingId, rating, comment) => {
    try {
        const response = await baseURL.post("/feedbacks", {
            rating,
            comment,
            bookingId
        });
        return response;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const getFeedbacks = async () => {
    try {
        const response = await baseURL.get("/feedbacks");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

// Get booked time slots for a service on a specific date
export const getBookedTimeSlots = async (serviceId, date) => {
    try {
        const response = await baseURL.get(`/bookings/service/${serviceId}/booked-times`, {
            params: { date }
        });
        return response.data;
    } catch (error) {
        // If the endpoint doesn't exist, return empty array to allow all times
        console.warn('Booked times endpoint not available:', error);
        return { bookedTimes: [] };
    }
};
