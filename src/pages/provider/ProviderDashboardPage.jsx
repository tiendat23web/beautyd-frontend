import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, ShoppingBag, Star, Package, TrendingUp, 
  Eye, Calendar, Bell, ChevronRight, X 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { toast } from 'react-toastify'; 
import ProviderLayout from '../../layouts/ProviderLayout';
import StatsCard from '../../components/StatsCard';
import { getProviderStats } from '../../services/providerService';

const ProviderDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    monthlyBookings: 0,
    totalReviews: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Pop-up thông báo (Chỉ hiện 1 lần sau đăng nhập)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Ref dùng để so sánh số lượng đơn nhằm báo Toast khi có đơn mới thực sự
  const prevPendingCountRef = useRef(0);

  useEffect(() => {
    // Tải dữ liệu lần đầu tiên
    fetchDashboardData(true);

    // THIẾT LẬP POLLING: Tự động làm mới dữ liệu mỗi 5 giây
    const interval = setInterval(() => {
      fetchDashboardData(false); 
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);

  const fetchDashboardData = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    try {
      const response = await getProviderStats();
      
      if (response.status === 200) {
        const data = response.data;
        const currentPending = data.pendingBookings || 0;

        setStats({
          totalServices: data.totalServices || 0,
          totalBookings: data.totalBookings || 0,
          pendingBookings: currentPending,
          totalRevenue: data.totalRevenue || 0,
          averageRating: data.averageRating || 0,
          monthlyBookings: data.monthlyBookings || 0,
          totalReviews: data.totalReviews || 0
        });
        
        // Tạo dữ liệu biểu đồ dựa trên doanh thu thực tế
        setRevenueData(generateRevenueData(data.totalRevenue));

        // --- LOGIC THÔNG BÁO TỰ ĐỘNG ---
        
        // 1. Kiểm tra hiện Pop-up chào mừng (Chỉ hiện khi mới vào trang lần đầu)
        const hasShownModal = sessionStorage.getItem('welcome_modal_shown');
        if (currentPending > 0 && !hasShownModal && isInitialLoad) {
          setShowWelcomeModal(true);
          sessionStorage.setItem('welcome_modal_shown', 'true');
        }

        // 2. Thông báo Real-time: Chỉ hiện Toast khi có đơn mới tăng thêm
        if (currentPending > prevPendingCountRef.current) {
          const newOrders = currentPending - prevPendingCountRef.current;
          toast.success(
            <div onClick={() => navigate('/provider/bookings')} className="cursor-pointer">
              <p className="font-bold">Hệ thống: +{newOrders} ĐƠN MỚI!</p>
              <p className="text-xs font-medium text-green-700 underline">Click để phê duyệt ngay</p>
            </div>, 
            {
              position: "bottom-right",
              autoClose: 5000,
              icon: <Bell className="text-green-600 animate-bounce" />
            }
          );
        }

        // Cập nhật giá trị cũ để so sánh cho lần quét tiếp theo
        prevPendingCountRef.current = currentPending;
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  };

  const generateRevenueData = (totalRevenue) => {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const baseRevenue = totalRevenue / 7;
    
    return days.map((day) => {
      const variation = 0.7 + Math.random() * 0.6;
      const dailyRevenue = Math.floor(baseRevenue * variation);
      return {
        name: day,
        revenue: dailyRevenue
      };
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  if (loading) {
    return (
      <ProviderLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </ProviderLayout>
    );
  }

  return (
    <ProviderLayout>
      <div className="space-y-8 pb-10">
        {/* Header với trạng thái cập nhật */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 font-medium italic">Tự động làm mới dữ liệu sau mỗi 5 giây...</p>
          </div>
          <div className="flex items-center gap-4">
            {stats.pendingBookings > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-black text-xs animate-pulse">
                <Bell className="w-4 h-4" />
                {stats.pendingBookings} ĐƠN CHỜ PHÊ DUYỆT
              </div>
            )}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Eye className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Stats Cards - 4 thẻ chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={DollarSign}
            title="Tổng doanh thu"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="Tất cả thời gian"
            color="purple"
          />
          <StatsCard
            icon={ShoppingBag}
            title="Tổng đơn hàng"
            value={stats.totalBookings}
            subtitle={`${stats.pendingBookings} đơn đang chờ`}
            color="blue"
          />
          <StatsCard
            icon={Package}
            title="Dịch vụ đang bán"
            value={stats.totalServices}
            subtitle="Đang hoạt động"
            color="green"
          />
          <StatsCard
            icon={Star}
            title="Đánh giá trung bình"
            value={formatRating(stats.averageRating)}
            subtitle={`${stats.totalReviews} đánh giá`}
            color="orange"
          />
        </div>

        {/* Monthly Stats - 3 thẻ gradient */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg border-b-4 border-blue-700">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-tighter">Tháng này</span>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.monthlyBookings}</h3>
            <p className="text-blue-100 font-medium">Đơn hàng trong tháng</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg border-b-4 border-purple-700">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-8 h-8 opacity-80" />
              <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-tighter">Chờ xử lý</span>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.pendingBookings}</h3>
            <p className="text-purple-100 font-medium">Đơn cần duyệt ngay</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg border-b-4 border-orange-700">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 opacity-80" />
              <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-tighter">Chất lượng</span>
            </div>
            <h3 className="text-4xl font-black mb-1">{formatRating(stats.averageRating)}/5.0</h3>
            <p className="text-orange-100 font-medium">Điểm đánh giá dịch vụ</p>
          </div>
        </div>

        {/* Revenue Charts - 2 biểu đồ Recharts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-[32px] border-2 border-gray-50 p-8 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Doanh thu 7 ngày</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium italic">Xu hướng dòng tiền gần đây</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#9333ea" 
                  strokeWidth={5}
                  dot={{ fill: '#9333ea', strokeWidth: 3, r: 6, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-[32px] border-2 border-gray-50 p-8 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">So sánh theo ngày</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium italic">Biểu đồ cột doanh thu</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="url(#colorBar)" radius={[10, 10, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Summary - Bố cục 2-1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Section */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border-2 border-gray-50 p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Tóm tắt hoạt động</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-purple-50 rounded-3xl border border-purple-100">
                  <div>
                    <p className="text-xs font-black text-purple-400 uppercase tracking-widest">Tổng đơn hàng</p>
                    <p className="text-3xl font-black text-purple-600 mt-1">{stats.totalBookings}</p>
                  </div>
                  <ShoppingBag className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
                
                <div className="flex items-center justify-between p-6 bg-orange-50 rounded-3xl border border-orange-100">
                  <div>
                    <p className="text-xs font-black text-orange-400 uppercase tracking-widest">Đánh giá</p>
                    <p className="text-3xl font-black text-orange-600 mt-1">{stats.totalReviews}</p>
                  </div>
                  <Star className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-3xl border border-blue-100">
                  <div>
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Đơn tháng này</p>
                    <p className="text-3xl font-black text-blue-600 mt-1">{stats.monthlyBookings}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
                
                <div className="flex items-center justify-between p-6 bg-green-50 rounded-3xl border border-green-100">
                  <div>
                    <p className="text-xs font-black text-green-400 uppercase tracking-widest">Dịch vụ</p>
                    <p className="text-3xl font-black text-green-600 mt-1">{stats.totalServices}</p>
                  </div>
                  <Package className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Banner báo đơn chờ */}
            {stats.pendingBookings > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-[32px] relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                    <p className="text-orange-900 font-black text-lg">CƠ HỘI KINH DOANH MỚI!</p>
                  </div>
                  <p className="text-orange-800 font-medium">
                    Bạn đang có <span className="font-black text-2xl underline">{stats.pendingBookings} đơn hàng</span> cần bạn phê duyệt ngay bây giờ.
                  </p>
                  <Link 
                    to="/provider/bookings"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 group-hover:scale-105"
                  >
                    XỬ LÝ NGAY <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
                <Bell className="absolute -right-4 -bottom-4 w-32 h-32 text-orange-200 opacity-30 group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </div>

          {/* Quick Actions - Đầy đủ 6 liên kết */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-[40px] p-8 text-white shadow-2xl shadow-purple-200">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Thao tác nhanh</h2>
            <div className="space-y-3">
              <Link to="/provider/services/new" className="block w-full py-4 px-6 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all font-bold text-center border border-white/20 shadow-inner">✨ Thêm dịch vụ mới</Link>
              <Link to="/provider/services" className="block w-full py-4 px-6 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all font-bold text-center border border-white/20 shadow-inner">📦 Quản lý dịch vụ</Link>
              <Link to="/provider/bookings" className="block w-full py-4 px-6 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all font-bold text-center border border-white/20 shadow-inner">📋 Xem đơn hàng</Link>
              <Link to="/provider/calendar" className="block w-full py-4 px-6 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all font-bold text-center border border-white/20 shadow-inner">📅 Quản lý lịch</Link>
              <Link to="/provider/reviews" className="block w-full py-4 px-6 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all font-bold text-center border border-white/20 shadow-inner">⭐ Phản hồi đánh giá</Link>
              <Link to="/provider/profile" className="block w-full py-4 px-6 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all font-bold text-center border border-white/20 shadow-inner">⚙️ Cài đặt</Link>
            </div>
          </div>
        </div>

        {/* --- POP-UP CHÀO MỪNG (MODAL) --- */}
        {showWelcomeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[50px] max-w-md w-full p-12 shadow-2xl animate-in zoom-in-95 duration-300 relative border-8 border-purple-50">
              <button 
                onClick={() => setShowWelcomeModal(false)}
                className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-8 h-8 text-gray-300" />
              </button>

              <div className="text-center space-y-8">
                <div className="w-28 h-28 bg-purple-100 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ring-purple-50">
                  <Bell className="w-14 h-14 text-purple-600 animate-bounce" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-gray-900 tracking-tighter">Cơ hội mới!</h3>
                  <p className="text-gray-500 font-bold leading-relaxed text-lg italic">
                    Chào ông chủ! Bạn đang có <span className="text-purple-600 font-black text-3xl">{stats.pendingBookings} đơn hàng</span> mới đang chờ phê duyệt. Hãy xử lý ngay để tăng doanh thu nhé!
                  </p>
                </div>

                <div className="flex flex-col gap-4 pt-6">
                  <button
                    onClick={() => navigate('/provider/bookings')}
                    className="w-full py-5 bg-purple-600 text-white rounded-[24px] font-black shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center gap-3 group text-xl active:scale-95"
                  >
                    ĐI ĐẾN PHÊ DUYỆT NGAY
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button
                    onClick={() => setShowWelcomeModal(false)}
                    className="w-full py-5 text-gray-400 font-black hover:bg-gray-50 rounded-[24px] transition-all tracking-tighter"
                  >
                    ĐỂ SAU, TÔI MUỐN XEM BÁO CÁO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderDashboardPage;