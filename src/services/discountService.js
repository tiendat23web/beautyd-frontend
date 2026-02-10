// SỬA: Import từ baseAPI thay vì axiosConfig
import { baseURL } from "./baseAPI"; 

const discountService = {
  // 1. Lấy danh sách mã của tôi
  getMyCoupons: async () => {
    // baseURL đã bao gồm '/api' (dựa theo servicesService gọi '/services')
    // Nên ở đây chỉ cần gọi '/discounts/...' thay vì '/api/discounts/...'
    const response = await baseURL.get('/discounts/my-coupons');
    return response.data;
  },

  // 2. Kiểm tra mã khi đặt lịch
  validateCoupon: async (code, serviceId, totalAmount) => {
    const response = await baseURL.post('/discounts/validate', {
      code,
      serviceId,
      totalAmount
    });
    return response.data;
  },

  // 3. Provider tạo mã mới
  createCoupon: async (data) => {
    const response = await baseURL.post('/discounts/provider', data);
    return response.data;
  }
};

export default discountService;