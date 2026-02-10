import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  ClipboardList, CheckCircle, XCircle, Play, 
  CheckCheck, Clock, Calendar as CalendarIcon, Phone, MessageSquare, MessageCircle, RefreshCw 
} from "lucide-react";
import ProviderLayout from "../../layouts/ProviderLayout";
import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
} from "../../services/providerService";

const ProviderBookingsPage = () => {
  const navigate = useNavigate();
  // Quản lý Tab hiện tại
  const [activeTab, setActiveTab] = useState("pending");
  const [bookings, setBookings] = useState({
    pending: [],
    approved: [],
    in_service: [],
    completed: [],
    cancelled: [],
  });
  const [rejectModal, setRejectModal] = useState({ open: false, booking: null });
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Ref để lưu interval ID giúp dọn dẹp khi unmount
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    // 1. Gọi dữ liệu ngay lập tức khi vào trang
    fetchBookings(true);

    // 2. Thiết lập tự động cập nhật mỗi 5 giây (Polling)
    pollingIntervalRef.current = setInterval(() => {
      fetchBookings(false); // false nghĩa là không hiện loading spinner lại
    }, 5000);

    // 3. Dọn dẹp interval khi rời khỏi trang để tránh lỗi bộ nhớ
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Sửa hàm fetchBookings để nhận tham số showLoading
  const fetchBookings = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getProviderBookings();
      if (response.status === 200) {
        const data = response.data || generateMockBookings();
        organizeBookings(data);
      } else {
        organizeBookings(generateMockBookings());
      }
    } catch (error) {
      console.error("Fetch bookings error:", error);
      // Giữ dữ liệu cũ nếu lỗi mạng khi polling, không reset về mock để tránh giật giao diện
      if (showLoading) organizeBookings(generateMockBookings()); 
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const organizeBookings = (data) => {
    const organized = {
      pending: data.filter((b) => b.status === "PENDING"),
      approved: data.filter((b) => b.status === "CONFIRMED"),
      in_service: data.filter((b) => b.status === "CHECKED_IN"),
      completed: data.filter((b) => b.status === "COMPLETED"),
      cancelled: data.filter((b) => b.status === "REJECTED" || b.status === "CANCELLED"),
    };
    // Chỉ cập nhật state nếu dữ liệu thực sự thay đổi (React sẽ tự lo việc diffing DOM)
    setBookings(organized);
  };

  const generateMockBookings = () => [
    {
      id: 1,
      // Thêm ID cho user để chat hoạt động
      user: { id: 101, fullName: "Nguyễn Văn A", email: "a@example.com", phone: "0865890399", avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A" },
      service: { name: "Cắt tóc nam", duration: 30 },
      bookingDate: new Date().toISOString(),
      status: "PENDING",
      totalPrice: 150000,
      notes: "Cắt gọn gàng nhé"
    },
    {
      id: 2,
      user: { id: 102, fullName: "Trần Thị B", email: "b@example.com", phone: "0987654321", avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B" },
      service: { name: "Gội đầu dưỡng sinh", duration: 60 },
      bookingDate: new Date().toISOString(),
      status: "PENDING",
      totalPrice: 200000,
      notes: "" // Không có note
    },
  ];

  const handleAccept = async (booking) => {
    try {
      const response = await acceptBooking(booking.id);
      if (response.status === 200) {
        toast.success("Đã nhận đơn hàng");
        fetchBookings(false); // Refresh ngay lập tức
      }
    } catch (error) { toast.error("Có lỗi xảy ra"); }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) return toast.error("Vui lòng nhập lý do");
    try {
      const response = await rejectBooking(rejectModal.booking.id, rejectReason);
      if (response.status === 200) {
        toast.success("Đã từ chối đơn hàng");
        fetchBookings(false);
        setRejectModal({ open: false, booking: null });
        setRejectReason("");
      }
    } catch (error) { toast.error("Có lỗi xảy ra"); }
  };

  const handleStartService = async (booking) => {
    try {
      const response = await updateBookingStatus(booking.id, "CHECKED_IN");
      if (response.status === 200) {
        toast.success("Đã bắt đầu phục vụ");
        fetchBookings(false);
      }
    } catch (error) { toast.error("Có lỗi xảy ra"); }
  };

  const handleCompleteService = async (booking) => {
    try {
      const response = await updateBookingStatus(booking.id, "COMPLETED");
      if (response.status === 200) {
        toast.success("Đã hoàn tất dịch vụ");
        fetchBookings(false);
      }
    } catch (error) { toast.error("Có lỗi xảy ra"); }
  };

  // --- LOGIC CHAT ĐÃ SỬA ĐỔI (QUAN TRỌNG: THÊM partnerPhone) ---
  const handleChat = (e, booking) => {
    e.stopPropagation();
    
    if (!booking?.user?.id) {
        toast.error("Không tìm thấy thông tin khách hàng");
        return;
    }

    // Điều hướng sang trang ProviderChatPage (/provider/messages)
    navigate('/provider/messages', { 
        state: { 
            partnerId: booking.user.id,
            partnerName: booking.user.fullName,
            partnerAvatar: booking.user.avatar,
            partnerPhone: booking.user.phone // <--- ĐÃ THÊM DÒNG NÀY
        } 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
    });
  };

  // Cấu hình hiển thị cho các Tabs
  const tabConfig = [
    { id: "pending", label: "Chờ duyệt", color: "bg-yellow-500", count: bookings.pending.length },
    { id: "approved", label: "Đã duyệt", color: "bg-blue-500", count: bookings.approved.length },
    { id: "in_service", label: "Đang phục vụ", color: "bg-purple-500", count: bookings.in_service.length },
    { id: "completed", label: "Hoàn tất", color: "bg-green-500", count: bookings.completed.length },
    { id: "cancelled", label: "Đã hủy", color: "bg-red-500", count: bookings.cancelled.length },
  ];

  if (loading) return (
    <ProviderLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </ProviderLayout>
  );

  return (
    <ProviderLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn Đặt Dịch Vụ</h1>
                {/* Chỉ báo đang cập nhật real-time */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Live Update
                </div>
            </div>
            <p className="text-gray-600 mt-1">Quản lý và cập nhật trạng thái đơn hàng (Tự động làm mới)</p>
          </div>
          <ClipboardList className="w-10 h-10 text-purple-600" />
        </div>

        {/* Thanh Tabs */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto no-scrollbar">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-4 px-2 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                activeTab === tab.id 
                ? `${tab.color} text-white shadow-lg scale-[1.02]` 
                : "text-gray-500 hover:bg-gray-50 hover:text-purple-600"
              }`}
            >
              <span className="text-sm font-black whitespace-nowrap uppercase tracking-wider">{tab.label}</span>
              <span className={`text-xs mt-1.5 px-3 py-0.5 rounded-full font-bold ${activeTab === tab.id ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                {tab.count} đơn
              </span>
            </button>
          ))}
        </div>

        {/* Danh sách đơn hàng theo Tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {bookings[activeTab].length > 0 ? (
            bookings[activeTab].map((booking) => (
              <div
                key={booking.id}
                onClick={() => navigate(`/provider/booking/${booking.id}`)}
                className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:shadow-2xl hover:border-purple-200 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col h-full"
              >
                {/* Info Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-50 rounded-full flex items-center justify-center text-purple-600 font-black text-xl shadow-inner shrink-0 overflow-hidden">
                       {booking.user?.avatar ? (
                          <img src={booking.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                       ) : (
                          booking.user?.fullName?.charAt(0)
                       )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors line-clamp-1">
                        {booking.user?.fullName || "Khách hàng"}
                      </h4>
                      <p className="text-sm text-gray-500 font-medium line-clamp-1">{booking.service?.name}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-purple-600">
                      {booking.totalPrice?.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>

                {/* Details Date/Time */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <CalendarIcon className="w-4 h-4 text-purple-400" />
                    {formatDate(booking.bookingDate)}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-400" />
                    {booking.service?.duration} phút
                  </div>
                </div>

                {/* --- PHẦN LIÊN HỆ: GỌI & CHAT --- */}
                <div className="flex gap-3 mb-4">
                    {/* Nút Gọi */}
                    {booking.user?.phone ? (
                        <a 
                            href={`tel:${booking.user.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-bold flex items-center justify-center gap-2 text-sm border border-green-100"
                        >
                            <Phone className="w-4 h-4" /> Gọi điện
                        </a>
                    ) : (
                        <button disabled className="flex-1 py-2 bg-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                            <Phone className="w-4 h-4" /> Không SĐT
                        </button>
                    )}
                    
                    {/* Nút Chat - Đã gán hàm handleChat */}
                    <button 
                        onClick={(e) => handleChat(e, booking)}
                        className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-bold flex items-center justify-center gap-2 text-sm border border-blue-100"
                    >
                        <MessageCircle className="w-4 h-4" /> Chat
                    </button>
                </div>

                {/* --- PHẦN GHI CHÚ CỐ ĐỊNH CHIỀU CAO --- */}
                <div className="mb-5 h-[72px]">
                    <div className={`w-full h-full p-3 rounded-xl border flex gap-2 overflow-hidden ${booking.notes ? 'bg-purple-50/50 border-purple-100' : 'bg-gray-50 border-gray-100 border-dashed'}`}>
                        <MessageSquare className={`w-4 h-4 shrink-0 mt-0.5 ${booking.notes ? 'text-purple-400' : 'text-gray-300'}`} />
                        <p className={`text-sm italic leading-relaxed line-clamp-2 ${booking.notes ? 'text-gray-600' : 'text-gray-400 font-normal select-none'}`}>
                            {booking.notes ? `"${booking.notes}"` : "Không có ghi chú từ khách hàng"}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  {activeTab === "pending" && (
                    <div className="flex gap-3">
                      <button onClick={() => handleAccept(booking)} className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Nhận đơn
                      </button>
                      <button onClick={() => setRejectModal({open: true, booking})} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold flex items-center justify-center">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {activeTab === "approved" && (
                    <button onClick={() => handleStartService(booking)} className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 font-bold flex items-center justify-center gap-2">
                      <Play className="w-5 h-5" /> Bắt đầu phục vụ
                    </button>
                  )}
                  {activeTab === "in_service" && (
                    <button onClick={() => handleCompleteService(booking)} className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-100 font-bold flex items-center justify-center gap-2">
                      <CheckCheck className="w-5 h-5" /> Hoàn tất dịch vụ
                    </button>
                  )}
                  {activeTab === "completed" && (
                    <div className="w-full py-3 bg-green-50 text-green-700 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Hoàn thành xuất sắc
                    </div>
                  )}
                  {activeTab === "cancelled" && (
                    <div className="w-full py-3 bg-red-50 text-red-700 rounded-xl p-3 text-center">
                      <p className="font-bold">Đơn đã hủy</p>
                      {booking.rejectionReason && <p className="text-xs mt-1 text-red-500 font-medium">Lý do: {booking.rejectionReason}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-4 border-dashed border-gray-100">
              <ClipboardList className="w-20 h-20 text-gray-100 mb-4" />
              <p className="text-gray-400 font-bold text-lg">Mục này hiện đang trống</p>
            </div>
          )}
        </div>

        {/* Reject Modal */}
        {rejectModal.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Từ chối đơn hàng?</h3>
              <p className="text-gray-500 mb-6">Tiền sẽ được hoàn lại cho khách hàng. Vui lòng nhập lý do cụ thể.</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="VD: Kỹ thuật viên của chúng tôi hiện đang bận đột xuất..."
                rows={4}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-red-500 focus:outline-none transition-all resize-none mb-6"
              />
              <div className="flex gap-4">
                <button onClick={() => setRejectModal({ open: false, booking: null })} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all">Quay lại</button>
                <button onClick={handleRejectConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all">Xác nhận hủy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderBookingsPage;