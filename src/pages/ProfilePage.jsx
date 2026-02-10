import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Camera,
  Edit2,
  Save,
  X,
  Shield,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Lock,
  Eye,
  EyeOff,
  BadgeCheck,    
  AlertTriangle, 
} from "lucide-react";
// Bổ sung sendVerificationEmail
import { editProfile, getProfile, changePassword, sendVerificationEmail } from "../services/authService"; 
import Header from "../components/Header";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    avatar: null,
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State cho đổi mật khẩu
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.status !== 200) {
        throw new Error("Failed to fetch profile");
      }
      setUserData(response.data);
      setFormData({
        fullName: response.data.fullName || "",
        phone: response.data.phone || "",
        avatar: response.data.avatar || null,
        businessName: response.data.businessName || "",
        businessAddress: response.data.businessAddress || "",
        businessPhone: response.data.businessPhone || "",
        description: response.data.description || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Fetch profile error:", error);
      setApiError("Không thể tải thông tin profile");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Ảnh không được vượt quá 5MB",
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Họ tên phải có ít nhất 3 ký tự";
    }

    if (
      formData.phone &&
      !/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (userData?.role === "PROVIDER") {
      if (
        formData.businessPhone &&
        !/^[0-9]{10}$/.test(formData.businessPhone.replace(/\s/g, ""))
      ) {
        newErrors.businessPhone = "Số điện thoại không hợp lệ";
      }
    }

    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await editProfile(formData);
      setUserData(response.data);
      setIsEditing(false);
      setSuccessMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setSaving(false);
    } catch (error) {
      console.error("Update profile error:", error);
      setApiError("Không thể cập nhật thông tin. Vui lòng thử lại.");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: userData.fullName || "",
      phone: userData.phone || "",
      avatar: userData.avatar || null,
      businessName: userData.businessName || "",
      businessAddress: userData.businessAddress || "",
      businessPhone: userData.businessPhone || "",
      description: userData.description || "",
    });
    setIsEditing(false);
    setErrors({});
    setApiError("");
  };

  // Xử lý đổi mật khẩu
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải từ 6 ký tự!");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(response.data?.error || "Mật khẩu cũ không chính xác");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- MỚI: Xử lý gửi email xác thực ---
  const handleSendVerify = async () => {
    try {
        await sendVerificationEmail();
        toast.success("Đã gửi email xác thực! Hãy kiểm tra hộp thư của bạn.");
    } catch (error) {
        toast.error(error.response?.data?.error || "Lỗi gửi email");
    }
  };

  const getKycStatusBadge = (status) => {
    const badges = {
      PENDING: {
        icon: <Clock className="w-4 h-4" />,
        text: "Chờ xác thực",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      },
      APPROVED: {
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Đã xác thực",
        color: "bg-green-100 text-green-700 border-green-300",
      },
      REJECTED: {
        icon: <XCircle className="w-4 h-4" />,
        text: "Từ chối",
        color: "bg-red-100 text-red-700 border-red-300",
      },
    };

    const badge = badges[status] || badges.PENDING;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa cập nhật";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <div className="max-w-8xl mx-auto">
        <Header />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{apiError}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover & Avatar Section */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <div className="absolute -bottom-16 left-8 flex items-end gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-purple-600 font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            )}
          </div>

          <div className="pt-20 px-8 pb-8">
            {/* User Info Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {userData?.fullName}
                </h2>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {userData?.email}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {userData?.role === "PROVIDER" &&
                  getKycStatusBadge(userData?.kycStatus)}

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userData?.role === "PROVIDER"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-purple-100 text-purple-700 border border-purple-300"
                  }`}
                >
                  {userData?.role === "PROVIDER"
                    ? "🏢 Đối tác"
                    : userData?.role === "ADMIN"
                      ? "⚡ Quản trị viên"
                      : "👤 Khách hàng"}
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                        isEditing ? "bg-white" : "bg-gray-50"
                      } ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                        isEditing ? "bg-white" : "bg-gray-50"
                      } ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* --- CẬP NHẬT PHẦN EMAIL Ở ĐÂY --- */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={userData?.email || ""}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed pr-32" 
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        {userData?.isEmailVerified ? (
                          // TRƯỜNG HỢP 1: ĐÃ XÁC THỰC -> Hiện Badge xanh
                          <span className="flex items-center gap-1.5 text-green-700 text-xs font-bold bg-green-100 px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
                            <BadgeCheck className="w-4 h-4" /> Đã xác thực
                          </span>
                        ) : (
                          // TRƯỜNG HỢP 2: CHƯA XÁC THỰC -> Hiện nút gửi
                          <div className="flex items-center gap-2">
                            <div className="group relative">
                               <AlertTriangle className="w-5 h-5 text-orange-500 cursor-help" />
                               {/* Tooltip */}
                               <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-gray-800 text-white text-[10px] p-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  Tài khoản chưa an toàn
                               </span>
                            </div>
                            <button 
                              onClick={handleSendVerify}
                              type="button"
                              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
                            >
                              Xác thực ngay
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">
                      Email không thể thay đổi
                    </p>
                  </div>
                  {/* --------------------------------- */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày tạo tài khoản
                    </label>
                    <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {formatDate(userData?.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information (Only for PROVIDER) */}
              {userData?.role === "PROVIDER" && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Thông tin doanh nghiệp
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên doanh nghiệp
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="VD: Lotus Wellness Spa"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        } border-gray-300`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại doanh nghiệp
                      </label>
                      <input
                        type="tel"
                        name="businessPhone"
                        value={formData.businessPhone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="0901234567"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        } ${
                          errors.businessPhone
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.businessPhone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.businessPhone}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ doanh nghiệp
                      </label>
                      <input
                        type="text"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="123 Nguyễn Huệ, Q.1, TP.HCM"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        } border-gray-300`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Giới thiệu về dịch vụ của bạn..."
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        } border-gray-300`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Security Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Bảo mật</h3>
                <p className="text-sm text-gray-600">Quản lý mật khẩu</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              Đổi mật khẩu
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md p-6 text-white">
            <h3 className="font-semibold mb-4">Thống kê</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Chức danh</span>
                <span className="font-semibold">
                  {userData?.role === "ADMIN"
                    ? "Quản trị viên"
                    : userData?.role === "PROVIDER"
                      ? "Đối tác"
                      : "Khách hàng"}
                </span>
              </div>
              {userData?.role === "PROVIDER" && (
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">KYC</span>
                  <span className="font-semibold">
                    {getKycStatusBadge(userData?.kycStatus).props.children[1]}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Tham gia</span>
                <span className="font-semibold">
                  {formatDate(userData?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Đổi mật khẩu */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" /> Đổi mật khẩu
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* Mật khẩu hiện tại */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showOldPass ? "text" : "password"}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Ít nhất 6 ký tự"
                  />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {passwordLoading ? "Đang xử lý..." : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;