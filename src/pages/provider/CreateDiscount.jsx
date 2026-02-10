import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Tag, Percent, ShoppingCart, Calendar, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import discountService from '../../services/discountService';
import ProviderLayout from '../../layouts/ProviderLayout'; // ✅ Đã thêm Import Layout

const CreateDiscount = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        value: '',      // % giảm
        minOrder: '',   // Đơn tối thiểu
        usageLimit: '', // Số lượng mã
        endDate: ''     // Hạn sử dụng
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Nếu là mã code thì auto viết hoa
        if (name === 'code') {
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate cơ bản
        if (!formData.code || !formData.value || !formData.endDate) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
            return;
        }

        if (parseInt(formData.value) > 100 || parseInt(formData.value) < 1) {
            toast.error("Phần trăm giảm giá phải từ 1% đến 100%");
            return;
        }

        setLoading(true);
        try {
            await discountService.createCoupon(formData);
            toast.success("🎉 Tạo mã giảm giá thành công!");
            
            // Reset form sau khi tạo thành công
            setFormData({
                code: '',
                value: '',
                minOrder: '',
                usageLimit: '',
                endDate: ''
            });
            
            // Có thể navigate về trang danh sách nếu cần
            // navigate('/provider/discounts'); 
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Lỗi khi tạo mã";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProviderLayout> {/* ✅ Bao bọc nội dung bằng ProviderLayout để có Sidebar */}
            <div className="max-w-2xl mx-auto">
                {/* Header điều hướng */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tạo Khuyến Mãi Mới</h1>
                        <p className="text-sm text-gray-500">Thiết lập mã giảm giá để thu hút thêm khách hàng</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Phần tiêu đề trang trí */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <Tag className="w-5 h-5" /> Cấu hình mã giảm giá
                        </h2>
                        <p className="text-purple-100 text-sm opacity-90">
                            Nhập các thông số chi tiết cho chiến dịch khuyến mãi của bạn.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* 1. Mã Code */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mã giảm giá (Code) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-bold">#</span>
                                </div>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="VD: BEAUTY2026"
                                    className="pl-8 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 uppercase font-bold tracking-wider"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 italic">Mã này khách hàng sẽ nhập khi đặt lịch.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 2. Phần trăm giảm */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mức giảm (%) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Percent className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleChange}
                                        min="1"
                                        max="100"
                                        placeholder="VD: 15"
                                        className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 3. Số lượng mã */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số lượng phát hành <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={formData.usageLimit}
                                        onChange={handleChange}
                                        placeholder="VD: 50"
                                        className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 4. Đơn tối thiểu */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Áp dụng cho đơn từ (VNĐ)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ShoppingCart className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="minOrder"
                                        value={formData.minOrder}
                                        onChange={handleChange}
                                        placeholder="VD: 500000"
                                        className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3"
                                    />
                                </div>
                            </div>

                            {/* 5. Hạn sử dụng */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Hạn sử dụng <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Đang xử lý hệ thống...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> Kích Hoạt Mã Giảm Giá
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProviderLayout>
    );
};

export default CreateDiscount;