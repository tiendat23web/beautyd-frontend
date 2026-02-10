import React, { useState, useEffect } from "react";
import { 
  ChevronRight, ChevronLeft, Star, Clock, Heart, Gift, MapPin,
  Store, ArrowRight, LayoutGrid, User, 
  Calendar,
  TicketCheckIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; 

// IMPORT SERVICE
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCategory, getServices } from "../services/servicesService";
import { getFavorites, removeFavorite, addFavorite } from '../services/favoritesService';
import { useAuth } from "../contexts/AuthContext"; 

// ==========================================
// 1. IMPORT HÌNH ẢNH (GIỮ NGUYÊN)
// ==========================================
import imgBody from "../assets/icons/image_db5308.png";      
import imgFace from "../assets/icons/image_db570d.png";      
import imgSpecial from "../assets/icons/image_db5a69.png";   
import imgMassage from "../assets/icons/image_db5acd.png";   
import imgNail from "../assets/icons/image_db5e30.png";      
import imgSpa from "../assets/icons/image_db6195.png";       
import imgHair from "../assets/icons/image_db628c.png";      
import imgWaxing from "../assets/icons/image_dbb4e6.png";    

// ==========================================
// 2. CẤU HÌNH STYLE DANH MỤC (GIỮ NGUYÊN)
// ==========================================
const getCategoryStyle = (name) => {
  const n = name?.toLowerCase() || "";
  if (n.includes('body') || n.includes('toàn thân')) return { image: imgBody, color: "bg-orange-100" };
  if (n.includes('da mặt') || n.includes('face') || n.includes('skin')) return { image: imgFace, color: "bg-pink-100" };
  if (n.includes('đặc biệt') || n.includes('special') || n.includes('mẹ')) return { image: imgSpecial, color: "bg-gray-200" };
  if (n.includes('massage') || n.includes('thư giãn')) return { image: imgMassage, color: "bg-blue-100" };
  if (n.includes('nail') || n.includes('móng')) return { image: imgNail, color: "bg-red-100" };
  if (n.includes('spa') || n.includes('detox') || n.includes('therapy')) return { image: imgSpa, color: "bg-teal-100" };
  if (n.includes('tẩy lông') || n.includes('triệt lông')) return { image: imgHair, color: "bg-yellow-100" };
  if (n.includes('waxing') || n.includes('làm sạch')) return { image: imgWaxing, color: "bg-rose-100" };
  return { icon: LayoutGrid, color: "bg-gray-100" };
};

