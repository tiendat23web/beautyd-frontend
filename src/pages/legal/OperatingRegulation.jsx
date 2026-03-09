import React, { useEffect } from 'react';
import { Scale, Users, Store, ArrowRightLeft } from 'lucide-react';

const OperatingRegulation = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Quy Chế Hoạt Động Của Sàn</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Văn bản quy định nguyên tắc giao dịch, quyền lợi và nghĩa vụ của các bên tham gia trên nền tảng cung cấp dịch vụ đặt lịch BeautyD.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Quyền lợi Khách hàng */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold">Thành viên (Khách hàng)</h2>
          </div>
          <ul className="space-y-4 text-gray-600">
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              Được tự do tìm kiếm, tham khảo giá cả và đặt lịch các dịch vụ làm đẹp trên toàn quốc.
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              Được quyền khiếu nại lên ban quản trị nếu chất lượng dịch vụ của Provider không đúng như cam kết.
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              Có nghĩa vụ thanh toán đầy đủ phí dịch vụ (trực tuyến hoặc tại quầy) sau khi hoàn tất trải nghiệm.
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              Phải đánh giá (review) trung thực, khách quan, không dùng lời lẽ xúc phạm.
            </li>
          </ul>
        </div>

        {/* Quyền lợi Đối tác */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-8 h-8 text-pink-600" />
            <h2 className="text-2xl font-bold">Đối tác (Provider)</h2>
          </div>
          <ul className="space-y-4 text-gray-600">
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              Được cấp tài khoản quản trị để tự đăng tải dịch vụ, giá cả, hình ảnh không gian và quản lý nhân viên.
            </li>
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              Cam kết cung cấp dịch vụ đúng chất lượng, đúng giá đã niêm yết trên ứng dụng BeautyD.
            </li>
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              Phải cập nhật lịch trống liên tục để tránh tình trạng khách đặt nhưng không có nhân viên phục vụ.
            </li>
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              Chịu trách nhiệm hoàn toàn trước pháp luật về giấy phép kinh doanh và chứng chỉ hành nghề.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-purple-50 p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <ArrowRightLeft className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold">Quy trình giải quyết tranh chấp</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Khi phát sinh tranh chấp giữa Khách hàng và Đối tác, BeautyD sẽ đóng vai trò trung gian hòa giải. Chúng tôi sẽ tiếp nhận khiếu nại qua Hotline, thu thập chứng cứ (hình ảnh, tin nhắn, hóa đơn) từ cả 2 phía trong vòng 24h. Quyết định của Ban quản trị BeautyD dựa trên Điều khoản sử dụng sẽ là quyết định cuối cùng. Trong trường hợp Đối tác vi phạm nghiêm trọng (lừa đảo, dịch vụ kém an toàn), BeautyD có quyền gỡ bỏ gian hàng vĩnh viễn và bồi thường cho Khách hàng.
        </p>
      </div>
    </div>
  );
};

export default OperatingRegulation;