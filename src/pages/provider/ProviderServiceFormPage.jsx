import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, X, Upload, Trash2 } from 'lucide-react';
import ProviderLayout from '../../layouts/ProviderLayout';
import { createService, updateService, getProviderServices } from '../../services/providerService';
import { getCategory } from '../../services/servicesService';

const ProviderServiceFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    categoryId: ''
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchServiceData();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await getCategory();
      if (response.status === 200) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const fetchServiceData = async () => {
    try {
      const response = await getProviderServices();
      if (response.status === 200) {
        const service = response.data.find(s => s.id === parseInt(id));
        if (service) {
          setFormData({
            name: service.name,
            description: service.description || '',
            price: service.price,
            duration: service.duration,
            categoryId: service.categoryId || ''
          });
        }
      }
    } catch (error) {
      console.error('Fetch service error:', error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên dịch vụ');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Vui lòng nhập giá hợp lệ');
      return;
    }
    if (!formData.duration || formData.duration <= 0) {
      toast.error('Vui lòng nhập thời lượng hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('duration', formData.duration);
      if (formData.categoryId) {
        data.append('categoryId', formData.categoryId);
      }
      
      images.forEach((image) => {
        data.append('images', image);
      });

      const response = isEditing 
        ? await updateService(id, data)
        : await createService(data);

      if (response.status === 200 || response.status === 201) {
        toast.success(isEditing ? 'Đã cập nhật dịch vụ' : 'Đã tạo dịch vụ mới');
        navigate('/provider/services');
      } else {
        toast.error(response.data?.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Submit service error:', error);
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProviderLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Chỉnh sửa Dịch vụ' : 'Tạo Dịch vụ mới'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Cập nhật thông tin dịch vụ' : 'Thêm dịch vụ mới vào danh sách của bạn'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên dịch vụ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Cắt tóc nam, Nhuộm tóc, ..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả dịch vụ
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả chi tiết về dịch vụ..."
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="150000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời lượng (phút) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Hình ảnh dịch vụ
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">Click để upload ảnh</p>
                <p className="text-sm text-gray-500 mt-1">Hỗ trợ: JPG, PNG. Tối đa 5MB</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/provider/services')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </ProviderLayout>
  );
};

export default ProviderServiceFormPage;