// ==========================================
// 3. COMPONENT CON: CATEGORY CARD
// ==========================================
const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { image, icon: IconFallback, color } = getCategoryStyle(category.name);

  return (
    <div 
        onClick={() => navigate(`/services?categoryId=${category.id}`)} 
        className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 text-center group h-full flex flex-col items-center justify-center gap-3"
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300 shadow-sm overflow-hidden`}>
         {image ? (
            <img src={image} alt={category.name} className="w-full h-full object-cover" />
         ) : category.icon && (category.icon.startsWith('http') || category.icon.includes('/')) ? (
            <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
         ) : (
            <IconFallback className="w-8 h-8 text-gray-500" />
         )}
      </div>
      <h3 className="font-bold text-gray-800 text-sm md:text-base group-hover:text-purple-600 transition-colors line-clamp-2 px-1">
          {category.name}
      </h3>
    </div>
  );
};

// ==========================================
// 4. COMPONENT CON: SERVICE CARD
// ==========================================
const ServiceCard = ({ service, isHot = false, initialFavoriteId = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [favoriteId, setFavoriteId] = useState(initialFavoriteId);
  const isFavorite = !!favoriteId; 

  useEffect(() => {
    setFavoriteId(initialFavoriteId);
  }, [initialFavoriteId]);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const discountPercent = service.discount || 0;
  const currentPrice = service.price;
  const originalPrice = discountPercent > 0 ? currentPrice / (1 - discountPercent / 100) : currentPrice;

  const cardStyle = isHot 
    ? "bg-red-50/20 border-red-200 shadow-sm hover:shadow-red-200" 
    : "bg-white border-gray-100 hover:shadow-lg";

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
        toast.info("Vui lòng đăng nhập để lưu yêu thích!");
        navigate('/login');
        return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(favoriteId);
        setFavoriteId(null);
        toast.success(`Đã xóa "${service.name}" khỏi danh sách yêu thích`);
      } else {
        const res = await addFavorite(service.id); 
        const newFavId = res.id || res.data?.id; 
        if (newFavId) setFavoriteId(newFavId);
        toast.success(`Đã thêm "${service.name}" vào danh sách yêu thích`);
      }
    } catch (error) {
      console.error("Lỗi cập nhật yêu thích:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return (
    <div onClick={() => navigate(`/service/${service.id}`)} className={`rounded-2xl overflow-hidden transition-all border flex flex-col h-full cursor-pointer group ${cardStyle}`}>
      <div className="relative overflow-hidden h-52">
        <img src={service.images?.[0]?.imageUrl || "https://via.placeholder.com/300"} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {discountPercent > 0 && (
           <div className="absolute top-0 left-0 bg-red-600 text-white text-[12px] font-black px-3 py-1 rounded-br-xl z-10 shadow-md">
             GIẢM {discountPercent}%
           </div>
        )}
        
        <button 
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-2.5 shadow-md hover:bg-white transition-all z-20 group-btn"
        >
            <Heart className={`w-4 h-4 transition-colors duration-300 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-base line-clamp-1 mb-1 group-hover:text-purple-600">{service.name}</h3>
        
        <div className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold mb-1">
             <Store className="w-3.5 h-3.5" />
             <span className="truncate max-w-[150px]">{service.provider?.businessName || "Nhà cung cấp"}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2">
          <Clock className="w-3.5 h-3.5" /><span>{service.duration || 60} phút</span>
          <span className="mx-1">•</span>
          <MapPin className="w-3.5 h-3.5" /><span className="truncate max-w-[100px]">{service.provider?.businessAddress || "TP.HCM"}</span>
        </div>
        
        <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex items-center justify-between">
          <div className="flex flex-col">
             {discountPercent > 0 && (
                <span className="text-xs text-gray-400 line-through decoration-gray-400 font-medium">
                  {formatPrice(originalPrice)}
                </span>
             )}
             <span className={`text-lg font-black ${discountPercent > 0 ? 'text-red-600' : 'text-purple-600'}`}>
                {formatPrice(currentPrice)}
             </span>
          </div>
          <button className={`px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all text-white ${isHot ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. COMPONENT CON: PROVIDER CARD (ĐÃ XOÁ ĐÁNH GIÁ)
// ==========================================
const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/shop/${provider.id}`)} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden relative">
        <div className="h-28 overflow-hidden relative">
            <img src={provider.avatar || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000"} alt="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-4 pt-8 relative">
            <div className="absolute -top-8 left-4 w-12 h-12 rounded-lg border-2 border-white shadow-md overflow-hidden bg-white">
                <img src={provider.avatar || `https://ui-avatars.com/api/?name=${provider.businessName}`} className="w-full h-full object-cover" alt="avatar" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{provider.businessName}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2"><MapPin className="w-3 h-3" /><span className="truncate max-w-[150px]">{provider.businessAddress || "Hồ Chí Minh"}</span></div>
            <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-50">
                <span className="text-xs font-bold text-purple-600 group-hover:underline">Xem Shop</span>
            </div>
        </div>
    </div>
  );
};

