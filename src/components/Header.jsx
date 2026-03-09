import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Heart,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  History,
  ChevronDown,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { searchServices } from "../services/servicesService";

import NotificationCenterEnhanced from "./NotificationCenter/NotificationCenterEnhanced";

const Header = () => {
  // --- STATE ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // --- REFS ---
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // --- AUTH ---
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // --- HÀM XỬ LÝ CUỘN TRANG (MỚI) ---
  const handleScrollToSection = (sectionId) => {
    // Đóng menu mobile trước (nếu đang mở)
    setIsMenuOpen(false);

    // Kiểm tra xem có đang ở trang chủ không
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
  
      navigate("/");
   
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500); 
    }
  };

  // Search services using API
  const fetchSearchSuggestions = async (query) => {
    try {
      const response = await searchServices(query);
      if (response.status === 200) {
        return response.data.map((service) => ({
          id: service.id,
          name: service.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };

  const handleSuggestionClick = useCallback(
    (suggestion, e) => {
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      if (!suggestion?.id) {
        console.warn("⚠️ Dịch vụ không có ID hợp lệ:", suggestion);
        return;
      }

      setShowSearchSuggestions(false);
      setSearchQuery("");
      setIsSearchExpanded(false);
      navigate(`/service/${suggestion.id}`);
    },
    [navigate],
  );

  // Handle search with debounce
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      setShowSearchSuggestions(true);
      setIsSearching(true);
    } else {
      setShowSearchSuggestions(false);
      setSearchSuggestions([]);
      setIsSearching(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await fetchSearchSuggestions(value);
        setSearchSuggestions(results);
        setIsSearching(false);
      } catch (error) {
        console.error("Search error:", error);
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setShowSearchSuggestions(false);
    setIsSearchExpanded(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearchSubmit(searchQuery);
    }
  };

  // --- LOGIC HIỂN THỊ AVATAR (MỚI) ---
  const renderUserAvatar = () => {
    // Ưu tiên hiển thị ảnh thật nếu có
    if (user?.avatar) {
      return (
        <img 
          src={user.avatar} 
          alt="User Avatar" 
          className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border-2 border-white shadow-sm"
        />
      );
    }

    // Nếu không có ảnh, hiển thị chữ cái đầu (Logic cũ)
    const names = user?.fullName ? user.fullName.split(" ") : ["U"];
    const initials = names.length >= 2 
      ? names[0][0] + names[names.length - 1][0] 
      : names[0][0];
    
    return (
      <div className="w-7 h-7 md:w-8 md:h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 border-white shadow-sm">
        {initials}
      </div>
    );
  };

  const handleLocationClick = () => {
    navigate('/map');
  };

  return (
    // Sử dụng 'relative' để Header không trôi theo chuột khi lăn
    <header className="bg-white shadow-md z-50 relative" ref={searchRef}>
      
      {/* Top Bar - Compact Style */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            <a 
              href="tel:19006483"
              className="flex items-center gap-1.5 md:gap-2 hover:text-purple-200 transition-colors"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base font-medium">1900 6483</span>
            </a>
            <a 
              href="mailto:support@beautyD.vn"
              className="hidden md:flex items-center gap-2 hover:text-purple-200 transition-colors"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base font-medium">support@beautyD.vn</span>
            </a>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Social Icons - ĐÃ CHỈNH MÀU HOVER */}
            <div className="hidden md:flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {!isAuthenticated ? (
              <>
                <button
                  className="hover:text-purple-200 transition-colors text-sm md:text-base font-semibold"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </button>
                <button
                  className="bg-white text-purple-600 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold hover:bg-purple-50 transition-colors shadow-md"
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </button>
              </>
            ) : (
              // =======================================================
              // 👇 MENU USER: AVATAR TRƯỚC - CHUÔNG SAU
              // =======================================================
              <div className="flex items-center gap-4">
                
                {/* 1. User Avatar & Dropdown (Bên trái) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-purple-700/50 px-2 py-1.5 rounded-full transition-colors"
                  >
                    {/* Gọi hàm render avatar mới */}
                    {renderUserAvatar()}
                    
                    <span className="hidden md:block font-medium text-sm">
                      {user?.fullName || "User"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100] text-gray-800">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-800 text-sm">{user?.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Thông tin cá nhân
                        </Link>
                        
                        <Link
                          to="/favorites"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Yêu thích 
                        </Link>
                        
                        <Link
                          to="/bookings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                        >
                          <History className="w-4 h-4" />
                          Lịch sử đặt chỗ
                        </Link>

                        <Link
                          to="/messages"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Tin nhắn
                        </Link>

                        {/* Menu đặc biệt cho PROVIDER */}
                        {user?.role === 'PROVIDER' && (
                          <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <Link
                              to="/provider/dashboard"
                              onClick={() => setIsDropdownOpen(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 text-sm text-purple-700 font-semibold transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Bảng quản trị Provider
                            </Link>
                          </>
                        )}

                        {/* Menu đặc biệt cho ADMIN */}
                        {user?.role === 'ADMIN' && (
                          <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setIsDropdownOpen(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-orange-50 flex items-center gap-3 text-sm text-orange-700 font-semibold transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              Bảng quản trị Admin
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                            navigate("/");
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Notification Bell (Bên phải - sau Avatar) */}
                <NotificationCenterEnhanced />

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl md:text-2xl">B</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              BeautyD
            </h1>
          </Link>

          {/* Search Bar Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm dịch vụ làm đẹp..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setShowSearchSuggestions(true);
                  }
                }}
                className="w-full pl-12 pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all text-sm md:text-base font-medium shadow-sm"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() =>
                  searchQuery.trim() && handleSearchSubmit(searchQuery)
                }
              />

              {/* Suggestions Dropdown */}
              {showSearchSuggestions && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                  <div className="p-2">
                    {isSearching ? (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        Đang tìm kiếm...
                      </div>
                    ) : searchSuggestions.length > 0 ? (
                      <>
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2 px-3">
                          Kết quả tìm kiếm
                        </div>
                        {searchSuggestions.map((suggestion, idx) => (
                          <button
                            key={suggestion.id || idx}
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              e.stopPropagation();
                              handleSuggestionClick(suggestion, e);
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-3 group cursor-pointer"
                          >
                            <Search className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                              {suggestion.name}
                            </span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        Không tìm thấy kết quả
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={handleLocationClick}
              className="hidden md:flex flex-col items-center text-gray-600 hover:text-purple-600 transition-all hover:scale-105"
            >
              <MapPin className="w-6 h-6" />
              <span className="text-xs mt-1 font-semibold">Địa điểm</span>
            </button>

            <button
              className="md:hidden p-2 rounded-lg bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-purple-600" />
              ) : (
                <Menu className="w-6 h-6 text-purple-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search - Compact Icon that Expands */}
        <div className="md:hidden mt-3">
          {!isSearchExpanded ? (
            <div className="flex justify-start">
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-200 rounded-full text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setShowSearchSuggestions(true);
                  }
                }}
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 border-2 border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm font-medium"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                onClick={() => {
                  setIsSearchExpanded(false);
                  setSearchQuery("");
                  setShowSearchSuggestions(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Mobile Search Suggestions */}
              {showSearchSuggestions && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                  <div className="p-2">
                    {isSearching ? (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        Đang tìm kiếm...
                      </div>
                    ) : searchSuggestions.length > 0 ? (
                      <>
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2 px-3">
                          Kết quả tìm kiếm
                        </div>
                        {searchSuggestions.map((suggestion, idx) => (
                          <button
                            key={suggestion.id || idx}
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              e.stopPropagation();
                              handleSuggestionClick(suggestion, e);
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-3 group cursor-pointer"
                          >
                            <Search className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                              {suggestion.name}
                            </span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        Không tìm thấy kết quả
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. NAVIGATION (Đã tích hợp Scroll to Section và Fix size chữ) */}
      <nav className="border-t border-gray-100 hidden md:block bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8 lg:gap-12 py-4 overflow-x-auto no-scrollbar text-sm md:text-base font-medium">
            <Link
              to="/"
              className="text-purple-600 hover:text-purple-700 whitespace-nowrap transition-colors"
            >
              Trang chủ
            </Link>
            
            {/* 👇 DÙNG BUTTON ĐỂ XỬ LÝ SCROLL */}
            <button
              onClick={() => handleScrollToSection('hot-deals-section')}
              className="text-gray-600 hover:text-purple-600 whitespace-nowrap transition-colors bg-transparent border-none cursor-pointer"
            >
              Khuyến mãi HOT
            </button>
            
            <button
              onClick={() => handleScrollToSection('services-for-you')}
              className="text-gray-600 hover:text-purple-600 whitespace-nowrap transition-colors bg-transparent border-none cursor-pointer"
            >
               Dịch vụ nổi bật 
            </button>
            
            <Link
              to="/"
              className="text-gray-600 hover:text-purple-600 whitespace-nowrap transition-colors"
            >
              Cộng Đồng
            </Link>
            <Link
              to="/blog"
              className="text-gray-600 hover:text-purple-600 whitespace-nowrap transition-colors"
            >
              Blog làm đẹp
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[140px] bg-white z-[60] overflow-y-auto">
          <nav className="px-6 py-6 space-y-4">
            <Link
              to="/"
              className="block text-base font-medium text-purple-600 border-b border-purple-100 pb-3"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            
            <button 
              onClick={() => handleScrollToSection('hot-deals-section')}
              className="block text-base font-medium text-gray-700 pb-2 w-full text-left bg-transparent border-none"
            >
              Khuyến mãi HOT
            </button>
            
            <button 
              onClick={() => handleScrollToSection('services-for-you')}
              className="block text-base font-medium text-gray-700 pb-2 w-full text-left bg-transparent border-none"
            >
              Dịch vụ nổi bật
            </button>
            
            <Link 
              to="/blog" 
              className="block text-base font-medium text-gray-700 pb-2" 
              onClick={() => setIsMenuOpen(false)}
            >
              Blog làm đẹp
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;