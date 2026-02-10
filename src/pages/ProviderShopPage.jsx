import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, MessageCircle, Share2, ShieldCheck, Clock, 
  Search, Filter, ShoppingBag, ChevronDown, ChevronUp, Grid, List,
  TrendingUp, Calendar, Award, Users, Heart, ExternalLink,
  Phone, CheckCircle2, Sparkles, Camera
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getServicesByProvider } from '../services/servicesService';
import { getUserById } from '../services/userService';
import { getProviderProfile } from '../services/providerService';
import { toast } from 'react-toastify';

const ProviderShopPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  
  const [providerInfo, setProviderInfo] = useState(null);
  const [providerStats, setProviderStats] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchShopData();
  }, [providerId]);

  useEffect(() => {
    filterAndSortServices();
  }, [services, searchTerm, selectedCategory, sortBy]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const userResponse = await getUserById(providerId);
      setProviderInfo(userResponse);
      
      try {
        const statsResponse = await getProviderProfile(providerId);
        if (statsResponse && statsResponse.status === 200) {
          setProviderStats(statsResponse.data);
        }
      } catch (error) {
        console.warn('Provider stats not available');
      }
      
      const servicesResponse = await getServicesByProvider(providerId);
      if (servicesResponse && servicesResponse.status === 200) {
        const servicesList = servicesResponse.data || [];
        setServices(servicesList);
        setFilteredServices(servicesList);
        
        const uniqueCategories = [...new Set(
          servicesList
            .filter(s => s.category?.name)
            .map(s => s.category.name)
        )];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
      toast.error("Không thể tải thông tin cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortServices = () => {
    let filtered = [...services];
    if (searchTerm.trim()) {
      filtered = filtered.filter(service =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => 
        service.category?.name === selectedCategory
      );
    }
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    setFilteredServices(filtered);
  };

  const handleChat = () => navigate(`/messages/${providerId}`);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: providerInfo?.businessName || 'Shop trên BeautyD',
          text: `Xem shop ${providerInfo?.businessName || ''} trên BeautyD`,
          url: url,
        });
      } catch (error) {
        if (error.name !== 'AbortError') copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép link!');
  };

  const formatPrice = (price) => {
    if (!price) return '0₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const description = providerInfo?.bio || providerInfo?.description || '';
  const isLongDescription = description.length > 150;
  const displayDescription = showFullDescription || !isLongDescription 
    ? description 
    : description.substring(0, 150) + '...';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-sans text-gray-900">
      <Header />

      {/* --- SHOP HEADER SECTION --- */}
      <div className="bg-white">
        {/* Ảnh bìa (Banner) */}
        <div className="relative h-48 md:h-72 w-full overflow-hidden bg-gray-200">
          {providerInfo.coverImage || providerInfo.avatar ? (
            <img 
              src={providerInfo.coverImage || providerInfo.avatar} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          )}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          {/* Avatar Profile (Đè lên banner) */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-24 mb-8">
            <div className="relative z-10">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden bg-white">
                <img 
                  src={providerInfo.avatar || "https://via.placeholder.com/150"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              {providerInfo.kycStatus === 'APPROVED' && (
                <div className="absolute bottom-3 right-3 bg-blue-500 text-white p-2 rounded-2xl shadow-lg border-2 border-white">
                  <ShieldCheck className="w-5 h-5" fill="white" />
                </div>
              )}
            </div>

            {/* Shop Title & Primary Stats */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full pb-2">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">
                    {providerInfo.businessName || providerInfo.fullName || 'Cửa hàng'}
                  </h1>
                  {providerInfo.kycStatus === 'APPROVED' && (
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 border border-blue-100">
                      <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-600" />
                    <span>{services.length} Dịch vụ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Tham gia: {providerInfo.createdAt ? new Date(providerInfo.createdAt).toLocaleDateString('vi-VN') : '10/02/2026'}</span>
                  </div>
                </div>
              </div>

              {/* Nút Chat & Share nằm ngang */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleChat}
                  className="flex-1 md:flex-none px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-100 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" /> Chat ngay
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 bg-white hover:bg-gray-50 text-gray-600 border-2 border-gray-100 rounded-2xl font-bold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grouped Contact & Intro Card (Đã hiện SĐT) */}
          <div className="mb-12 p-8 md:p-10 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cột thông tin liên hệ */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest bg-purple-50 w-fit px-3 py-1 rounded-lg">Liên hệ</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl"><MapPin className="w-5 h-5 text-gray-400" /></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Địa chỉ cửa hàng</p>
                      <p className="text-sm font-bold text-gray-800 leading-snug">
                        {providerInfo.businessAddress || providerInfo.address || 'Đang cập nhật địa chỉ'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl"><Phone className="w-5 h-5 text-gray-400" /></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Số điện thoại</p>
                      <p className="text-lg font-black text-purple-600">
                        {providerInfo.businessPhone || providerInfo.phone || 'Chưa cập nhật SĐT'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột giới thiệu */}
              <div className="lg:col-span-2 space-y-6 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-10">
                <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest bg-purple-50 w-fit px-3 py-1 rounded-lg">Giới thiệu cửa hàng</h3>
                <div className="relative">
                  <p className="text-base text-gray-600 leading-relaxed font-medium">
                    {displayDescription || "Chào mừng bạn đến với cửa hàng của chúng tôi. Chúng tôi cam kết mang đến dịch vụ chất lượng nhất."}
                  </p>
                  {isLongDescription && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-4 text-purple-600 hover:text-purple-700 font-black text-sm flex items-center gap-1"
                    >
                      {showFullDescription ? 'Thu gọn' : 'Đọc thêm...'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SERVICES CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Danh mục */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Phân loại dịch vụ</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-black text-sm ${
                      selectedCategory === 'all' 
                        ? 'bg-gray-900 text-white shadow-2xl shadow-gray-200' 
                        : 'text-gray-500 hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    Tất cả <span>{services.length}</span>
                  </button>
                  
                  {categories.map((category, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-black text-sm ${
                        selectedCategory === category 
                          ? 'bg-gray-900 text-white shadow-2xl shadow-gray-200' 
                          : 'text-gray-500 hover:bg-white hover:text-gray-900'
                      }`}
                    >
                      <span className="truncate mr-2">{category}</span>
                      <span>{services.filter(s => s.category?.name === category).length}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Services Grid */}
          <section className="flex-1">
            {/* Thanh công cụ tìm kiếm & lọc */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-sm font-black text-gray-700 focus:ring-0 cursor-pointer pr-10"
                >
                  <option value="popular">Phổ biến</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá thấp</option>
                  <option value="price-desc">Giá cao</option>
                </select>
              </div>

              <div className="relative w-full md:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm dịch vụ bạn muốn..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-purple-50 focus:border-purple-600 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Render danh sách thẻ */}
            {filteredServices.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}>
                {filteredServices.map(service => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    navigate={navigate}
                    formatPrice={formatPrice}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-gray-400 font-black tracking-widest uppercase text-xs">Không có dịch vụ phù hợp</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ServiceCard = ({ service, navigate, formatPrice, viewMode }) => {
  const [isLiked, setIsLiked] = useState(false);
  const handleServiceClick = () => navigate(`/service/${service.id}`);

  // Grid Layout
  if (viewMode === 'grid') {
    return (
      <div 
        onClick={handleServiceClick}
        className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-purple-200/40 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
      >
        <div className="aspect-[4/5] overflow-hidden relative">
          <img 
            src={service.images?.[0]?.imageUrl || "https://via.placeholder.com/300"} 
            alt={service.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          />
          {/* Nút tim tối giản */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className={`absolute top-5 right-5 p-2 transition-all active:scale-90 ${isLiked ? 'text-red-500 drop-shadow-lg' : 'text-white/80 hover:text-white drop-shadow-md'}`}
          >
            <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} strokeWidth={2.5} />
          </button>
          
          {service.discount && (
            <div className="absolute top-5 left-5 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">
              -{service.discount}%
            </div>
          )}
          
          {/* Overlay gradient khi hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
             <button className="w-full py-3 bg-white text-gray-900 rounded-2xl font-black text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                Chi tiết dịch vụ
             </button>
          </div>
        </div>
        
        <div className="p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
              {service.category?.name || 'SPA'}
            </span>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-black">
              <Clock className="w-3.5 h-3.5" /> {service.duration}p
            </div>
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-6 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
            {service.name}
          </h3>
          <div className="flex items-center justify-between pt-5 border-t border-gray-50">
            <div className="flex flex-col">
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Giá dịch vụ</span>
               <span className="text-xl font-black text-gray-900">{formatPrice(service.price)}</span>
            </div>
            <div className="w-12 h-12 bg-gray-50 group-hover:bg-purple-600 text-gray-400 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300">
              <ExternalLink className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List Layout
  return (
    <div 
      onClick={handleServiceClick}
      className="group bg-white p-5 rounded-[2.5rem] border border-gray-100 flex flex-col sm:flex-row gap-8 hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      <div className="w-full sm:w-44 h-44 rounded-[2rem] overflow-hidden flex-shrink-0 relative">
        <img src={service.images?.[0]?.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className={`absolute top-4 right-4 p-1.5 transition-all ${isLiked ? 'text-red-500' : 'text-white/70'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-1 rounded-md">{service.category?.name}</span>
          <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {service.duration} phút</span>
        </div>
        <h3 className="font-black text-2xl text-gray-900 group-hover:text-purple-600 transition-colors mb-3">{service.name}</h3>
        <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-5 leading-relaxed">{service.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-black text-gray-900">{formatPrice(service.price)}</span>
          <button className="px-10 py-3.5 bg-gray-900 hover:bg-purple-600 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-gray-200">Đặt lịch ngay</button>
        </div>
      </div>
    </div>
  );
};

export default ProviderShopPage;