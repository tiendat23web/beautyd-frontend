import React, { useEffect, useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';

const FAQPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  // Quản lý state đóng mở câu hỏi
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: "Tài khoản & Đăng nhập",
      questions: [
        { q: "Tôi có cần tạo tài khoản để xem dịch vụ không?", a: "Bạn không cần tạo tài khoản để tìm kiếm và xem các Spa/dịch vụ. Tuy nhiên, để thực hiện chức năng Đặt lịch, Lưu mã giảm giá hoặc Viết đánh giá, bạn bắt buộc phải đăng nhập." },
        { q: "Tôi quên mật khẩu thì phải làm sao?", a: "Hãy bấm vào 'Quên mật khẩu' ở trang Đăng nhập. Nhập email hoặc số điện thoại đã đăng ký, hệ thống sẽ gửi mã OTP để bạn thiết lập lại mật khẩu mới trong 1 phút." }
      ]
    },
    {
      category: "Quá trình Đặt lịch",
      questions: [
        { q: "Làm sao để tôi biết lịch đã đặt thành công?", a: "Sau khi hoàn tất quy trình đặt lịch, trạng thái đơn của bạn sẽ chuyển sang 'Chờ xác nhận'. Khi Spa tiếp nhận, trạng thái sẽ là 'Đã xác nhận' (Màu xanh), đồng thời hệ thống gửi thông báo đẩy (push notification) trên App và gửi Email cho bạn." },
        { q: "Tôi có thể đặt lịch cho bạn bè/người thân không?", a: "Hoàn toàn được. Ở bước Điền thông tin đặt chỗ, bạn hãy chọn mục 'Đặt cho người khác' và nhập Tên + Số điện thoại của người sẽ sử dụng dịch vụ để Spa liên hệ đón tiếp." },
        { q: "Giá trên BeautyD có cao hơn giá tới trực tiếp Spa không?", a: "Chúng tôi cam kết giá niêm yết trên BeautyD bằng hoặc RẺ HƠN giá tại cửa hàng. BeautyD luôn đàm phán với đối tác để cung cấp các gói ưu đãi độc quyền chỉ có trên nền tảng." }
      ]
    },
    {
      category: "Đánh giá & Phản hồi",
      questions: [
        { q: "Ai có quyền viết đánh giá (Review)?", a: "Để đảm bảo tính minh bạch 100%, chỉ những khách hàng đã Đặt lịch thành công qua ứng dụng và hoàn thành dịch vụ (Trạng thái đơn: Đã hoàn thành) mới được quyền viết đánh giá cho cơ sở đó." }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <MessageSquare className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-black mb-4">Câu Hỏi Thường Gặp (FAQ)</h1>
        <p className="text-gray-500">Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến nhất.</p>
      </div>

      <div className="space-y-8">
        {faqs.map((group, gIndex) => (
          <div key={gIndex} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">{group.category}</h2>
            <div className="space-y-3">
              {group.questions.map((item, qIndex) => {
                const index = `${gIndex}-${qIndex}`;
                const isOpen = openIndex === index;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all shadow-sm">
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-800 hover:bg-purple-50 focus:outline-none"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-purple-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 text-gray-600 leading-relaxed bg-purple-50/50 border-t border-purple-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;