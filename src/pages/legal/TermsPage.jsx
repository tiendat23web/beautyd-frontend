import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';

const TermsPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const terms = [
    {
      title: "Điều 1: Chấp thuận điều khoản dịch vụ",
      content: "Khi truy cập và sử dụng nền tảng BeautyD (bao gồm website và ứng dụng di động), người dùng mặc nhiên đồng ý với tất cả các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ. BeautyD có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản này vào bất cứ lúc nào và có hiệu lực ngay khi đăng tải."
    },
    {
      title: "Điều 2: Đăng ký và Bảo mật tài khoản",
      content: "Người dùng phải cung cấp thông tin chính xác (Họ tên, Số điện thoại, Email) khi đăng ký tài khoản. Bạn hoàn toàn chịu trách nhiệm bảo mật mật khẩu và thiết bị của mình. Mọi hoạt động đặt lịch, thanh toán diễn ra dưới tài khoản của bạn sẽ được coi là do chính bạn thực hiện. Nếu phát hiện truy cập trái phép, bạn cần thông báo ngay cho đội ngũ hỗ trợ của BeautyD qua Hotline."
    },
    {
      title: "Điều 3: Quy định về đặt lịch và hủy lịch",
      content: "Người dùng có quyền đặt trước dịch vụ tại các cơ sở trên hệ thống. Tuy nhiên, để đảm bảo quyền lợi cho các Đối tác (Spa/Salon), việc hủy lịch phải được thực hiện tối thiểu trước 2 giờ so với giờ hẹn. Nếu người dùng hủy lịch quá sát giờ hoặc không đến (No-show) quá 3 lần, tài khoản có thể bị khóa tính năng thanh toán sau hoặc bị đình chỉ vĩnh viễn."
    },
    {
      title: "Điều 4: Quy định về thanh toán trực tuyến",
      content: "BeautyD tích hợp các cổng thanh toán an toàn (VNPay, Momo, Thẻ tín dụng). Khi sử dụng thanh toán trực tuyến, người dùng cần đảm bảo tài khoản có đủ số dư và đường truyền mạng ổn định. BeautyD không chịu trách nhiệm cho các lỗi giao dịch phát sinh từ phía ngân hàng hoặc tổ chức phát hành thẻ của người dùng."
    },
    {
      title: "Điều 5: Quyền sở hữu trí tuệ",
      content: "Toàn bộ nội dung, hình ảnh, thiết kế, logo và mã nguồn trên nền tảng BeautyD đều thuộc bản quyền của chúng tôi. Nghiêm cấm mọi hành vi sao chép, sử dụng, hoặc phân phối lại các tài sản trí tuệ này dưới bất kỳ hình thức nào khi chưa có sự đồng ý bằng văn bản từ Ban Giám đốc BeautyD."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-10 border-b pb-6">
        <FileText className="w-10 h-10 text-purple-600" />
        <div>
          <h1 className="text-3xl font-black text-gray-900">Điều Khoản Sử Dụng</h1>
          <p className="text-gray-500 mt-2">Cập nhật lần cuối: 01/10/2026</p>
        </div>
      </div>

      <div className="space-y-10">
        {terms.map((term, index) => (
          <div key={index}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{term.title}</h2>
            <p className="text-gray-600 leading-relaxed text-justify">{term.content}</p>
          </div>
        ))}
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-12">
          <p className="text-sm text-gray-600 italic">
            Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ này, vui lòng liên hệ với bộ phận Pháp chế của chúng tôi qua email: legal@beautyd.vn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;