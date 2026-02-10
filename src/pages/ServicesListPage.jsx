import React, { useState, useEffect } from "react";
import {
  Star,
  Clock,
  Heart,
  ChevronLeft,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getServices } from "../services/servicesService";
import { addFavorite, removeFavorite, getFavorites } from "../services/favoritesService";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Header from "../components/Header";

const ServicesListPage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "1";
  const searchQueryParam = searchParams.get("search") || "";
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [sortBy, setSortBy] = useState("popular"); // popular, price-low, price-high, rating
  const [priceRange, setPriceRange] = useState("all"); // all, under-500k, 500k-1m, over-1m
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);

  useEffect(() => {
    fetchServices();
  }, [categoryId, user, searchQueryParam]);

  const fetchServices = async () => {
    try {
      // If search query exists, fetch all services; otherwise fetch by category
      const response = searchQueryParam 
        ? await getServices() // Fetch all services for search
        : await getServices(categoryId); // Fetch by category
      console.log(response);

      setServices(response.data || []);
      
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
      console.error("Error fetching services:", error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filterAndSortServices = () => {
    let filtered = [...services];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter((service) => {
        if (priceRange === "under-500k") return service.price < 500000;
        if (priceRange === "500k-1m")
          return service.price >= 500000 && service.price < 1000000;
        if (priceRange === "over-1m") return service.price >= 1000000;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return 0; // Would need rating data
      return 0; // popular - default
    });

    return filtered;
  };

  const filteredServices = filterAndSortServices();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dịch vụ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {searchQueryParam && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Kết quả tìm kiếm cho: "
              <span className="text-purple-600">{searchQueryParam}</span>"
            </h2>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold text-gray-800">
              {filteredServices.length}
            </span>{" "}
            dịch vụ
          </p>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Không tìm thấy dịch vụ phù hợp
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                userFavorites={userFavorites}
                onFavoriteChange={fetchServices}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Service Card Component
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
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={service.images[0]?.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-purple-50 cursor-pointer z-10"
          onClick={handleFavoriteClick}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
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

export default ServicesListPage;
