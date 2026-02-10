import React, { useState, useEffect, useCallback } from "react";
import { 
  Crosshair, X, ChevronLeft, MapPin, Search, Star, 
  Navigation, Phone, Clock, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const navigate = useNavigate();
  
  // States
  const [activeFilter, setActiveFilter] = useState("Spa");
  const [location, setLocation] = useState({ lat: 10.9447, lng: 106.8243 }); // Mặc định Biên Hòa
  const [isLocating, setIsLocating] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null); // Lưu tiệm đang được chọn để xem info
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const filters = ["Spa", "Nail", "Salon", "Nha khoa", "Thẩm mỹ viện", "Massage"];

  // Dữ liệu tiệm mẫu để test chức năng Click xem Info và Chỉ đường
  const demoShops = [
    { 
        id: 1, name: "THUỶ Spa & Clinic", category: "Spa", 
        lat: 10.9450, lng: 106.8250, rating: 5.0, 
        address: "Gia Kiệm, Thống Nhất, Đồng Nai", phone: "1900 6483", 
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400" 
    },
    { 
        id: 2, name: "NGỌC BEAUTY SKIN", category: "Nail", 
        lat: 10.9460, lng: 106.8260, rating: 4.8, 
        address: "193 Trần Phú, Biên Hòa", phone: "0901 234 567", 
        image: "https://images.unsplash.com/photo-1632345031136-052748b043ce?q=80&w=400" 
    },
  ];

  // 1. Logic lấy vị trí hiện tại chính xác
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị!");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const myPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(myPos);
        setIsLocating(false);
        // Khi định vị xong, tự động tìm kiếm Spa quanh vị trí mới
        console.log("Đã cập nhật vị trí thiết bị:", myPos);
      },
      (error) => {
        setIsLocating(false);
        alert("Vui lòng bật GPS và cho phép truy cập vị trí!");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // 2. Logic mở Google Maps để chỉ đường
  const handleGetDirections = (shop) => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`;
    window.open(directionsUrl, "_blank");
  };

  // 3. URL Bản đồ (Cập nhật theo vị trí và filter)
  const getMapUrl = () => {
    const query = encodeURIComponent(`${activeFilter} gần đây`);
    // Thêm tham số q để hiện các ghim đỏ tự động của Google
    return `https://www.google.com/maps?q=${query}&ll=${location.lat},${location.lng}&z=16&output=embed&hl=vi`;
  };

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden relative font-sans select-none flex">
      
      {/* SIDEBAR DANH SÁCH BÊN TRÁI */}
      <div 
        className={`bg-white shadow-2xl z-30 transition-all duration-300 flex flex-col border-r border-gray-200 ${
          isSidebarCollapsed ? "w-0 overflow-hidden" : "w-[380px]"
        }`}
      >
        <div className="p-5 border-b border-gray-100">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-purple-600 font-black text-sm uppercase mb-4 hover:opacity-70 transition-all">
            <ChevronLeft className="w-5 h-5" /> Quay lại trang chủ
          </button>
          <div className="bg-gray-50 rounded-2xl flex items-center px-4 py-3 border border-gray-200 shadow-inner">
            <input type="text" placeholder="Tìm kiếm tiệm..." className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-700" />
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {demoShops.map((shop) => (
            <div 
              key={shop.id} 
              onClick={() => {
                setSelectedShop(shop);
                setLocation({ lat: shop.lat, lng: shop.lng });
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center group ${
                selectedShop?.id === shop.id ? "bg-purple-600 border-purple-600 shadow-purple-200 shadow-lg" : "bg-white border-gray-100 hover:bg-purple-50"
              }`}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0 border-2 border-white">
                <img src={shop.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-black text-sm truncate uppercase ${selectedShop?.id === shop.id ? "text-white" : "text-gray-800"}`}>{shop.name}</h3>
                <div className={`flex items-center gap-1 mt-1 ${selectedShop?.id === shop.id ? "text-purple-100" : "text-gray-400"}`}>
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  <span className="text-[10px] font-black">{shop.rating} • {shop.category}</span>
                </div>
              </div>
              <ChevronRight className={selectedShop?.id === shop.id ? "text-white" : "text-gray-300"} />
            </div>
          ))}
          <div className="p-10 text-center text-gray-400 text-xs italic font-medium">
             Đang hiển thị các ghim {activeFilter} quanh bạn trên bản đồ...
          </div>
        </div>
      </div>

      {/* KHU VỰC BẢN ĐỒ BÊN PHẢI */}
      <div className="flex-1 relative">
        {/* Nút đóng mở Sidebar */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-1/2 left-0 -translate-y-1/2 z-40 bg-purple-600 p-1 rounded-r-lg shadow-lg text-white"
        >
          {isSidebarCollapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
        </button>

        {/* Thanh lọc trên đầu bản đồ */}
        <div className="absolute top-5 left-10 right-10 z-20 flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto">
          {filters.map((f) => (
            <button 
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setSelectedShop(null);
              }}
              className={`px-6 py-2.5 rounded-full shadow-xl text-xs font-black uppercase transition-all whitespace-nowrap border-2 ${
                activeFilter === f 
                ? 'bg-purple-600 text-white border-purple-600 scale-105' 
                : 'bg-white text-gray-600 border-white hover:border-purple-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* THẺ THÔNG TIN CHI TIẾT (Hiện khi chọn tiệm) */}
        {selectedShop && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-[350px] bg-white rounded-[30px] shadow-2xl p-5 border border-purple-100 animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setSelectedShop(null)} className="absolute top-4 right-4 p-1 bg-gray-100 rounded-full text-gray-500"><X size={16}/></button>
            <div className="flex gap-4">
              <img src={selectedShop.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt="" />
              <div className="flex-1">
                <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">{selectedShop.category}</span>
                <h2 className="font-black text-gray-800 text-lg leading-tight mt-1">{selectedShop.name}</h2>
                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-black text-gray-600">{selectedShop.rating}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <MapPin size={14} className="text-purple-500 shrink-0"/> <span className="truncate">{selectedShop.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Phone size={14} className="text-purple-500 shrink-0"/> <span>{selectedShop.phone}</span>
              </div>
            </div>
            <button 
              onClick={() => handleGetDirections(selectedShop)}
              className="w-full mt-5 bg-purple-600 text-white py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
            >
              <Navigation size={18} /> BẮT ĐẦU CHỈ ĐƯỜNG
            </button>
          </div>
        )}

        {/* NÚT ĐỊNH VỊ CỦA TÔI */}
        <div className="absolute bottom-10 right-6 z-20 flex flex-col gap-3">
          <button 
            onClick={getCurrentLocation}
            className={`w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-all border-2 border-white active:scale-90 ${isLocating ? 'animate-spin' : ''}`}
          >
            <Crosshair size={28} />
          </button>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Vị trí của bạn</p>
              <p className="text-[11px] font-black text-gray-800">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
          </div>
        </div>

        {/* IFRAME BẢN ĐỒ */}
        <iframe
          title="Google Map Search"
          className="w-full h-full border-0 z-0"
          src={getMapUrl()}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MapPage;