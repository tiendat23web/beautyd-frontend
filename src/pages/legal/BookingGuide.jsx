import React, { useEffect } from 'react';
import { MapPin, Search, CalendarPlus, CheckCircle, Smartphone } from 'lucide-react';

const BookingGuide = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const steps = [
    {
      icon: <Search className="w-8 h-8 text-white" />,
      color: "bg-blue-500",
      title: "Bước 1: Tìm kiếm dịch vụ hoặc Spa",
      desc: "Sử dụng thanh tìm kiếm ở trang chủ. Bạn có thể gõ tên dịch vụ (ví dụ: 'Cắt tóc', 'Gội đầu dưỡng sinh', 'Nặn mụn') hoặc tên một Spa cụ thể mà bạn biết. Hệ thống sẽ lọc ra các kết quả tốt nhất."
    },
    {
      icon: <MapPin className="w-8 h-8 text-white" />,
      color: "bg-pink-500",
      title: "Bước 2: Chọn cơ sở gần bạn",
      desc: "Xem bản đồ hoặc danh sách kết quả, đọc các đánh giá từ khách hàng cũ, xem bảng giá và không gian Spa để chọn ra địa điểm ưng ý nhất."
    },
    {
      icon: <CalendarPlus className="w-8 h-8 text-white" />,
      color: "bg-purple-500",
      title: "Bước 3: Chọn ngày giờ và chuyên viên",
      desc: "Click vào nút 'Đặt lịch ngay'. Chọn dịch vụ muốn làm, ngày và khung giờ bạn rảnh. Bạn thậm chí có thể chọn đích danh kỹ thuật viên/stylist nếu muốn."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      color: "bg-green-500",
      title: "Bước 4: Xác nhận và Thanh toán",
      desc: "Kiểm tra lại thông tin, áp dụng mã giảm giá (nếu có). Bạn có thể chọn thanh toán trước qua VNPay/Momo để nhận thêm ưu đãi hoặc thanh toán trực tiếp tại Spa sau khi làm xong."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-black mb-4">Làm Đẹp Chỉ Với 4 Bước Đơn Giản</h1>
        <p className="text-gray-600 text-lg">Hệ thống BeautyD được thiết kế tối giản để ai cũng có thể sử dụng dễ dàng.</p>
      </div>

      <div className="relative border-l-4 border-gray-100 ml-6 md:ml-12 space-y-12">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-10 md:pl-16">
            <div className={`absolute -left-6 md:-left-8 top-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${step.color}`}>
              {step.icon}
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingGuide;
