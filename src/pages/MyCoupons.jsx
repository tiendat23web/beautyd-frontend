import React, { useEffect, useState } from 'react';
import discountService from '../services/discountService';
import { toast } from 'react-toastify';
import { Gift, Copy, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react'; // Thêm icon ArrowLeft
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const MyCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requireAuth, setRequireAuth] = useState(false);
  
  const navigate = useNavigate(); // Khởi tạo hook điều hướng

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await discountService.getMyCoupons();
      if (data.requireVerification) {
        setRequireAuth(true); 
      } else {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error("Lỗi tải mã:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // Dùng toast sẽ đẹp hơn alert
    if (toast) toast.success(`Đã sao chép mã: ${code}`);
    else alert(`Đã sao chép mã: ${code}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            <p className="text-gray-500 font-medium">Đang tải kho ưu đãi...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* --- NÚT QUAY LẠI TRANG CHỦ --- */}
      <div className="max-w-7xl mx-auto px-4 pt-6 mb-2">
        <button 
            onClick={() => navigate('/')} 
            className="group flex items-center gap-2 text-gray-500 hover:text-purple-700 font-bold transition-all px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm"
        >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
        </button>
      </div>

      {/* 1. BANNER HEADER */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-purple-700 to-pink-600 rounded-[20px] md:rounded-[30px] p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            {/* Họa tiết trang trí nền */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-top-right pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm shadow-inner">
                    <Gift className="w-8 h-8 text-yellow-300" />
                </div>
                <h1 className="text-2xl md:text-4xl font-black mb-3 drop-shadow-sm">Kho Ưu Đãi Của Bạn</h1>
                <p className="text-purple-100 text-sm md:text-base max-w-2xl mx-auto opacity-95">
                   Danh sách các mã giảm giá độc quyền dành riêng cho bạn. <br className="hidden md:block"/>
                   Hãy lưu lại và sử dụng ngay để trải nghiệm dịch vụ với giá tốt nhất!
                </p>
            </div>
        </div>
      </section>

      {/* 2. DANH SÁCH MÃ */}
      <div className="container mx-auto px-4 max-w-5xl mt-6">
        
        {requireAuth ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl shadow-sm mb-6 flex items-start gap-4 animate-fadeIn">
             <div className="p-2 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
             </div>
             <div>
                <h3 className="text-yellow-800 font-bold text-lg">Vui lòng xác thực Email!</h3>
                <p className="text-yellow-700 mt-1 text-sm">Bạn cần xác thực email để nhận các mã giảm giá độc quyền hàng tuần từ hệ thống.</p>
                <button 
                    onClick={() => navigate('/profile')}
                    className="mt-3 text-sm font-bold text-yellow-700 underline hover:text-yellow-900"
                >
                    Đến trang cá nhân để xác thực &rarr;
                </button>
             </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {coupons.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-gray-800 font-bold text-lg">Chưa có mã giảm giá nào</h3>
                <p className="text-gray-500 text-sm mt-1">Hiện tại chưa có ưu đãi dành riêng cho bạn. Hãy quay lại sau nhé!</p>
                <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors">
                    Khám phá dịch vụ ngay
                </button>
              </div>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon.id} className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex overflow-hidden relative h-full">
                  
                  {/* Phần Trái: Vé Giảm Giá */}
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-28 md:w-32 flex flex-col items-center justify-center p-3 relative">
                    <span className="text-2xl md:text-3xl font-black tracking-tighter">
                      {coupon.discountType === 'PERCENT' ? `${coupon.value}%` : `${(coupon.value / 1000)}K`}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold uppercase opacity-90 mt-1 bg-white/20 px-2 py-0.5 rounded">GIẢM</span>
                    
                    {/* Họa tiết răng cưa vé */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-gray-200"></div>
                  </div>

                  {/* Phần Phải: Thông tin chi tiết */}
                  <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-purple-700 transition-colors mb-2">
                        {coupon.description || 'Mã giảm giá đặc biệt'}
                      </h3>
                      <div className="space-y-1.5">
                         <p className="text-xs text-gray-500 flex items-center gap-1.5">
                           📅 <span className="font-medium text-gray-600">HSD: {new Date(coupon.endDate).toLocaleDateString('vi-VN')}</span>
                         </p>
                         <p className="text-xs text-gray-500 flex items-center gap-1.5">
                           🛒 <span className="font-medium text-gray-600">Đơn tối thiểu: {coupon.minOrder > 0 ? `${coupon.minOrder.toLocaleString()}đ` : '0đ'}</span>
                         </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between bg-gray-50 p-2 pl-3 rounded-xl border border-dashed border-gray-200 group-hover:border-purple-200 transition-colors">
                      <span className="font-mono font-bold text-purple-700 tracking-wider text-sm md:text-base">{coupon.code}</span>
                      <button 
                        onClick={() => copyToClipboard(coupon.code)}
                        className="flex items-center gap-1.5 text-xs bg-white border border-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <Copy className="w-3.5 h-3.5" /> Sao chép
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
         .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default MyCoupons;