import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  getUserBookings,
  cancelBooking,
  sendFeedback,
  getFeedbacks,
} from "../services/bookingService";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userFeedbacks, setUserFeedbacks] = useState([]);

  // ✅ LẤY ID NGƯỜI DÙNG HIỆN TẠI ĐỂ PHÂN QUYỀN HIỂN THỊ
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser?.id;
  
  useEffect(() => {
    fetchBookings();
    fetchUserFeedbacks();
  }, [statusFilter]);

  const fetchUserFeedbacks = async () => {
    try {
      const feedbacks = await getFeedbacks();
      setUserFeedbacks(feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const status = statusFilter === "ALL" ? null : statusFilter;
      const data = await getUserBookings(status);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Không thể tải lịch đặt chỗ");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
    setCancelReason("");
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy");
      return;
    }

    try {
      setCancelling(true);
      await cancelBooking(selectedBooking.id, cancelReason);
      toast.success("Đã hủy lịch đặt chỗ thành công");
      setShowCancelModal(false);
      fetchBookings(); 
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.error || "Không thể hủy lịch đặt chỗ");
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReviewClick = (booking) => {
    setSelectedBookingForReview(booking);
    setShowReviewModal(true);
    setReviewRating(5);
    setReviewComment("");
  };

  const handleSubmitReview = async () => {
    // ✅ Đã loại bỏ phần kiểm tra reviewComment.trim() để không bắt buộc nhận xét
    try {
      setSubmittingReview(true);
      await sendFeedback(
        selectedBookingForReview.id,
        reviewRating,
        reviewComment
      );
      toast.success("Đã gửi đánh giá thành công");
      setShowReviewModal(false);
      fetchBookings(); 
      fetchUserFeedbacks(); 
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data || "Bạn đã đánh giá dịch vụ này rồi");
    } finally {
      setSubmittingReview(false);
    }
  };

  const canReview = (booking) => {
    const hasReviewed = userFeedbacks.some(
      (feedback) => feedback.bookingId === booking.id
    );
    return booking.status === "COMPLETED" && 
           booking.userId === currentUserId && 
           !hasReviewed;
  };

  const canCancelBooking = (booking) => {
    return (booking.status === "PENDING" || booking.status === "CONFIRMED") && 
           booking.userId === currentUserId;
  };

  const getBookingReview = (bookingId) => {
    return userFeedbacks.find((feedback) => feedback.bookingId === bookingId);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-700",
      },
      CONFIRMED: {
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Đã xác nhận",
        className: "bg-blue-100 text-blue-700",
      },
      CHECKED_IN: {
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Đã check-in",
        className: "bg-purple-100 text-purple-700",
      },
      COMPLETED: {
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700",
      },
      CANCELLED: {
        icon: <XCircle className="w-4 h-4" />,
        label: "Đã hủy",
        className: "bg-red-100 text-red-700",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => booking.userId === currentUserId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Lịch sử đặt chỗ
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các lịch đặt của bạn
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "ALL"
                    ? "Tất cả"
                    : getStatusBadge(status).props.children[1]}
                </button>
              )
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có lịch đặt chỗ nào
            </h3>
            <p className="text-gray-600 mb-6">
              Các dịch vụ bạn đã đặt sẽ hiển thị tại đây.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Khám phá dịch vụ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {booking.service.name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{booking.service.duration} phút</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-semibold text-purple-600">
                            {formatPrice(booking.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.cancelReason && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">
                        <span className="font-medium">Lý do hủy:</span>{" "}
                        {booking.cancelReason}
                      </p>
                    </div>
                  )}

                  {getBookingReview(booking.id) && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-800">
                          Đánh giá của bạn
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= getBookingReview(booking.id).rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700">
                        {getBookingReview(booking.id).comment}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => navigate(`/booking-details/${booking.id}`, { 
                                   state: { booking } 
                                 })}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Xem chi tiết
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {canCancelBooking(booking) && (
                      <button
                        onClick={() => handleCancelClick(booking)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Hủy lịch
                      </button>
                    )}
                    {canReview(booking) && (
                      <button
                        onClick={() => handleReviewClick(booking)}
                        className="px-4 py-2 bg-yellow-500 text-white border border-yellow-600 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Hủy lịch đặt chỗ
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do hủy <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Vui lòng nhập lý do hủy lịch..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Đánh giá dịch vụ
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 text-center">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 font-medium">({reviewRating} sao)</p>
            </div>

            <div className="mb-4">
              {/* ✅ Nhận xét đã chuyển thành không bắt buộc (không có dấu sao đỏ) */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét (không bắt buộc)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn (tùy chọn)..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                disabled={submittingReview}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default BookingHistoryPage;