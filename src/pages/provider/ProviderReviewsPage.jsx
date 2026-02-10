import React, { useState, useEffect } from 'react';
import { Star as StarIcon, Filter, MessageSquare, AlertCircle } from 'lucide-react';
import ProviderLayout from '../../layouts/ProviderLayout';
import ReviewCard from '../../components/ReviewCard';
import { getProviderReviews, replyToReview, reportReview } from '../../services/providerService';

const ProviderReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');
  
  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviewsByRating();
  }, [reviews, filterRating]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Gọi API lấy toàn bộ đánh giá của Shop (từ tất cả dịch vụ)
      const response = await getProviderReviews();
      if (response.status === 200 && Array.isArray(response.data)) {
        // CHỈ SỬ DỤNG DỮ LIỆU THẬT
        setReviews(response.data);
      } else {
        setReviews([]); // Nếu lỗi hoặc không có data thì set rỗng
      }
    } catch (error) {
      console.error('Fetch reviews error:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filterReviewsByRating = () => {
    if (filterRating === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(r => Math.round(r.rating) === parseInt(filterRating)));
    }
  };

  const handleReply = async (reviewId, reply) => {
    try {
      await replyToReview(reviewId, reply);
      // Refresh lại list sau khi reply thành công
      fetchReviews();
    } catch (error) {
      console.error("Reply error:", error);
    }
  };

  const handleReport = async (reviewId, reason) => {
    try {
        await reportReview(reviewId, reason);
        alert("Đã gửi báo cáo đánh giá này.");
    } catch (error) {
        console.error("Report error:", error);
    }
  };

  // --- LOGIC TÍNH TOÁN TRUNG BÌNH TỪ DỮ LIỆU THẬT ---
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return "0.0";
    // Cộng tổng rating của TẤT CẢ các đánh giá
    const sum = reviews.reduce((acc, review) => acc + (Number(review.rating) || 0), 0);
    // Chia cho tổng số lượng đánh giá
    return (sum / reviews.length).toFixed(1);
  };

  // --- LOGIC TÍNH PHÂN BỐ SAO TỪ DỮ LIỆU THẬT ---
  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews && reviews.length > 0) {
        reviews.forEach(review => {
        // Làm tròn số sao (ví dụ 4.5 -> 5) để group vào nhóm
        const rating = Math.round(Number(review.rating));
        if (dist[rating] !== undefined) {
            dist[rating]++;
        }
        });
    }
    return dist;
  };

  const ratingDist = getRatingDistribution();
  const averageRating = calculateAverageRating();
  const totalReviews = reviews.length;

  if (loading) {
    return (
      <ProviderLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ProviderLayout>
    );
  }

  return (
    <ProviderLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Đánh giá</h1>
          <p className="text-gray-600">Tổng hợp đánh giá từ tất cả dịch vụ của cửa hàng</p>
        </div>

        {/* Statistics Section - Dữ liệu thật */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Tổng quan */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <StarIcon className="w-32 h-32" />
            </div>
            <p className="text-purple-100 font-medium mb-2">Đánh giá trung bình</p>
            <div className="flex items-center gap-3">
              <span className="text-6xl font-black tracking-tighter">{averageRating}</span>
              <div className="flex flex-col items-start">
                  <StarIcon className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-purple-200">/ 5.0</span>
              </div>
            </div>
            <p className="text-sm text-white/80 mt-4 bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
                Dựa trên {totalReviews} lượt đánh giá
            </p>
          </div>

          {/* Card Phân bố chi tiết */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:col-span-2">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-600" />
                Phân bố đánh giá
            </h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDist[star];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                <div key={star} className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors" onClick={() => setFilterRating(String(star))}>
                  <div className="flex items-center gap-1 w-12 flex-shrink-0">
                    <span className="font-bold text-gray-700">{star}</span>
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                          star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-20 text-right flex flex-col items-end leading-none">
                      <span className="font-bold text-gray-700">{count}</span>
                      <span className="text-[10px] text-gray-400">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>

        {/* Filter & Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2 bg-gray-100 rounded-lg">
                <Filter className="w-5 h-5 text-gray-600" />
            </div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium text-gray-700 cursor-pointer min-w-[200px]"
            >
              <option value="all">Tất cả sao ({totalReviews})</option>
              <option value="5">5 sao ({ratingDist[5]})</option>
              <option value="4">4 sao ({ratingDist[4]})</option>
              <option value="3">3 sao ({ratingDist[3]})</option>
              <option value="2">2 sao ({ratingDist[2]})</option>
              <option value="1">1 sao ({ratingDist[1]})</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReply={handleReply}
                onReport={handleReport}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có đánh giá nào</h3>
              <p className="text-gray-500 max-w-sm">
                {filterRating !== 'all' 
                    ? `Không tìm thấy đánh giá ${filterRating} sao nào.` 
                    : "Hiện tại cửa hàng chưa nhận được đánh giá nào từ khách hàng."}
              </p>
              {filterRating !== 'all' && (
                  <button 
                    onClick={() => setFilterRating('all')}
                    className="mt-4 text-purple-600 font-semibold hover:underline"
                  >
                      Xem tất cả đánh giá
                  </button>
              )}
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
};

export default ProviderReviewsPage;