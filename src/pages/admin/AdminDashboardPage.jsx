import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, DollarSign, ClipboardList, FileCheck, TrendingUp, Bell, ChevronRight, X, Eye } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getDashboardStats } from '../../services/adminService';
import { toast } from 'react-toastify';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    revenue: 0,
    pendingKYC: 0
  });
  const [loading, setLoading] = useState(true);
  const [showKYCModal, setShowKYCModal] = useState(false);
  
  // Ref để theo dõi số lượng KYC cũ nhằm báo Toast khi có người mới gửi yêu cầu
  const prevKYCCountRef = useRef(0);

  useEffect(() => {
    fetchStats(true);

    // THIẾT LẬP POLLING 5 GIÂY: Tự động cập nhật số liệu
    const interval = setInterval(() => {
      fetchStats(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getDashboardStats();
      const currentPendingKYC = data.pendingKYC || 0;

      setStats(data); // GIỮ NGUYÊN logic set stats của ông

      // --- LOGIC BỔ SUNG ---
      const hasShownModal = sessionStorage.getItem('admin_welcome_shown');
      if (currentPendingKYC > 0 && !hasShownModal && isInitial) {
        setShowKYCModal(true);
        sessionStorage.setItem('admin_welcome_shown', 'true');
      }

      if (currentPendingKYC > prevKYCCountRef.current) {
        toast.error(
          <div onClick={() => navigate('/admin/kyc')} className="cursor-pointer">
            <p className="font-black">PHÁT HIỆN KYC MỚI!</p>
            <p className="text-xs">Có Provider vừa gửi hồ sơ xác thực.</p>
          </div>,
          { position: "top-right", autoClose: 6000, icon: <FileCheck className="animate-bounce" /> }
        );
      }
      prevKYCCountRef.current = currentPendingKYC;
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // GIỮ NGUYÊN danh sách card của ông
  const statCards = [
    { title: 'TỔNG USER', value: stats.totalUsers, icon: Users, color: 'from-blue-600 to-cyan-500', path: '/admin/users?role=USER' },
    { title: 'ĐỐI TÁC', value: stats.totalProviders, icon: TrendingUp, color: 'from-purple-600 to-pink-500', path: '/admin/users?role=PROVIDER' },
    { title: 'BOOKINGS', value: stats.totalBookings, icon: ClipboardList, color: 'from-green-600 to-emerald-500', path: '#' },
    { title: 'DOANH THU', value: formatPrice(stats.revenue), icon: DollarSign, color: 'from-orange-600 to-amber-500', path: '#' },
    { title: 'CHỜ DUYỆT', value: stats.pendingKYC, icon: FileCheck, color: 'from-red-600 to-rose-500', path: '/admin/kyc' }
  ];

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Hệ thống Quản trị</h1>
            <p className="text-gray-500 font-medium italic">Dữ liệu tự động cập nhật mỗi 5 giây...</p>
          </div>
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 relative group cursor-pointer">
            <Bell className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
            {stats.pendingKYC > 0 && <span className="absolute top-2 right-2 w-3 h-3 bg-red-600 border-2 border-white rounded-full animate-ping"></span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} onClick={() => card.path !== '#' && navigate(card.path)} className="bg-white rounded-[32px] border-2 border-gray-50 p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform mb-6`}><Icon className="w-7 h-7 text-white" /></div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1">{card.title}</h3>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-[40px] border-2 border-gray-50 p-8 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6">Phê duyệt nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button onClick={() => navigate('/admin/kyc')} className="flex items-center justify-between p-6 bg-red-50 rounded-3xl group hover:bg-red-600 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white rounded-2xl shadow-sm"><FileCheck className="w-6 h-6 text-red-600" /></div>
                         <div className="text-left">
                            <p className="font-black text-red-900 group-hover:text-white transition-colors uppercase">Duyệt KYC</p>
                            <p className="text-xs text-red-600 group-hover:text-red-100 transition-colors">{stats.pendingKYC} hồ sơ đang đợi</p>
                         </div>
                      </div>
                      <ChevronRight className="text-red-300 group-hover:text-white" />
                   </button>
                   <button onClick={() => navigate('/admin/users')} className="flex items-center justify-between p-6 bg-blue-50 rounded-3xl group hover:bg-blue-600 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white rounded-2xl shadow-sm"><Users className="w-6 h-6 text-blue-600" /></div>
                         <div className="text-left">
                            <p className="font-black text-blue-900 group-hover:text-white transition-colors uppercase">Quản lý User</p>
                            <p className="text-xs text-blue-600 group-hover:text-blue-100 transition-colors">Kiểm soát tài khoản</p>
                         </div>
                      </div>
                      <ChevronRight className="text-blue-300 group-hover:text-white" />
                   </button>
                </div>
             </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
             <TrendingUp className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
             <h2 className="text-xl font-black uppercase mb-6 relative z-10">Báo cáo hệ thống</h2>
             <div className="space-y-6 relative z-10">
                <div className="pb-6 border-b border-white/10">
                   <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Tăng trưởng tháng</p>
                   <p className="text-3xl font-black mt-1">+12.5%</p>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-gray-400 font-medium italic text-sm">Sắp có thêm thống kê...</span>
                   <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black">2026</span>
                </div>
             </div>
          </div>
        </div>

        {showKYCModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[50px] max-w-md w-full p-12 shadow-2xl animate-in zoom-in-95 duration-300 relative border-8 border-red-50 text-center">
              <button onClick={() => setShowKYCModal(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full"><X className="w-8 h-8 text-gray-300" /></button>
              <div className="w-28 h-28 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-red-50"><FileCheck className="w-14 h-14 text-red-600 animate-pulse" /></div>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Duyệt KYC ngay!</h3>
              <p className="text-gray-500 font-bold text-lg mb-8 leading-relaxed">Hệ thống đang có <span className="text-red-600 font-black text-3xl">{stats.pendingKYC} hồ sơ</span> mới chờ xác thực.</p>
              <button onClick={() => navigate('/admin/kyc')} className="w-full py-5 bg-red-600 text-white rounded-[24px] font-black shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 group text-xl active:scale-95">ĐI ĐẾN TRANG DUYỆT <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;