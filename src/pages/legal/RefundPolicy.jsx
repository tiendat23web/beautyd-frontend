import React, { useEffect } from 'react';
import { AlertTriangle, Clock, Wallet, Check } from 'lucide-react';

const RefundPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-center mb-4">Chính Sách Hủy Lịch & Hoàn Tiền</h1>
      <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
        BeautyD bảo vệ quyền lợi tài chính của bạn tối đa trong các trường hợp thanh toán trực tuyến trả trước (Pre-paid).
      </p>

      <div className="space-y-8">
        {/* Điều kiện hoàn */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-purple-600 text-white p-4 font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" /> Quy định thời gian hủy lịch đối với Khách hàng
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-4 border-b">Thời điểm hủy</th>
                  <th className="p-4 border-b">Mức hoàn tiền</th>
                  <th className="p-4 border-b">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b font-medium">Hủy trước 24 giờ so với giờ hẹn</td>
                  <td className="p-4 border-b text-green-600 font-bold">Hoàn 100%</td>
                  <td className="p-4 border-b text-gray-500 text-sm">Tiền sẽ được cộng ngay vào Ví BeautyD hoặc hoàn về thẻ.</td>
                </tr>
                <tr>
                  <td className="p-4 border-b font-medium">Hủy trước 6 - 24 giờ</td>
                  <td className="p-4 border-b text-orange-600 font-bold">Hoàn 50%</td>
                  <td className="p-4 border-b text-gray-500 text-sm">Trừ phí tổn thất cho Spa vì đã giữ chỗ.</td>
                </tr>
                <tr>
                  <td className="p-4 border-b font-medium">Hủy sát giờ (Dưới 6 giờ) / Không đến</td>
                  <td className="p-4 border-b text-red-600 font-bold">Không hoàn tiền</td>
                  <td className="p-4 border-b text-gray-500 text-sm">Áp dụng chính sách No-show nghiêm ngặt.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Lỗi từ Spa */}
        <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 flex gap-4 items-start">
          <AlertTriangle className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2 text-pink-900">Trường hợp hủy do phía Spa/Salon hoặc sự cố hệ thống</h3>
            <p className="text-gray-700 leading-relaxed">
              Nếu Spa thông báo đóng cửa đột xuất, kỹ thuật viên vắng mặt, hoặc lỗi từ hệ thống BeautyD khiến bạn không thể sử dụng dịch vụ, bạn sẽ được <strong>hoàn tiền 100%</strong> bất kể thời gian, kèm theo một Mã giảm giá (Voucher) 20% như một lời xin lỗi từ chúng tôi.
            </p>
          </div>
        </div>

        {/* Phương thức hoàn */}
        <div>
          <h2 className="text-2xl font-bold mb-4 mt-12 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-purple-600" /> Phương thức & Thời gian nhận tiền
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex gap-3"><Check className="text-green-500 mt-1 flex-shrink-0" /> <strong>Hoàn vào Ví BeautyD:</strong> Nhận tiền ngay lập tức, dùng để đặt lịch lần sau.</li>
            <li className="flex gap-3"><Check className="text-green-500 mt-1 flex-shrink-0" /> <strong>Hoàn qua Momo/ZaloPay:</strong> Xử lý trong vòng 1-2 ngày làm việc.</li>
            <li className="flex gap-3"><Check className="text-green-500 mt-1 flex-shrink-0" /> <strong>Hoàn qua thẻ Ngân hàng/Visa:</strong> Theo quy định của ngân hàng, có thể mất từ 3-7 ngày làm việc để tiền hiển thị trong tài khoản của bạn.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;