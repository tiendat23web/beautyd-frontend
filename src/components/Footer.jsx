import React from 'react';
import { Facebook, Instagram, Youtube, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-16 bg-gray-900 text-gray-300 border-t border-gray-800">
      
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* ĐÃ SỬA: grid-cols-2 (cho mobile) thay vì grid-cols-1, giảm gap-10 xuống gap-8 cho thoáng hơn trên mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          
          {/* PHẦN 1: THƯƠNG HIỆU */}
          {/* ĐÃ SỬA: Thêm col-span-2 để phần này luôn chiếm full chiều rộng ở hàng đầu tiên trên mobile */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            {/* Logo & Tên */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-black text-xl">B</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">BeautyD</span>
            </div>

            {/* Slogan / Mô tả */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Nền tảng đặt lịch làm đẹp hàng đầu Việt Nam. Kết nối bạn với hàng ngàn Spa, Salon uy tín chỉ với một chạm. Trải nghiệm ngay!
            </p>
            
            {/* Địa chỉ có Map Icon & Link */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=144+Cửu+Long,+Phường+2,+Quận+Tân+Bình,+TP.+Hồ+Chí+Minh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-gray-400 text-sm leading-relaxed max-w-sm hover:text-purple-400 transition-colors group"
            >
              <MapPin className="w-5 h-5 flex-shrink-0 text-purple-500 group-hover:text-purple-400 mt-0.5" />
              <span>144 Cửu Long, Phường 2, Quận Tân Bình, TP. Hồ Chí Minh.</span>
            </a>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* PHẦN 2: LIÊN KẾT 1 - Tự động nằm bên trái ở hàng thứ 2 */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wide">Về BeautyD</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-purple-400 hover:pl-1 transition-all block">Giới thiệu</Link></li>
              <li><Link to="/" className="hover:text-purple-400 hover:pl-1 transition-all block">Điều khoản sử dụng</Link></li>
              <li><Link to="/" className="hover:text-purple-400 hover:pl-1 transition-all block">Chính sách bảo mật</Link></li>
              <li><Link to="/" className="hover:text-purple-400 hover:pl-1 transition-all block">Quy chế hoạt động</Link></li>
            </ul>
          </div>

          {/* PHẦN 3: LIÊN KẾT 2 - Tự động nằm bên phải ở hàng thứ 2 */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wide">Hỗ trợ</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-purple-400 hover:pl-1 transition-all block">Trung tâm trợ giúp</Link></li>
              <li><Link to="/" className="hover:text-purple-400 hover:pl-1 transition-all block">Hướng dẫn đặt lịch</Link></li>
              <li><Link to="/" className="hover:text-purple-400 hover:pl-1 transition-all block">Chính sách hoàn tiền</Link></li>
              <li><Link to="/" className="hover:text-purple-400 hover:pl-1 transition-all block">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="border-t border-gray-800 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-medium">
            © 2026 BeautyD. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>Developed by Tiến Đạt</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;