// ==========================================
// 6. HOMEPAGE
// ==========================================
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [hotServices, setHotServices] = useState([]);
  const [providers, setProviders] = useState([]); 
  const [banners, setBanners] = useState([]); 
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [visibleServices, setVisibleServices] = useState(8);
  
  const [favoriteMap, setFavoriteMap] = useState({}); 
  
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('ALL');

  useEffect(() => { 
      fetchData(); 
  }, [user]); 

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchData = async () => {
    try {
      const favoritesPromise = user ? getFavorites().catch(() => []) : Promise.resolve([]);

      const [resCat, resSer, resFav] = await Promise.all([
          getCategory(), 
          getServices(),
          favoritesPromise
      ]);

      if (resCat.data) setCategories(resCat.data || []);
      
      if (resFav && Array.isArray(resFav)) {
         const map = {};
         resFav.forEach(item => {
             if (item.service?.id) map[item.service.id] = item.id;
         });
         setFavoriteMap(map);
      } else {
         setFavoriteMap({}); 
      }

      if (resSer.data) {
        let svData = resSer.data || [];
        const svWithDiscount = svData.map((s, index) => {
             if (!s.discount && index < 4) return { ...s, discount: 20 + (index * 5) };
             return s;
        });
        setServices(svWithDiscount);
        setHotServices(svWithDiscount.filter(s => s.discount > 0).slice(0, 4));

        const uniqueProvidersMap = new Map();
        svWithDiscount.forEach(item => { if (item.provider?.id) uniqueProvidersMap.set(item.provider.id, item.provider); });
        setProviders(Array.from(uniqueProvidersMap.values()));

        const bannerData = svWithDiscount.filter(s => s.images?.length > 0).slice(0, 3).map(s => ({
            id: s.id, image: s.images?.[0]?.imageUrl, title: s.name, subtitle: s.description || "Trải nghiệm dịch vụ đẳng cấp.", discount: s.discount
        }));
        setBanners(bannerData.length > 0 ? bannerData : [{ id: 0, image: "https://via.placeholder.com/1600x600", title: "BeautyD", subtitle: "Welcome" }]);
      }
    } catch (error) { console.error(error); }
  };

  const nextBanner = () => setCurrentBanner(p => (p + 1) % banners.length);
  const prevBanner = () => setCurrentBanner(p => (p - 1 + banners.length) % banners.length);

  const filteredByCategory = selectedCategoryTab === 'ALL' 
    ? services 
    : services.filter(s => Number(s.categoryId) === Number(selectedCategoryTab));

  const sortedServices = [...filteredByCategory].sort((a, b) => {
      const discountA = a.discount || 0;
      const discountB = b.discount || 0;
      if (discountA > 0 && discountB === 0) return 1;
      if (discountA === 0 && discountB > 0) return -1;
      return 0;
  });

  const finalServicesForYou = sortedServices.slice(0, visibleServices);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* 1. HERO BANNER */}
      {banners.length > 0 && (
        <div className="relative bg-gradient-to-r from-purple-700 to-pink-600 overflow-hidden min-h-[300px] md:min-h-[420px] flex items-center group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-top-right"></div>
          
          {banners.map((banner, index) => (
            <div 
                key={banner.id || index} 
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center ${index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="max-w-7xl mx-auto px-4 md:px-10 w-full flex flex-col-reverse md:flex-row items-center gap-4 md:gap-16">
                  <div className={`w-full md:w-1/2 space-y-3 md:space-y-6 text-white transition-all duration-700 transform ${index === currentBanner ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                      <div className="hidden md:inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30 text-purple-100">
                          ✨ NỀN TẢNG SỐ 1 VIỆT NAM
                      </div>
                      <h1 className="text-xl md:text-5xl font-black leading-tight drop-shadow-md text-center md:text-left">
                          {banner.title}
                      </h1>
                      <p className="hidden md:block text-base md:text-lg text-purple-100 font-medium max-w-lg line-clamp-3">
                          {banner.subtitle}
                      </p>
                      
                      <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                          {banner.id && (
                              <button 
                                onClick={() => navigate(`/service/${banner.id}`)}
                                className="px-6 py-2 md:px-8 md:py-3 bg-white text-purple-900 rounded-full font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2 text-sm md:text-base"
                              >
                                ĐẶT LỊCH <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                              </button>
                          )}
                          {banner.discount > 0 && (
                              <div className="flex flex-col">
                                  <span className="text-[10px] md:text-xs text-purple-300 font-bold uppercase">Ưu đãi</span>
                                  <span className="text-xl md:text-2xl font-black text-yellow-400">-{banner.discount}%</span>
                              </div>
                          )}
                      </div>
                  </div>
                  <div className="w-full md:w-1/2 h-[180px] md:h-[400px] relative flex justify-center md:justify-end">
                      <div className="relative w-full h-full max-w-[280px] md:max-w-lg">
                          <img 
                            src={banner.image} 
                            alt={banner.title} 
                            className="w-full h-full object-cover rounded-[24px] md:rounded-[40px] shadow-2xl border-2 md:border-4 border-white/10" 
                          />
                      </div>
                  </div>
              </div>
            </div>
          ))}
          
          <button onClick={prevBanner} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-purple-900 transition-all z-20"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={nextBanner} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-purple-900 transition-all z-20"><ChevronRight className="w-5 h-5" /></button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-6 space-y-12 md:space-y-16 py-6 md:py-10">
        
        {/* 2. QUICK ACTIONS */}
        <section className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-4 gap-3 md:gap-10 text-center">
            {[
                { label: "Mã ưu đãi", color: "bg-orange-50 text-orange-500", icon: <TicketCheckIcon />, action: () => navigate('/my-coupons')  }, 
                { label: "Gần tôi", color: "bg-blue-50 text-blue-500", icon: <MapPin />, action: () => navigate('/map') }, 
                { label: "Lịch Hẹn", color: "bg-red-50 text-red-500", icon: <Calendar />, action:() => navigate('/bookings')  }, 
                { label: "Yêu thích", color: "bg-pink-50 text-pink-500", icon: <Heart />, action: () => navigate('/favorites') }
            ].map((item, i) => (
              <div key={i} onClick={item.action} className="flex flex-col items-center gap-2 md:gap-3 group cursor-pointer">
                <div className={`${item.color} p-3 md:p-6 rounded-[18px] md:rounded-[24px] shadow-sm group-hover:shadow-lg transition-all border border-white`}>{React.cloneElement(item.icon, { className: "w-5 h-5 md:w-8 md:h-8" })}</div>
                <span className="text-[10px] md:text-sm font-bold text-gray-700 uppercase tracking-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. DANH MỤC */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-xl md:text-2xl font-black text-gray-900">Danh mục dịch vụ</h2><div className="h-1 w-10 bg-purple-600 rounded-full mt-1.5"></div></div>
             {categories.length > 6 && <button onClick={() => setShowAllCategories(!showAllCategories)} className="bg-white border border-gray-200 px-4 py-1.5 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-1 shadow-sm transition-all">{showAllCategories ? "Thu gọn" : "Xem thêm"} <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllCategories ? 'rotate-90' : ''}`} /></button>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{(showAllCategories ? categories : categories.slice(0, 6)).map((cat) => <CategoryCard key={cat.id} category={cat} />)}</div>
        </section>

        {/* 4. KHUYẾN MÃI HOT */}
        {hotServices.length > 0 && (
          <section id="hot-deals-section" className="bg-gradient-to-r from-red-50 to-pink-50 rounded-[24px] p-4 md:p-6 border border-red-100">
             <div className="flex items-center gap-2 mb-6"><div className="p-1.5 bg-red-600 rounded-lg animate-bounce shadow-lg"><Gift className="w-5 h-5 text-white" /></div><h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">Khuyến mãi HOT 🔥</h2></div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {hotServices.map((service) => (
                    <ServiceCard 
                        key={service.id} 
                        service={service} 
                        isHot={true} 
                        initialFavoriteId={favoriteMap[service.id]} 
                    />
                ))}
             </div>
          </section>
        )}

        {/* 5. DỊCH VỤ DÀNH CHO BẠN */}
        <section id="services-for-you">
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
             <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2"><LayoutGrid className="w-6 h-6 text-purple-600" /> Dịch vụ dành cho bạn</h2>
             
             <div className="flex flex-wrap gap-2 w-full md:w-auto">
               <button onClick={() => setSelectedCategoryTab('ALL')} className={`px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${selectedCategoryTab === 'ALL' ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Tất cả</button>
               {categories.map(cat => (
                 <button key={cat.id} onClick={() => setSelectedCategoryTab(cat.id)} className={`px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${selectedCategoryTab === cat.id ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{cat.name}</button>
               ))}
             </div>
           </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {finalServicesForYou.map((service) => (
               <ServiceCard 
                    key={service.id} 
                    service={service} 
                    initialFavoriteId={favoriteMap[service.id]} 
               />
            ))}
          </div>
          
          {sortedServices.length > visibleServices && (
             <div className="mt-10 text-center">
                <button onClick={() => setVisibleServices(prev => prev + 8)} className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-full font-bold hover:border-purple-600 hover:text-purple-600 transition-all text-sm shadow-sm">Xem thêm dịch vụ khác</button>
             </div>
          )}
        </section>

        {/* 6. TOP CỬA HÀNG */}
        {providers.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2"><Store className="w-6 h-6 text-blue-600" /> Top Cửa hàng yêu thích</h2>
              {providers.length > 4 && <button onClick={() => setShowAllProviders(!showAllProviders)} className="text-purple-600 text-xs font-bold flex items-center gap-1">{showAllProviders ? "Thu gọn" : "Xem thêm"} <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllProviders ? 'rotate-90' : ''}`} /></button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{(showAllProviders ? providers : providers.slice(0, 4)).map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
          </section>
        )}

        {/* 7. VÌ SAO CHỌN BEAUTYD */}
        <section className="bg-white py-8 md:py-12 border-t border-gray-100 mt-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-8">Vì sao chọn BeautyD?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { icon: "🎯", title: "Đặt lịch dễ dàng", desc: "Chỉ vài thao tác đơn giản." },
                { icon: "💎", title: "Đối tác uy tín", desc: "1000+ spa chất lượng." },
                { icon: "🎁", title: "Ưu đãi hấp dẫn", desc: "Giảm đến 50% hàng ngày." },
                { icon: "🌟", title: "Dịch vụ đa dạng", desc: "Đáp ứng mọi nhu cầu." }
              ].map((f, i) => (
                <div 
                    key={i} 
                    className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white cursor-pointer"
                >
                  <div className="text-3xl md:text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-800 text-xs md:text-base mb-1">{f.title}</h3>
                  <p className="hidden md:block text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. BANNER ĐĂNG KÝ */}
        <section className="max-w-7xl mx-auto px-2 py-6">
          <div className="bg-gradient-to-r from-purple-700 to-pink-600 rounded-[20px] md:rounded-[30px] p-6 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl md:text-4xl font-black mb-4">Trở thành đối tác BeautyD!</h2>
              <p className="hidden md:block text-purple-100 text-sm md:text-base mb-6 max-w-xl mx-auto opacity-90">Tiếp cận hàng triệu khách hàng và phát triển doanh nghiệp làm đẹp của bạn.</p>
              <button 
                onClick={() => navigate('/register')} 
                className="bg-white text-purple-700 px-6 py-2 md:px-8 md:py-3 rounded-xl font-black text-sm md:text-base hover:bg-gray-100 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
              >
                  ĐĂNG KÝ NGAY
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;