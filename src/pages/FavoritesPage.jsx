import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Clock, Trash2 } from 'lucide-react';
import { getFavorites, removeFavorite } from '../services/favoritesService';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  // --- SỬA ĐOẠN NÀY: Nhận favoriteId thay vì serviceId ---
  const handleRemoveFavorite = async (favoriteId, serviceName, e) => {
    e.stopPropagation();
    
    try {
      // Gọi API xóa theo ID của Favorite
      await removeFavorite(favoriteId);
      
      // Cập nhật state: Lọc bỏ item có favorite.id tương ứng
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      
      toast.success(`Đã xóa "${serviceName}" khỏi danh sách yêu thích`);
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Không thể xóa khỏi danh sách yêu thích');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Dịch vụ yêu thích
            </h1>
          </div>
          <p className="text-gray-600">
            {favorites.length > 0 
              ? `Bạn có ${favorites.length} dịch vụ yêu thích`
              : 'Chưa có dịch vụ yêu thích nào'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có dịch vụ yêu thích
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy thêm các dịch vụ yêu thích để dễ dàng tìm lại sau này!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Khám phá dịch vụ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <FavoriteServiceCard
                key={favorite.id}
                favorite={favorite}
                onRemove={handleRemoveFavorite}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

// Favorite Service Card Component
const FavoriteServiceCard = ({ favorite, onRemove, navigate }) => {
  const { service } = favorite;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div
      onClick={() => navigate(`/service/${service.id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={service.images?.[0]?.imageUrl || '/placeholder.jpg'}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          // --- SỬA ĐOẠN NÀY: Truyền favorite.id (ID bản ghi) thay vì service.id ---
          onClick={(e) => onRemove(favorite.id, service.name, e)}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors z-10"
        >
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
          {service.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {service.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Clock className="w-4 h-4" />
          <span>{service.duration} phút</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-purple-600">
            {formatPrice(service.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/service/${service.id}`);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Đặt lịch
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={service.provider?.avatar || '/default-avatar.jpg'}
              alt={service.provider?.fullName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-gray-600">
              {service.provider?.businessName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;