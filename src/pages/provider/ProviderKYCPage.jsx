import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Upload, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ProviderLayout from "../../layouts/ProviderLayout";
import DragDropUpload from "../../components/DragDropUpload";
import { uploadKYCDocuments } from "../../services/providerService.js";

const ProviderKYCPage = () => {
  const navigate = useNavigate();
  
  // Danh sách các loại giấy tờ hỗ trợ
  const DOC_TYPES = [
    { value: "BUSINESS_LICENSE", label: "Giấy phép kinh doanh" },
    { value: "CITIZEN_ID_FRONT", label: "CCCD/CMND Mặt trước" },
    { value: "CITIZEN_ID_BACK", label: "CCCD/CMND Mặt sau" },
    { value: "OTHER", label: "Giấy tờ xác thực khác" },
  ];

  // State quản lý danh sách tài liệu (Người dùng có thể chọn 1 hoặc nhiều)
  const [kycDocs, setKycDocs] = useState([{ type: "", files: [] }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState("pending"); // pending, verified, rejected

  // Thêm một dòng tài liệu mới
  const addDocRow = () => {
    setKycDocs([...kycDocs, { type: "", files: [] }]);
  };

  // Xóa một dòng tài liệu
  const removeDocRow = (index) => {
    if (kycDocs.length > 1) {
      const newDocs = kycDocs.filter((_, i) => i !== index);
      setKycDocs(newDocs);
    } else {
      setKycDocs([{ type: "", files: [] }]);
    }
  };

  // Cập nhật loại giấy tờ cho một dòng
  const updateDocType = (index, value) => {
    const newDocs = [...kycDocs];
    newDocs[index].type = value;
    setKycDocs(newDocs);
  };

  // Cập nhật file cho một dòng
  const updateDocFiles = (index, files) => {
    const newDocs = [...kycDocs];
    newDocs[index].files = files;
    setKycDocs(newDocs);
  };

  const handleSubmit = async () => {
    // 1. Validation: Kiểm tra xem tất cả các dòng đã chọn loại và có file chưa
    const incomplete = kycDocs.some(doc => !doc.type || doc.files.length === 0);
    if (incomplete) {
      toast.error("Vui lòng chọn loại giấy tờ và tải file đầy đủ cho tất cả các mục");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Hàm helper để tạo request (Giữ nguyên logic Backend)
      const uploadSingle = (file, type) => {
        const formData = new FormData();
        formData.append("document", file); 
        formData.append("type", type);
        return uploadKYCDocuments(formData);
      };

      // 3. Gửi đồng thời toàn bộ danh sách tài liệu đã thêm
      const uploadPromises = kycDocs.map(doc => 
        uploadSingle(doc.files[0], doc.type)
      );

      await Promise.all(uploadPromises);

      toast.success("Đã gửi toàn bộ tài liệu xác thực thành công!");
      setKycStatus("verified");
      setTimeout(() => navigate("/provider/dashboard"), 2000);
    } catch (error) {
      console.error("KYC Upload Error:", error);
      toast.error(
        "Có lỗi xảy ra khi upload. Vui lòng kiểm tra lại định dạng hoặc dung lượng file.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    const badges = {
      pending: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: AlertCircle,
        text: "Chờ xác thực",
      },
      verified: {
        color: "bg-green-100 text-green-700 border-green-300",
        icon: CheckCircle,
        text: "Đã xác thực",
      },
      rejected: {
        color: "bg-red-100 text-red-700 border-red-300",
        icon: AlertCircle,
        text: "Từ chối",
      },
    };

    const status = badges[kycStatus];
    const Icon = status.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${status.color}`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-semibold">{status.text}</span>
      </div>
    );
  };

  return (
    <ProviderLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Xác thực KYC
              </h1>
              <p className="text-gray-600">
                Lựa chọn và upload các tài liệu cần thiết để xác thực tài khoản của bạn
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Hướng dẫn xác thực
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Chọn loại giấy tờ tương ứng trong danh sách.</li>
                <li>• Đảm bảo hình ảnh rõ nét, không bị mất góc hoặc mờ thông tin.</li>
                <li>• Bạn có thể nhấn <b>"Thêm tài liệu"</b> để tải lên nhiều loại giấy tờ cùng lúc.</li>
                <li>• Định dạng hỗ trợ: JPG, PNG hoặc PDF. Tối đa 5MB/file.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dynamic Upload Sections */}
        <div className="space-y-6">
          {kycDocs.map((doc, index) => (
            <div key={index} className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm relative animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 max-w-xs">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Loại giấy tờ {index + 1}
                  </label>
                  <select
                    value={doc.type}
                    onChange={(e) => updateDocType(index, e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium"
                  >
                    <option value="">-- Chọn loại giấy tờ --</option>
                    {DOC_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {kycDocs.length > 1 && (
                  <button
                    onClick={() => removeDocRow(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors mt-6"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <DragDropUpload
                label=""
                files={doc.files}
                onFilesChange={(files) => updateDocFiles(index, files)}
                multiple={false}
              />
            </div>
          ))}

          {/* Add More Button */}
          <button
            onClick={addDocRow}
            className="w-full py-4 border-2 border-dashed border-purple-200 rounded-2xl text-purple-600 font-bold flex items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-400 transition-all"
          >
            <Plus className="w-5 h-5" />
            THÊM TÀI LIỆU XÁC THỰC
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={() => navigate("/provider/dashboard")}
            className="px-8 py-3.5 border-2 border-gray-200 text-gray-500 rounded-2xl hover:bg-gray-50 transition-colors font-bold uppercase text-sm"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-purple-100 uppercase text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 animate-bounce" />
                Đang xử lý dữ liệu...
              </span>
            ) : (
              "Gửi toàn bộ tài liệu xác thực"
            )}
          </button>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default ProviderKYCPage;