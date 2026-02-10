import { useEffect, useRef } from 'react';
import { baseURL } from '../services/baseAPI';

const OnlineStatusManager = () => {
  const lastPingTime = useRef(0);
  // Tăng thời gian chờ lên 60s để giảm tải cho server
  const PING_INTERVAL = 60000; 

  useEffect(() => {
    const handleActivity = async () => {
      const now = Date.now();
      
      // Chỉ gửi request nếu đã qua 60s kể từ lần cuối
      if (now - lastPingTime.current > PING_INTERVAL) {
        lastPingTime.current = now;
        
        try {
          const token = localStorage.getItem('token');
          if (token) {
             // --- SỬA LỖI 404 TẠI ĐÂY ---
             // Đổi từ '/user/ping' thành '/users/ping' (số nhiều) để khớp với router backend
             await baseURL.post('/users/ping'); 
          }
        } catch (error) {
          // Lỗi ngầm định thì bỏ qua, không log ra console để tránh rối mắt
        }
      }
    };

    // Bắt các sự kiện lướt web: Di chuột, Click, Gõ phím, Cuộn trang, Chạm (mobile)
    const events = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => window.addEventListener(event, handleActivity));

    // Gửi ngay 1 lần khi vừa tải trang
    handleActivity();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, []);

  return null; // Component này chạy ngầm, không hiển thị gì cả
};

export default OnlineStatusManager;