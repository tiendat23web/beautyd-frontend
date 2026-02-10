import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle, Search, Filter, Clock, User, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getAllUsers, banUser, unbanUser } from '../../services/adminService';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'ban' or 'unban'
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // XỬ LÝ LỖI LỌC: Chuyển 'ALL' về rỗng để Backend hiểu là lấy tất cả
      const apiRole = roleFilter === 'ALL' ? '' : roleFilter;
      const apiStatus = statusFilter === 'ALL' ? '' : statusFilter;
      
      const data = await getAllUsers(page, 20, apiRole, apiStatus);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Fetch users error:', error);
      setUsers([]);
      toast.error('Không thể tải danh sách user');
    } finally {
      setLoading(false);
    }
  };

  // LOGIC MỚI: Tính số ngày hoạt động dựa trên ngày tạo tài khoản
  const calculateDaysActive = (createdAt) => {
    if (!createdAt) return "N/A";
    const start = new Date(createdAt);
    const today = new Date();
    
    // Tính toán khoảng cách ngày
    const diffInMs = today - start;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) return "Mới tham gia";
    return `${diffInDays} ngày hoạt động`;
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setModalAction('ban');
    setShowConfirmModal(true);
  };

  const openUnbanModal = (user) => {
    setSelectedUser(user);
    setModalAction('unban');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !modalAction) return;
    try {
      if (modalAction === 'ban') {
        await banUser(selectedUser.id);
        toast.success('Đã khóa tài khoản');
      } else {
        await unbanUser(selectedUser.id);
        toast.success('Đã mở khóa tài khoản');
      }
      setShowConfirmModal(false);
      setSelectedUser(null);
      setModalAction(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.error || 'Lỗi khi thực hiện thao tác');
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const colors = {
      USER: 'bg-blue-50 text-blue-600 border-blue-100',
      PROVIDER: 'bg-purple-50 text-purple-600 border-purple-100',
      ADMIN: 'bg-red-50 text-red-600 border-red-100'
    };
    return colors[role] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Quản lý User</h1>
            <p className="text-gray-500 font-medium italic">Thống kê và kiểm soát quyền hạn người dùng</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-3 bg-red-50 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Thành viên</p>
              <p className="text-xl font-black text-gray-900 leading-none mt-1">{users.length}</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-[32px] border-2 border-gray-50 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none font-bold text-gray-700"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-black text-gray-600 cursor-pointer"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="USER">User (Khách hàng)</option>
              <option value="PROVIDER">Provider (Đối tác)</option>
              <option value="ADMIN">Admin (Quản trị)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-black text-gray-600 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="BANNED">Đã bị khóa</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border-2 border-gray-50 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50/50 border-b-2 border-gray-100">
                  <tr>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Liên hệ</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Vai trò</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian hoạt động</th>
                    <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-red-50/30 transition-colors group">
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-black text-gray-300">#{user.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-tight">{user.fullName}</p>
                            {user.businessName && (
                              <p className="text-[10px] font-bold text-purple-500 uppercase mt-0.5">{user.businessName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 text-[10px] font-black rounded-full border ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">
                            <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">Banned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 bg-gray-50 py-1.5 px-3 rounded-xl border border-gray-100">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {calculateDaysActive(user.createdAt)}
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Ngày tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== 'ADMIN' && (
                          user.isActive ? (
                            <button
                              onClick={() => openBanModal(user)}
                              className="px-4 py-2 bg-white text-red-600 border-2 border-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase shadow-sm"
                            >
                              Khóa
                            </button>
                          ) : (
                            <button
                              onClick={() => openUnbanModal(user)}
                              className="px-4 py-2 bg-white text-green-600 border-2 border-green-50 rounded-xl hover:bg-green-600 hover:text-white transition-all font-black text-[10px] uppercase shadow-sm"
                            >
                              Mở khóa
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            {totalPages > 1 && (
              <div className="bg-gray-50/50 border-t border-gray-100 px-8 py-5 flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trang {page} / {totalPages}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-5 py-2 bg-white border-2 border-gray-100 text-[10px] font-black rounded-xl disabled:opacity-30 hover:border-red-200 transition-all uppercase"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-2 bg-white border-2 border-gray-100 text-[10px] font-black rounded-xl disabled:opacity-30 hover:border-red-200 transition-all uppercase"
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => { setShowConfirmModal(false); setSelectedUser(null); setModalAction(null); }}
          onConfirm={handleConfirmAction}
          title={modalAction === 'ban' ? '⚠️ XÁC NHẬN KHÓA' : '✅ XÁC NHẬN MỞ'}
          message={selectedUser ? `Bạn có chắc chắn muốn thay đổi trạng thái cho tài khoản "${selectedUser.fullName}"?` : ''}
          confirmText={modalAction === 'ban' ? 'KHÓA NGAY' : 'MỞ TRUY CẬP'}
          cancelText="HỦY BỎ"
          confirmColor={modalAction === 'ban' ? 'red' : 'green'}
          type={modalAction === 'ban' ? 'warning' : 'success'}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;