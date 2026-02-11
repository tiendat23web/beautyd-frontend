import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  User,
  Star,
  X,
} from 'lucide-react';
import { getBookingById, cancelBooking } from '../services/bookingService';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const data = await getBookingById(id);
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Không thể tải thông tin đặt chỗ');
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy');
      return;
    }

    try {
      setCancelling(true);
      await cancelBooking(booking.id, cancelReason);
      toast.success('Đã hủy lịch đặt chỗ thành công');
      setShowCancelModal(false);
      fetchBookingDetail(); // Refresh
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.error || 'Không thể hủy lịch đặt chỗ');
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' },
      CONFIRMED: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-700' },
      CHECKED_IN: { label: 'Đã check-in', className: 'bg-purple-100 text-purple-700' },
      COMPLETED: { label: 'Hoàn thành', className: 'bg-green-100 text-green-700' },
      CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const canCancelBooking = () => {
    return booking?.status === 'PENDING' || booking?.status === 'CONFIRMED';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/bookings')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>

        {/* Booking Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Chi tiết đặt chỗ
              </h1>
              <p className="text-gray-600">Mã đặt chỗ: #{booking.id}</p>
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </div>

        {/* Service Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin dịch vụ
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {booking.service.name}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="font-medium">Ngày đặt</p>
                  <p>{formatDate(booking.bookingDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-medium">Thời lượng</p>
                  <p>{booking.service.duration} phút</p>
                </div>
              </div>
              {/* ✅ Hiển thị số lượng */}
              <div className="flex items-center gap-2 text-purple-600">
                <User className="w-5 h-5" />
                <div>
                  <p className="font-medium">Số lượng</p>
                  <p className="font-bold text-lg">{booking.quantity || 1} người</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="w-5 h-5" />
                <div>
                  <p className="font-medium">Tổng tiền</p>
                  <p className="font-semibold text-purple-600">
                    {formatPrice(booking.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Info */}
        {booking.service.provider && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin nhà cung cấp
            </h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800">
                  {booking.service.provider.businessName}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.service.provider.fullName}
                </p>
              </div>
              {booking.service.provider.businessAddress && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{booking.service.provider.businessAddress}</p>
                </div>
              )}
              {booking.service.provider.businessPhone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <p className="text-sm">{booking.service.provider.businessPhone}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customer Notes */}
        {booking.notes && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ghi chú</h2>
            <p className="text-gray-600">{booking.notes}</p>
          </div>
        )}

        {/* Cancel Reason */}
        {booking.cancelReason && (
          <div className="bg-red-50 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Lý do hủy</h2>
            <p className="text-red-600">{booking.cancelReason}</p>
          </div>
        )}

        {/* Actions */}
        {canCancelBooking() && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Hủy lịch đặt chỗ
            </button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Hủy lịch đặt chỗ</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn hủy lịch đặt{' '}
              <span className="font-semibold">{booking.service.name}</span>?
            </p>

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
                {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookingDetailPage;