import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Store,
  User,
  MessageCircle,
  RefreshCcw
} from "lucide-react";
import { toast } from "react-toastify";
import { getBookingById } from "../services/bookingService"; 
import { getUserById } from "../services/userService"; 

import Header from "../components/Header";
import Footer from "../components/Footer";

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [providerInfo, setProviderInfo] = useState(null); 
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState(null);

  // 1. Lấy thông tin Booking
  useEffect(() => {
    const fetchBooking = async () => {
      if (!booking && id) {
        try {
          setLoading(true);
          const data = await getBookingById(id);
          setBooking(data);
        } catch (err) {
          console.error("Lỗi tải booking:", err);
          setError("Không thể tải thông tin booking");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBooking();
  }, [id, booking]);

  // 2. Lấy thông tin Chủ Shop (Provider)
  useEffect(() => {
    const fetchProviderDetails = async () => {
      if (booking && booking.providerId && !providerInfo) {
        
        // Nếu API booking đã trả sẵn provider (Backend đã include) -> Dùng luôn
        if (booking.provider) {
             setProviderInfo(booking.provider);
             return;
        }

        try {
          // Gọi API user service
          const userProvider = await getUserById(booking.providerId);
          console.log("✅ Thông tin chủ shop:", userProvider); 
          
          const finalData = userProvider.data || userProvider; 
          setProviderInfo(finalData);
        } catch (err) {
          console.warn("⚠️ Không lấy được thông tin chủ shop:", err);
        }
      } 
    };

    fetchProviderDetails();
  }, [booking, providerInfo]);

  // --- XỬ LÝ NÚT BẤM ---

  // Xử lý Chat - Điều hướng tới /messages
  const handleChat = () => {
    const partnerId = booking.providerId || providerInfo?.id;
    const providerName = providerInfo?.businessName || providerInfo?.fullName || "Nhà cung cấp";
    
    if (!partnerId) {
        toast.error("Chưa có thông tin liên hệ");
        return;
    }

    // Điều hướng sang trang Messages với state
    navigate(`/messages`, {
        state: {
            selectedUserId: partnerId,
            selectedUserName: providerName,
            selectedUserAvatar: providerInfo?.avatar
        }
    });
  };

  // Xử lý Đặt lại - Điều hướng tới /service/:id
  const handleReBook = () => {
    const targetServiceId = booking.serviceId || booking.service?.id;
    
    if (!targetServiceId) {
        toast.error("Dịch vụ này không còn tồn tại");
        return;
    }
    // Điều hướng về trang chi tiết dịch vụ
    navigate(`/service/${targetServiceId}`);
  };

  // --- FORMAT DỮ LIỆU ---
  const formatPrice = (price) => {
    if (!price && price !== 0) return "---";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const formatDateOnly = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
    } catch { return dateString || "---"; }
  };

  const extractTime = (bookingData) => {
    if (bookingData?.startTime) return bookingData.startTime;
    if (bookingData?.bookingDate) {
      try {
        return new Date(bookingData.bookingDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      } catch { return "--:--"; }
    }
    return "--:--";
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      PENDING: { icon: <AlertCircle />, label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      CONFIRMED: { icon: <CheckCircle />, label: "Đã xác nhận", className: "bg-blue-100 text-blue-700 border-blue-300" },
      CHECKED_IN: { icon: <CheckCircle />, label: "Đã check-in", className: "bg-purple-100 text-purple-700 border-purple-300" },
      COMPLETED: { icon: <CheckCircle />, label: "Hoàn thành", className: "bg-green-100 text-green-700 border-green-300" },
      CANCELLED: { icon: <XCircle />, label: "Đã hủy", className: "bg-red-100 text-red-700 border-red-300" },
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600 w-10 h-10" /></div>;
  if (error || !booking) return <div className="text-center py-10">Lỗi tải dữ liệu</div>;

  const statusInfo = getStatusInfo(booking.status);
  
  // --- HIỂN THỊ THÔNG TIN DỰA TRÊN SCHEMA.PRISMA ---
  
  const finalProviderName = providerInfo?.businessName || providerInfo?.fullName || "Nhà cung cấp";
  const finalProviderAddress = providerInfo?.businessAddress || "Chưa cập nhật địa chỉ";
  const finalProviderPhone = providerInfo?.businessPhone || providerInfo?.phone || "";
  const finalProviderAvatar = providerInfo?.avatar; // Lấy avatar thật

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Banner Trạng Thái */}
        <div className={`rounded-lg border-2 p-6 mb-6 ${statusInfo.className}`}>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6">{statusInfo.icon}</div>
            <div>
              <h2 className="text-xl font-semibold mb-1">{statusInfo.label}</h2>
              <p className="text-sm opacity-90">Mã đặt chỗ: #{booking.id}</p>
            </div>
          </div>
        </div>

        {/* Card Chính */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{booking.service?.name || "Dịch vụ Spa"}</h1>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-wider opacity-90">Tổng tiền</p>
                <p className="text-xl font-bold">{formatPrice(booking.totalPrice)}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            
            {/* THÔNG TIN NHÀ CUNG CẤP & CHAT */}
            <div className="mb-8 pb-8 border-b">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-600" />
                Thông tin nhà cung cấp
              </h3>
              
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  
                  {/* Thông tin bên trái - Hiển thị Avatar thật */}
                  <div className="flex items-start gap-4 flex-1">
                    {finalProviderAvatar ? (
                      <img 
                        src={finalProviderAvatar} 
                        alt={finalProviderName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-purple-100"
                        onError={(e) => {
                          // Fallback nếu ảnh lỗi
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 font-bold text-xl uppercase"
                      style={{ display: finalProviderAvatar ? 'none' : 'flex' }}
                    >
                      {finalProviderName.charAt(0)}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-gray-900">
                        {finalProviderName}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{finalProviderAddress}</span>
                      </div>

                      {finalProviderPhone && (
                         <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{finalProviderPhone}</span>
                         </div>
                      )}
                    </div>
                  </div>

                  {/* Nút Chat bên phải */}
                  <button 
                    onClick={handleChat}
                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat ngay
                  </button>

                </div>
              </div>
            </div>

            {/* Chi tiết đặt chỗ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Cột trái: Thời gian */}
              <div className="space-y-4">
                 <h3 className="font-semibold text-gray-800">Thời gian & Dịch vụ</h3>
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="text-purple-600 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500">Ngày đặt</p>
                      <p className="font-medium text-gray-900">{formatDateOnly(booking.bookingDate)}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="text-purple-600 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500">Giờ bắt đầu</p>
                      <p className="font-medium text-gray-900">{extractTime(booking)}</p>
                    </div>
                 </div>
                 {booking.service?.duration && (
                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="text-purple-600 w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Thời lượng</p>
                        <p className="font-medium text-gray-900">{booking.service.duration} phút</p>
                      </div>
                   </div>
                 )}
                 {/* ✅ Hiển thị số lượng */}
                 <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <User className="text-purple-600 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500">Số lượng</p>
                      <p className="font-bold text-purple-700 text-lg">{booking.quantity || 1} người</p>
                    </div>
                 </div>
              </div>

              {/* Cột phải: Khách hàng (Đã ẩn thông tin) */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Thông tin khách hàng</h3>
                {booking.user ? (
                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-gray-900">{booking.user.fullName}</span>
                      </div>
                      <p className="text-xs text-blue-500 ml-6 italic flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Thông tin liên hệ đã được bảo mật
                      </p>
                   </div>
                ) : (
                  <p className="text-gray-500 italic">Không có thông tin khách hàng</p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 pt-4 border-t items-center">
              <button 
                onClick={() => navigate("/bookings")} 
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
              >
                Quay lại danh sách
              </button>
              
              <button 
                onClick={handleReBook}
                className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Đặt lại dịch vụ này
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDetailsPage;