import React, { useEffect } from 'react';
import { ShieldCheck, Database, EyeOff, LockKeyhole } from 'lucide-react';

const PrivacyPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-10 rounded-3xl mb-16 shadow-xl relative overflow-hidden">
        <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10" />
        <h1 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Chính Sách Bảo Mật</h1>
        <p className="opacity-90 max-w-2xl relative z-10 text-lg">
          Tại BeautyD, chúng tôi hiểu rằng dữ liệu cá nhân là tài sản quý giá của bạn. Chúng tôi cam kết bảo vệ tuyệt đối thông tin này theo các tiêu chuẩn an ninh mạng quốc tế.
        </p>
      </div>

      <div className="space-y-12 text-gray-700">
        <div className="flex flex-col md:flex-row gap-6">
          <Database className="w-12 h-12 text-purple-600 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Thông tin chúng tôi thu thập</h2>
            <p className="mb-3 leading-relaxed">Chúng tôi chỉ thu thập những thông tin cần thiết để cung cấp dịch vụ tốt nhất cho bạn, bao gồm:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Thông tin nhận dạng:</strong> Họ tên, số điện thoại, địa chỉ email, ảnh đại diện, ngày sinh.</li>
              <li><strong>Dữ liệu giao dịch:</strong> Lịch sử đặt chỗ, dịch vụ đã sử dụng, thông tin thẻ thanh toán (được mã hóa bởi cổng thanh toán thứ 3).</li>
              <li><strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại thiết bị, hệ điều hành, dữ liệu vị trí GPS (nếu bạn cấp quyền) để gợi ý Spa gần nhất.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <LockKeyhole className="w-12 h-12 text-pink-500 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Mục đích sử dụng dữ liệu</h2>
            <p className="mb-3 leading-relaxed">Dữ liệu của bạn được sử dụng nghiêm ngặt cho các mục đích:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Xử lý, xác nhận và quản lý các đơn đặt lịch của bạn với cơ sở làm đẹp.</li>
              <li>Cá nhân hóa trải nghiệm người dùng, đề xuất các khuyến mãi và dịch vụ phù hợp.</li>
              <li>Giải quyết khiếu nại, hỗ trợ khách hàng và cải thiện chất lượng ứng dụng.</li>
              <li>Phát hiện và ngăn chặn các hành vi gian lận, phá hoại tài khoản.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <EyeOff className="w-12 h-12 text-blue-500 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Cam kết không chia sẻ dữ liệu</h2>
            <p className="leading-relaxed text-gray-600">
              BeautyD cam kết <strong>KHÔNG</strong> bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo thương mại. Dữ liệu của bạn chỉ được chia sẻ một phần (Tên và Số điện thoại) cho chính Spa/Salon mà bạn đã đặt lịch để họ thực hiện việc đón tiếp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;