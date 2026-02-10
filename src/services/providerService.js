import { baseURL } from "./baseAPI";

// NOTE: KYC upload is handled via /api/kyc/upload
export const uploadKYCDocuments = async (formData) => {
    // Không dùng try/catch để component bên ngoài bắt được lỗi thực sự
    const response = await baseURL.post('/kyc/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response; 
};

// ✅ MỚI: Get Provider Public Profile (for shop page)
export const getProviderProfile = async (providerId) => {
    const response = await baseURL.get(`/provider/profile/${providerId}`);
    return response;
};

// Get Provider Dashboard Statistics
export const getProviderStats = async () => {
    const response = await baseURL.get('/provider/stats');
    return response;
};

// Get Provider's Services
export const getProviderServices = async () => {
    const response = await baseURL.get('/provider/services');
    return response;
};

// Create New Service
export const createService = async (serviceData) => {
    const response = await baseURL.post('/provider/services', serviceData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
};

// Update Service
export const updateService = async (id, serviceData) => {
    const response = await baseURL.put(`/provider/services/${id}`, serviceData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
};

// Delete Service
export const deleteService = async (id) => {
    const response = await baseURL.delete(`/provider/services/${id}`);
    return response;
};

// Toggle Service Status
export const toggleServiceStatus = async (id, status) => {
    const response = await baseURL.patch(`/provider/services/${id}/status`, { status });
    return response;
};

export const updateBookingStatus = async (id, status) => {
    const response = await baseURL.post(`/provider/bookings/${id}/update-status`, { status });
    return response;
};

// Get Provider Bookings
export const getProviderBookings = async (status) => {
    const response = await baseURL.get('/provider/bookings', {
        params: status ? { status } : {}
    });
    return response;
};

// Accept Booking
export const acceptBooking = async (id) => {
    const response = await baseURL.post(`/provider/bookings/${id}/accept`);
    return response;
};

// Reject Booking
export const rejectBooking = async (id, reason) => {
    const response = await baseURL.post(`/provider/bookings/${id}/reject`, { reason });
    return response;
};

// Check-in Booking (Start Service)
export const checkInBooking = async (id) => {
    const response = await baseURL.post(`/provider/bookings/${id}/checkin`);
    return response;
};

// Complete Booking
export const completeBooking = async (id) => {
    const response = await baseURL.post(`/provider/bookings/${id}/complete`);
    return response;
};

// Get Provider Reviews
export const getProviderReviews = async () => {
    const response = await baseURL.get('/provider/reviews');
    return response;
};

// Reply to Review
export const replyToReview = async (reviewId, reply) => {
    const response = await baseURL.post(`/provider/reviews/${reviewId}/reply`, { reply });
    return response;
};

// Report Review
export const reportReview = async (reviewId, reason) => {
    const response = await baseURL.post(`/provider/reviews/${reviewId}/report`, { reason });
    return response;
};

// Rate Customer
export const rateCustomer = async (bookingId, rating) => {
    const response = await baseURL.post(`/provider/bookings/${bookingId}/rate-customer`, rating);
    return response;
};

// Get Calendar Events
export const getCalendarEvents = async (start, end) => {
    const response = await baseURL.get('/provider/calendar', {
        params: { start, end }
    });
    return response;
};

// Block Time Slot
export const blockTimeSlot = async (timeSlotData) => {
    const response = await baseURL.post('/provider/calendar/block', timeSlotData);
    return response;
};

// Remove Blocked Time
export const removeBlockedTime = async (id) => {
    const response = await baseURL.delete(`/provider/calendar/block/${id}`);
    return response;
};