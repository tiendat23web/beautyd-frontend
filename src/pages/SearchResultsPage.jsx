import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { searchServices } from "../services/servicesService";
import { getFavorites } from "../services/favoritesService";
import { useAuth } from "../contexts/AuthContext";
import { Clock, Star, Heart } from "lucide-react";
import { addFavorite, removeFavorite } from "../services/favoritesService";
import { toast } from "react-toastify";

// Reuse ServiceCard Component from Home.jsx
const ServiceCard = ({ service, userFavorites = [], onFavoriteChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(userFavorites.includes(service.id));
  }, [userFavorites, service.id]);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm yêu thích');
      navigate('/login');
      return;
    }

    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        await removeFavorite(service.id);
        setIsFavorite(false);
        toast.success('Đã xóa khỏi yêu thích');
      } else {
        await addFavorite(service.id);
        setIsFavorite(true);
        toast.success('Đã thêm vào yêu thích');
      }
      
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error('Favorite error:', error);
      toast.error('Có lỗi xảy ra');
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/service/${service.id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={service.images[0]?.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-purple-50 cursor-pointer z-10"
          onClick={handleFavoriteClick}
        >
          <Heart className={`w-5 h-5 transition-colors ${
            isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
          }`} />
        </div>
        <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          HOT
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">
            {service.name}
          </h3>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {service.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Clock className="w-4 h-4" />
          <span>{service.duration} phút</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-purple-600">
              {formatPrice(service.price)}
            </span>
          </div>
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
              src={service.provider.avatar}
              alt={service.provider.fullName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-gray-600">
              {service.provider.businessName}
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

// Main SearchResultsPage Component
const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [searchQuery, user]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = await searchServices(searchQuery);
      
      if (response.status === 200) {
        setServices(response.data);
      }

      // Fetch favorites if user is logged in
      if (user) {
        try {
          const favoritesData = await getFavorites();
          setUserFavorites(favoritesData.map(fav => fav.serviceId));
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error searching services:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-purple-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Kết quả tìm kiếm</h1>
              {searchQuery && (
                <p className="text-purple-100 mt-1">
                  Tìm kiếm cho: <span className="font-semibold">"{searchQuery}"</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-96 animate-pulse"
              ></div>
            ))}
          </div>
        ) : !searchQuery ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Vui lòng nhập từ khóa tìm kiếm
            </h2>
            <p className="text-gray-500">
              Sử dụng thanh tìm kiếm ở trên để tìm dịch vụ bạn cần
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy kết quả
            </h2>
            <p className="text-gray-500 mb-6">
              Không có dịch vụ nào phù hợp với "{searchQuery}"
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Khám phá dịch vụ khác
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Tìm thấy {services.length} kết quả
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  userFavorites={userFavorites}
                  onFavoriteChange={fetchSearchResults}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;
