import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
  Search,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { getBookingHistory } from "../services/servicesService";
import { cancelBooking } from "../services/bookingService";

const PendingBookingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiError, setApiError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch pending bookings
  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const response = await getBookingHistory();
      setBookings(response.data || []);
      setFilteredBookings(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      setApiError("Không thể tải danh sách booking");
      setLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = bookings.filter((booking) =>
        booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchTerm, bookings]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getTimeUntilBooking = (bookingDate) => {
    const now = new Date();
    const booking = new Date(bookingDate);
    const diff = booking - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `Còn ${days} ngày ${hours} giờ`;
    } else if (hours > 0) {
      return `Còn ${hours} giờ`;
    } else if (diff > 0) {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Còn ${minutes} phút`;
    } else {
      return "Đã đến giờ";
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy");
      return;
    }

    setCancellingId(selectedBooking.id);
    try {
      const response = await cancelBooking(selectedBooking.id, cancelReason);
      fetchPendingBookings();
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedBooking(null);
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert("Không thể hủy booking. Vui lòng thử lại.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Booking chờ xác nhận
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các booking đang chờ xác nhận từ nhà cung cấp
            </p>
          </div>
          <a
            href="/"
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            ← Trang chủ
          </a>
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{apiError}</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Thông tin quan trọng
              </h3>
              <p className="text-sm text-yellow-800">
                Các booking này đang chờ nhà cung cấp xác nhận. Bạn sẽ nhận được
                thông báo khi booking được xác nhận hoặc từ chối. Nếu cần hủy,
                vui lòng hủy trước ít nhất 24 giờ.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {bookings.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Booking chờ xác nhận</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {formatPrice(
                  bookings.reduce((sum, b) => sum + b.totalPrice, 0)
                )}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tổng giá trị</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {
                  bookings.filter((b) => new Date(b.bookingDate) > new Date())
                    .length
                }
              </p>
              <p className="text-sm text-gray-600 mt-1">Booking sắp tới</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm dịch vụ
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Không có booking chờ xác nhận
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp"
                : "Tất cả booking của bạn đã được xử lý"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border-l-4 border-yellow-500"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {booking.service.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-700 border-yellow-300">
                          <Clock className="w-4 h-4" />
                          Chờ xác nhận
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Booking ID: #{booking.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">
                        {formatPrice(booking.totalPrice)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.service.duration} phút
                      </p>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Ngày hẹn</p>
                          <p className="font-semibold text-gray-800">
                            {formatDate(booking.bookingDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">
                            Thời gian còn lại
                          </p>
                          <p className="font-semibold text-purple-600">
                            {getTimeUntilBooking(booking.bookingDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Đặt lúc: </span>
                        <span className="font-medium">
                          {formatDate(booking.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">
                            Ghi chú của bạn
                          </p>
                          <p className="text-sm text-purple-700">
                            {booking.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleCancelClick(booking)}
                      disabled={cancellingId === booking.id}
                      className="flex-1 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                    >
                      {cancellingId === booking.id
                        ? "Đang hủy..."
                        : "Hủy booking"}
                    </button>
                    <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      Liên hệ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Hủy booking</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Bạn có chắc muốn hủy booking{" "}
                <span className="font-semibold">
                  {selectedBooking?.service.name}
                </span>
                ?
              </p>
              <p className="text-sm text-red-600">
                Lưu ý: Việc hủy booking có thể ảnh hưởng đến uy tín của bạn.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do hủy <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                placeholder="Vui lòng cho chúng tôi biết lý do bạn hủy booking..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBooking(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancellingId !== null}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {cancellingId !== null ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingBookingsPage;
