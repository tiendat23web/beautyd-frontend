import React, { useEffect } from 'react';
import { Search, Mail, PhoneCall, MessageCircle, CalendarClock, CreditCard, UserCog } from 'lucide-react';

const HelpCenter = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const topics = [
    { icon: <CalendarClock className="w-8 h-8 mb-4 text-purple-600" />, title: "Vấn đề Đặt lịch", desc: "Hướng dẫn đặt, đổi lịch, hủy lịch hẹn" },
    { icon: <CreditCard className="w-8 h-8 mb-4 text-pink-600" />, title: "Thanh toán & Hoàn tiền", desc: "Lỗi giao dịch, cách dùng voucher, hoàn tiền" },
    { icon: <UserCog className="w-8 h-8 mb-4 text-blue-600" />, title: "Tài khoản của tôi", desc: "Quên mật khẩu, đổi số điện thoại, bảo mật" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header Search */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-50 rounded-3xl p-12 text-center mb-16">
        <h1 className="text-4xl font-black mb-6 text-gray-900">Chúng tôi có thể giúp gì cho bạn?</h1>
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Nhập từ khóa tìm kiếm (VD: cách hủy lịch, quên mật khẩu...)" 
            className="w-full px-8 py-5 rounded-full border-0 focus:ring-4 focus:ring-purple-200 outline-none shadow-xl text-lg"
          />
          <button className="absolute right-3 top-3 bg-purple-600 text-white p-2.5 rounded-full hover:bg-purple-700 transition-colors">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Topics */}
      <h2 className="text-2xl font-bold mb-8 text-center">Các chủ đề phổ biến</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {topics.map((topic, idx) => (
          <div key={idx} className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer text-center group">
            <div className="flex justify-center transform group-hover:-translate-y-2 transition-transform">
              {topic.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{topic.title}</h3>
            <p className="text-sm text-gray-500">{topic.desc}</p>
          </div>
        ))}
      </div>

      {/* Contact Options */}
      <div className="bg-gray-900 text-white rounded-3xl p-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">Bạn không tìm thấy câu trả lời?</h2>
          <p className="text-gray-400">Đội ngũ CSKH của BeautyD luôn sẵn sàng hỗ trợ bạn 24/7 qua các kênh dưới đây.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-gray-800 p-6 rounded-xl">
            <PhoneCall className="w-10 h-10 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Gọi Hotline (Miễn phí)</p>
              <p className="text-xl font-bold">1900 6483</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-800 p-6 rounded-xl">
            <MessageCircle className="w-10 h-10 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Chat với Support</p>
              <p className="text-xl font-bold">Zalo / Facebook Messenger</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-800 p-6 rounded-xl">
            <Mail className="w-10 h-10 text-pink-400" />
            <div>
              <p className="text-sm text-gray-400">Gửi Email hỗ trợ</p>
              <p className="text-xl font-bold">support@beautyd.vn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;