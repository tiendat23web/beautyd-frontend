import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getServicesById, getServicesByProvider } from "../services/servicesService";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [providerServices, setProviderServices] = useState([]);
  const [openSections, setOpenSections] = useState({
    instructions: true,
    policies: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin dịch vụ hiện tại
        const serviceResponse = await getServicesById(serviceId);
        const serviceData = serviceResponse.data;
        setService(serviceData);

        // 2. Nếu có thông tin provider, lấy thêm các dịch vụ khác của họ
        if (serviceData?.provider?.id) {
          try {
            const providerResponse = await getServicesByProvider(serviceData.provider.id);
            if (providerResponse.data) {
              // Lọc bỏ dịch vụ đang xem hiện tại
              const otherServices = providerResponse.data.filter(
                (s) => s.id !== parseInt(serviceId) && s.id !== serviceData.id
              );
              setProviderServices(otherServices);
            }
          } catch (err) {
            console.error("Error fetching provider services:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching service detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      loadData();
    }
  }, [serviceId]);

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
    });
  };

  const nextImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
    }
  };

  const prevImage = () => {
    if (service?.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + service.images.length) % service.images.length
      );
    }
  };

  const calculateAverageRating = () => {
    if (!service?.reviews || service.reviews.length === 0) return "0.0";
    const sum = service.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / service.reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBookNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/booking/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy dịch vụ</p>
      </div>
    );
  }

  const avgRating = calculateAverageRating();
  const displayReviews = showAllReviews
    ? service.reviews
    : service.reviews?.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* CỘT TRÁI: Image Gallery */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-fit">
            {/* Tỷ lệ 4:3 cho ảnh ngắn lại */}
            <div className="relative aspect-[4/3] bg-gray-200 group">
              {service.images && service.images.length > 0 ? (
                <>
                  <img
                    src={service.images[currentImageIndex].imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  {service.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {service.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-1.5 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-white w-6"
                                : "bg-white/50 w-1.5"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Chưa có hình ảnh
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {service.images && service.images.length > 1 && (
              <div className="p-3 grid grid-cols-5 gap-2">
                {service.images.slice(0, 5).map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:opacity-100 ${
                      index === currentImageIndex
                        ? "border-purple-600 opacity-100"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: Service Info */}
          <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col h-fit">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-purple-100">
                {service.category?.icon} {service.category?.name}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {service.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900">{avgRating}</span>
                <span className="text-gray-400">({service.reviews?.length || 0} đánh giá)</span>
              </span>
              <span className="w-px h-4 bg-gray-200"></span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-semibold">{service.duration} phút</span>
              </span>
            </div>

            {/* Mô tả dịch vụ: Giới hạn chiều cao và thêm cuộn */}
            <div className="mb-6 flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Mô tả dịch vụ
              </h3>
              <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mt-auto">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase">Tổng chi phí</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold text-purple-600">
                      {formatPrice(service.price)}
                    </p>
                    <span className="text-gray-500 font-medium text-base">
                      / 1 lần
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
              >
                Đặt hẹn ngay
              </button>
            </div>
          </div>
        </div>

        {/* Nội dung chính bên dưới */}
        <div className="space-y-6">
          {/* Instructions & Policies */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleSection("instructions")}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-gray-900 text-xl">
                  Hướng dẫn sử dụng
                </h3>
                {openSections.instructions ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </button>

              {openSections.instructions && (
                <div className="px-6 pb-6 text-gray-600 space-y-4 animate-fadeIn">
                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-100 text-purple-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <p className="pt-1">
                      <span className="font-semibold text-gray-900">
                        Bước 1:
                      </span>{" "}
                      Lựa chọn và đặt lịch sản phẩm/dịch vụ
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-100 text-purple-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <p className="pt-1">
                      <span className="font-semibold text-gray-900">
                        Bước 2:
                      </span>{" "}
                      Đặt hẹn thành công sau khi được cửa hàng duyệt đơn
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection("policies")}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-gray-900 text-xl">
                  Điều khoản/Chính sách
                </h3>
                {openSections.policies ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </button>

              {openSections.policies && (
                <div className="px-6 pb-6 text-gray-600 space-y-5 animate-fadeIn">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Xác nhận
                    </h4>
                    <p className="leading-relaxed">
                      Xác nhận ngay tức thời qua thông báo khi bạn mua dịch
                      vụ/đặt hẹn thành công. Sau đó, Spa/Salon/TMV sẽ liên hệ
                      xác nhận với bạn một lần nữa để đảm bảo thời gian đặt lịch
                      hẹn. Nếu bạn không nhận được tin nhắn/cuộc gọi nào, hãy
                      liên hệ với chúng tôi qua hotline{" "}
                      <span className="font-bold text-purple-600">
                        0289 9959 938
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Chính sách hủy
                    </h4>
                    <p>Không hoàn, huỷ hay thay đổi sau khi đã mua dịch vụ</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Provider Info */}
          {service.provider && (
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="font-bold text-gray-900 mb-6 text-xl">
                Thông tin nhà cung cấp
              </h3>
              <div className="flex items-start gap-6 flex-col md:flex-row">
                <img
                  src={service.provider.avatar}
                  alt={service.provider.businessName}
                  className="w-20 h-20 rounded-2xl object-cover shadow-md"
                />
                <div className="flex-1 w-full">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg mb-1">
                    {service.provider.businessName}
                    <BadgeCheck className="w-6 h-6 text-blue-500" />
                  </h4>
                  <p className="text-gray-600 mb-3">
                    {service.provider.fullName}
                  </p>
                  {service.provider.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {service.provider.description}
                    </p>
                  )}
                  {service.provider.businessAddress && (
                    <p className="text-gray-600 flex items-start gap-2 mb-4">
                      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-600" />
                      <span>{service.provider.businessAddress}</span>
                    </p>
                  )}
                  <div className="flex gap-3 mt-4 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() =>
                        navigate(`/messages/${service.provider.id}`)
                      }
                      className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold flex items-center justify-center gap-2 min-w-[150px]"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Nhận tư vấn
                    </button>
                    <button
                      onClick={() => navigate(`/shop/${service.provider.id}`)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold min-w-[150px]"
                    >
                      Xem Shop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {service.reviews && service.reviews.length > 0 && (
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-gray-900 text-xl">
                  Đánh giá ({service.reviews.length})
                </h3>
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold text-purple-600">
                    {avgRating}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {displayReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.customer?.avatar}
                        alt={review.customer?.fullName || "Khách hàng"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-900">
                            {review.customer?.fullName || "Khách hàng ẩn danh"}
                          </h5>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {review.comment}
                        </p>

                        {review.providerReply && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 ml-0 sm:ml-6">
                            <div className="flex items-center gap-2 mb-2">
                              <BadgeCheck className="w-5 h-5 text-purple-600" />
                              <span className="font-semibold text-purple-800">
                                Phản hồi từ {service.provider?.businessName}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {review.providerReply}
                            </p>
                            <span className="text-xs text-gray-500 mt-2 block">
                              {formatDate(review.repliedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {service.reviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-6 text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {showAllReviews
                    ? "Thu gọn"
                    : `Xem thêm ${service.reviews.length - 3} đánh giá`}
                </button>
              )}
            </div>
          )}

          {/* Dịch vụ khác (Phần bị thiếu đã được thêm lại) */}
          {providerServices.length > 0 && (
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-xl">
                  Dịch vụ khác của {service.provider?.businessName}
                </h3>
                <span className="text-sm text-purple-600 font-semibold">
                  {providerServices.length} dịch vụ
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {providerServices.map((otherService) => (
                  <div
                    key={otherService.id}
                    onClick={() => navigate(`/service/${otherService.id}`)}
                    className="border-2 border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-purple-200 transition-all group"
                  >
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      {otherService.images && otherService.images.length > 0 && (
                        <img
                          src={otherService.images[0].imageUrl}
                          alt={otherService.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-2 rounded-full text-sm font-bold text-purple-600">
                        {formatPrice(otherService.price)}
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 mb-3 line-clamp-1 text-lg">
                        {otherService.name}
                      </h4>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {otherService.duration}p
                        </span>
                        <span className="flex items-center gap-1.5 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          {otherService.reviews?.length > 0
                            ? (
                                otherService.reviews.reduce(
                                  (acc, r) => acc + r.rating,
                                  0
                                ) / otherService.reviews.length
                              ).toFixed(1)
                            : "5.0"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1.5 rounded-lg">
                          {otherService.category?.name}
                        </span>
                        <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Tùy chỉnh thanh cuộn cho đoạn mô tả */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default ServiceDetailPage;