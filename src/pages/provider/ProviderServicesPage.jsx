import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Power, Package } from "lucide-react";
import { toast } from "react-toastify";
import ProviderLayout from "../../layouts/ProviderLayout";
import {
  getProviderServices,
  deleteService,
  toggleServiceStatus,
} from "../../services/providerService";

const ProviderServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getProviderServices();
      if (response.status === 200) {
        setServices(response.data || generateMockServices());
      } else {
        setServices(generateMockServices());
      }
    } catch (error) {
      console.error("Fetch services error:", error);
      setServices(generateMockServices());
    } finally {
      setLoading(false);
    }
  };

  const generateMockServices = () => {
    return [
      {
        id: 1,
        name: "Cắt tóc nam",
        price: 150000,
        duration: 30,
        isActive: true,
        images: [{ imageUrl: "https://via.placeholder.com/100" }],
      },
      {
        id: 2,
        name: "Nhuộm tóc",
        price: 1200000,
        duration: 120,
        isActive: true,
        images: [{ imageUrl: "https://via.placeholder.com/100" }],
      },
    ];
  };

  const handleToggleStatus = async (service) => {
    const currentStatus = service.isActive;
    const nextStatus = !currentStatus;
    try {
      const statusPayload = nextStatus ? "active" : "inactive";
      const response = await toggleServiceStatus(service.id, statusPayload);
      if (response.status === 200) {
        toast.success(`Đã ${nextStatus ? "bật" : "tắt"} dịch vụ`);
        fetchServices();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    try {
      const response = await deleteService(serviceToDelete.id);
      if (response.status === 200) {
        toast.success("Đã xóa dịch vụ");
        fetchServices();
        setDeleteModalOpen(false);
        setServiceToDelete(null);
      } else {
        toast.error("Xóa không thành công do đang đã được booking");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) return (
    <ProviderLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </ProviderLayout>
  );

  return (
    <ProviderLayout>
      <div className="space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý Dịch vụ</h1>
            <p className="text-gray-500 font-medium">Bạn có tổng cộng <span className="text-purple-600">{services.length}</span> dịch vụ đang kinh doanh</p>
          </div>
          <Link
            to="/provider/services/new"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-100 font-bold"
          >
            <Plus className="w-5 h-5" /> Thêm dịch vụ mới
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl border-2 border-gray-50 p-4 shadow-sm">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh dịch vụ của bạn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        {/* Services Table Section */}
        <div className="bg-white rounded-[32px] border-2 border-gray-50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50/50 border-b-2 border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Thông tin dịch vụ</th>
                  <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Đơn giá</th>
                  <th className="px-6 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Thời lượng</th>
                  <th className="px-6 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-purple-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={service.images?.[0]?.imageUrl || "https://via.placeholder.com/80"}
                            alt={service.name}
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <span className="block font-bold text-gray-900 text-lg leading-tight mb-1">{service.name}</span>
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-tight">ID: #{service.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <span className="text-xl font-black text-purple-600">
                          {formatCurrency(service.price)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
                           <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                           {service.duration} phút
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleToggleStatus(service)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
                            service.isActive
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          {service.isActive ? "Hoạt động" : "Tạm dừng"}
                        </button>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => navigate(`/provider/services/edit/${service.id}`)}
                            className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(service)}
                            className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Package className="w-20 h-20 text-gray-100" />
                        <p className="text-gray-400 font-bold text-lg">Chưa tìm thấy dịch vụ nào phù hợp</p>
                        <Link to="/provider/services/new" className="text-purple-600 font-black border-b-2 border-purple-200 hover:border-purple-600 transition-all">Thêm dịch vụ ngay</Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal - Nâng cấp giao diện */}
        {deleteModalOpen && serviceToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] max-w-md w-full p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Trash2 className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Xác nhận xóa?</h3>
                <p className="text-gray-500 leading-relaxed">
                  Dịch vụ <strong className="text-gray-900 text-lg">"{serviceToDelete.name}"</strong> sẽ bị gỡ bỏ vĩnh viễn khỏi hệ thống. Bạn chắc chắn chứ?
                </p>
              </div>
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => { setDeleteModalOpen(false); setServiceToDelete(null); }}
                  className="flex-1 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
                >
                  Đồng ý xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderServicesPage;