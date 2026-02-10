import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, UserCircle, Calendar, Clock, MapPin, 
  Phone, Mail, CheckCircle, Info, Star, MessageCircle, MessageSquare
} from 'lucide-react';
import ProviderLayout from '../../layouts/ProviderLayout';
import { getProviderBookings, checkInBooking, completeBooking, rateCustomer } from '../../services/providerService';

const ProviderBookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [customerRating, setCustomerRating] = useState({
    punctuality: 5,
    attitude: 5,
    comment: ''
  });

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      const response = await getProviderBookings();
      if (response.status === 200) {
        // Tìm đơn hàng trong danh sách dựa trên ID từ URL
        const foundBooking = response.data?.find(b => b.id === parseInt(id));
        setBooking(foundBooking || generateMockBooking());
      }
    } catch (error) {
      console.error('Fetch booking error:', error);
      setBooking(generateMockBooking());
    } finally {
      setLoading(false);
    }
  };

  const generateMockBooking = () => ({
    id: 1,
    // Thêm ID và Avatar cho user
    user: { id: 101, fullName: 'Trương Đạt 1', email: '23082004dat@gmail.com', phone: '0865890399', avatar: 'https://ui-avatars.com/api/?name=Truong+Dat' },
    service: { name: 'Điều Trị Nám Tàn Nhang', price: 1200000 },
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    notes: ''
  });

  // --- LOGIC XỬ LÝ TRẠNG THÁI ---
  const handleCheckIn = async () => {
    try {
      const response = await checkInBooking(id);
      if (response.status === 200) {
        toast.success('Đã check-in thành công. Bắt đầu phục vụ khách!');
        fetchBookingDetail();
      }
    } catch (error) { toast.error('Có lỗi xảy ra khi check-in'); }
  };

  const handleComplete = async () => {
    try {
      const response = await completeBooking(id);
      if (response.status === 200) {
        toast.success('Đã hoàn tất dịch vụ!');
        setShowRatingModal(true); // Mở modal đánh giá khách sau khi xong
      }
    } catch (error) { toast.error('Có lỗi xảy ra khi hoàn tất'); }
  };

  const handleSubmitRating = async () => {
    try {
      const response = await rateCustomer(id, customerRating);
      if (response.status === 200) {
        toast.success('Đã đánh giá khách hàng');
        setShowRatingModal(false);
        navigate('/provider/bookings');
      }
    } catch (error) { toast.error('Lỗi khi gửi đánh giá'); }
  };

  // --- LOGIC CHAT ĐÃ SỬA ĐỔI ---
  const handleChat = () => {
    if (!booking?.user?.id) {
        toast.error("Không tìm thấy thông tin khách hàng");
        return;
    }
    // Chuyển hướng sang ProviderChatPage
    navigate('/provider/messages', { 
        state: { 
            partnerId: booking.user.id,
            partnerName: booking.user.fullName,
            partnerAvatar: booking.user.avatar
        } 
    });
  };

  // Cập nhật Badge theo chuẩn uppercase của Backend
  const getStatusBadge = (status) => {
    const config = {
      PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700' },
      CONFIRMED: { label: 'Đã duyệt', color: 'bg-blue-100 text-blue-700' },
      CHECKED_IN: { label: 'Đang phục vụ', color: 'bg-purple-100 text-purple-700' },
      COMPLETED: { label: 'Hoàn tất', color: 'bg-green-100 text-green-700' },
      CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
      REJECTED: { label: 'Đã từ chối', color: 'bg-red-100 text-red-700' }
    };
    const s = config[status] || config.PENDING;
    return <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${s.color}`}>{s.label}</span>;
  };

  if (loading) return (
    <ProviderLayout>
      <div className="flex items-center justify-center h-96">
        <div className="w-14 h-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </ProviderLayout>
  );

  return (
    <ProviderLayout>
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <button
              onClick={() => navigate('/provider/bookings')}
              className="flex items-center gap-2 text-gray-400 hover:text-purple-600 font-black text-sm uppercase transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
              Quay lại danh sách
            </button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
              Chi tiết Đơn hàng <span className="text-purple-600">#{booking.id}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {getStatusBadge(booking.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cột trái: Thông tin chính */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information Card */}
            <div className="bg-white rounded-[40px] border-4 border-gray-50 p-10 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-100 rounded-3xl">
                  <UserCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Thông tin Khách hàng</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Họ và tên</p>
                  <p className="text-2xl font-black text-gray-900">{booking.user?.fullName}</p>
                </div>
                
                {/* --- LIÊN HỆ --- */}
                <div className="space-y-3">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Liên hệ</p>
                  <div className="flex gap-3">
                    {booking.user?.phone ? (
                        <a 
                            href={`tel:${booking.user.phone}`}
                            className="flex-1 py-3 px-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-bold flex items-center justify-center gap-2 border border-green-200 shadow-sm"
                        >
                            <Phone className="w-5 h-5" /> Gọi điện
                        </a>
                    ) : (
                        <button disabled className="flex-1 py-3 px-4 bg-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                            <Phone className="w-5 h-5" /> Không SĐT
                        </button>
                    )}
                    
                    <button 
                        onClick={handleChat}
                        className="flex-1 py-3 px-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-bold flex items-center justify-center gap-2 border border-blue-200 shadow-sm"
                    >
                        <MessageCircle className="w-5 h-5" /> Nhắn tin
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details Card */}
            <div className="bg-white rounded-[40px] border-4 border-gray-50 p-10 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-pink-100 rounded-3xl">
                  <Info className="w-8 h-8 text-pink-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Dịch vụ & Lịch hẹn</h2>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center py-5 border-b-2 border-gray-50">
                  <span className="text-lg font-bold text-gray-500 uppercase">Tên dịch vụ</span>
                  <span className="text-xl font-black text-gray-900">{booking.service?.name}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b-2 border-gray-50">
                  <span className="text-lg font-bold text-gray-500 uppercase">Thời gian thực hiện</span>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900 flex items-center justify-end gap-3 uppercase">
                      <Calendar className="w-5 h-5 text-purple-600" /> 
                      {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm font-bold text-gray-400 mt-1 flex items-center justify-end gap-3 uppercase">
                      <Clock className="w-5 h-5 text-purple-400" /> 
                      Khung giờ: {new Date(booking.bookingDate || booking.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6">
                  <span className="text-xl font-black text-gray-500 uppercase">Tổng thanh toán</span>
                  <span className="text-4xl font-black text-purple-600">
                    {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(booking.service?.price || booking.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Ghi chú & Actions */}
          <div className="space-y-8">
            {/* Notes Section */}
            <div className={`rounded-[35px] p-8 border-4 border-dashed relative overflow-hidden ${booking.notes ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`font-black mb-4 flex items-center gap-3 uppercase text-sm tracking-widest relative z-10 ${booking.notes ? 'text-blue-900' : 'text-gray-500'}`}>
                <MessageSquare className="w-6 h-6" /> Ghi chú từ khách
              </h3>
              <p className={`font-bold italic leading-relaxed relative z-10 text-lg ${booking.notes ? 'text-blue-700' : 'text-gray-400 font-normal'}`}>
                {booking.notes ? `"${booking.notes}"` : "Khách không để lại yêu cầu đặc biệt nào."}
              </p>
              
              {/* Nút Chat nhanh dưới ghi chú */}
              <div className="relative z-10 mt-6 pt-6 border-t border-dashed border-gray-300">
                   <button 
                        onClick={handleChat}
                        className="w-full py-3 bg-white text-blue-600 border border-blue-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-sm"
                   >
                        <MessageCircle className="w-4 h-4" /> Chat với khách
                   </button>
              </div>

              <MessageSquare className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-20 ${booking.notes ? 'text-blue-200' : 'text-gray-200'}`} />
            </div>

            {/* Action Buttons - Logic trạng thái Uppercase */}
            <div className="space-y-4 pt-6">
              {booking.status === 'CONFIRMED' && (
                <button
                  onClick={handleCheckIn}
                  className="w-full py-6 bg-purple-600 text-white rounded-[30px] font-black text-xl shadow-2xl shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center gap-4 active:scale-95"
                >
                  <CheckCircle className="w-7 h-7" />
                  BẮT ĐẦU PHỤC VỤ
                </button>
              )}
              {booking.status === 'CHECKED_IN' && (
                <button
                  onClick={handleComplete}
                  className="w-full py-6 bg-green-600 text-white rounded-[30px] font-black text-xl shadow-2xl shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-4 active:scale-95"
                >
                  <CheckCircle className="w-7 h-7" />
                  HOÀN TẤT DỊCH VỤ
                </button>
              )}
              
              {/* Trạng thái đã xong */}
              {booking.status === 'COMPLETED' && (
                <div className="w-full py-6 bg-gray-100 text-gray-400 rounded-[30px] font-black text-xl flex items-center justify-center gap-4 cursor-not-allowed">
                  <CheckCircle className="w-7 h-7" />
                  DỊCH VỤ ĐÃ HOÀN TẤT
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[50px] max-w-md w-full p-12 shadow-2xl animate-in zoom-in-95 duration-300 border-8 border-purple-50">
              <div className="text-center space-y-4 mb-10">
                <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                   <Star className="w-12 h-12 text-yellow-500 fill-yellow-500 animate-bounce" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Đánh giá khách</h3>
                <p className="text-gray-500 font-bold italic">Giúp nâng cao cộng đồng BeautyX.</p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Độ đúng giờ: {customerRating.punctuality}/5</label>
                  <input type="range" min="1" max="5" value={customerRating.punctuality} 
                    onChange={(e) => setCustomerRating({ ...customerRating, punctuality: parseInt(e.target.value) })}
                    className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Thái độ khách: {customerRating.attitude}/5</label>
                  <input type="range" min="1" max="5" value={customerRating.attitude} 
                    onChange={(e) => setCustomerRating({ ...customerRating, attitude: parseInt(e.target.value) })}
                    className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                </div>

                <textarea
                  value={customerRating.comment}
                  onChange={(e) => setCustomerRating({ ...customerRating, comment: e.target.value })}
                  placeholder="Nhận xét của bạn về vị khách này..."
                  rows={3}
                  className="w-full px-6 py-5 bg-gray-50 border-4 border-gray-100 rounded-[25px] focus:border-purple-500 focus:outline-none transition-all resize-none font-bold"
                />

                <div className="flex flex-col gap-4">
                  <button onClick={handleSubmitRating} className="w-full py-5 bg-purple-600 text-white rounded-[24px] font-black shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all text-lg uppercase tracking-wider active:scale-95">Gửi đánh giá & Đóng</button>
                  <button onClick={() => { setShowRatingModal(false); navigate('/provider/bookings'); }} className="w-full py-4 text-gray-400 font-black hover:bg-gray-50 rounded-[24px] transition-all uppercase text-sm">Bỏ qua</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderBookingDetailPage;