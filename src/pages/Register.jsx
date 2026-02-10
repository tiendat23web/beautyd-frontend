import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Chrome,
  CheckCircle,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    agreeTerms: false,
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    businessType: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Họ tên phải có ít nhất 3 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.role === "PROVIDER") {
      if (!formData.businessName) {
        newErrors.businessName = "Vui lòng nhập tên doanh nghiệp";
      }
      if (!formData.businessAddress) {
        newErrors.businessAddress = "Vui lòng nhập địa chỉ doanh nghiệp";
      }
      if (!formData.businessType) {
        newErrors.businessType = "Vui lòng chọn loại hình doanh nghiệp";
      }
    }

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Vui lòng đồng ý với điều khoản";
    }

    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    const newErrors = validateStep2();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const response = await registerUser(formData);
      if (response.status === 201) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
        setLoading(false);
        setCurrentStep(3);
      } else if (response.status === 400) {
        toast.error(
          response.data.error || "Đăng ký thất bại. Vui lòng thử lại."
        );
        setLoading(false);
      } else {
        toast.error(
          response.data.message || "Đăng ký thất bại. Vui lòng thử lại."
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Register error:", error);
      setApiError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 33, label: "Yếu", color: "bg-red-500" };
    if (strength <= 3)
      return { strength: 66, label: "Trung bình", color: "bg-yellow-500" };
    return { strength: 100, label: "Mạnh", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  if (currentStep === 3) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Đăng ký thành công!
              </h1>
              <p className="text-gray-600 mb-2">
                Chào mừng bạn đến với BeautyD
                {formData.role === "PROVIDER" && " với tư cách đối tác"}!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Tài khoản của bạn đã được tạo thành công.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Đăng nhập ngay
              </button>
              <p className="text-sm text-gray-600 mt-4">
                Hoặc{" "}
                <a
                  href="/login"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  đăng nhập
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Animation Styles */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background - SAME AS LOGIN */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Promotional Content */}
          <div className="hidden lg:block text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight">
                Tham gia cộng đồng làm đẹp hàng đầu Việt Nam
              </h1>
              <p className="text-xl text-blue-100">
                Kết nối với hàng nghìn dịch vụ làm đẹp chuyên nghiệp
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dễ dàng đặt lịch</h3>
                  <p className="text-sm text-blue-100">Đặt lịch nhanh chóng chỉ trong vài giây</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Chuyên gia uy tín</h3>
                  <p className="text-sm text-blue-100">Được đánh giá cao bởi hàng nghìn khách hàng</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Ưu đãi hấp dẫn</h3>
                  <p className="text-sm text-blue-100">Giảm giá lên đến 50% cho thành viên mới</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-blue-100 text-sm">
               Đã có tài khoản? <Link to="/login" className="text-white font-semibold underline hover:text-pink-200 transition-colors">Đăng nhập ngay</Link>
              </p>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full max-w-3xl mx-auto">
            {/* Logo & Title */}
            <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
              <span className="text-3xl font-bold text-white">
                BeautyD
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="text-blue-100">
              Tham gia cộng đồng BeautyD ngay hôm nay
            </p>
          </div>

          {/* Form Card - ĐÃ ĐIỀU CHỈNH ĐỂ RỘNG HƠN */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= 1
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`text-xs font-medium mt-2 ${
                      currentStep >= 1 ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    Thông tin
                  </span>
                </div>

                <div
                  className={`w-16 h-1 mx-2 rounded transition-all ${
                    currentStep >= 2
                      ? "bg-gradient-to-r from-purple-600 to-pink-600"
                      : "bg-gray-200"
                  }`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= 2
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`text-xs font-medium mt-2 ${
                      currentStep >= 2 ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    Bảo mật
                  </span>
                </div>
              </div>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Bạn là <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRoleSelect("USER")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === "USER"
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-300 hover:border-purple-300"
                      }`}
                    >
                      <UserCircle
                        className={`w-8 h-8 mx-auto mb-2 ${
                          formData.role === "USER"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div
                        className={`text-sm font-semibold ${
                          formData.role === "USER"
                            ? "text-purple-600"
                            : "text-gray-700"
                        }`}
                      >
                        Khách hàng
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Tìm & đặt dịch vụ
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect("PROVIDER")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === "PROVIDER"
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-300 hover:border-purple-300"
                      }`}
                    >
                      <Briefcase
                        className={`w-8 h-8 mx-auto mb-2 ${
                          formData.role === "PROVIDER"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div
                        className={`text-sm font-semibold ${
                          formData.role === "PROVIDER"
                            ? "text-purple-600"
                            : "text-gray-700"
                        }`}
                      >
                        Đối tác
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Cung cấp dịch vụ
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form fields - ÁP DỤNG GRID 2 CỘT CHO TẤT CẢ */}
                {formData.role === "PROVIDER" ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Personal Info Column */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-200">
                        Thông tin cá nhân
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nguyễn Văn A"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                              errors.fullName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                              errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="0901234567"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                              errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Business Info Column */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-200">
                        Thông tin doanh nghiệp
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên doanh nghiệp <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Spa XYZ"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                              errors.businessName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.businessName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.businessName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <input
                            type="text"
                            name="businessAddress"
                            value={formData.businessAddress}
                            onChange={handleChange}
                            placeholder="123 Nguyễn Huệ, Q1"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                              errors.businessAddress
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.businessAddress && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.businessAddress}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SĐT doanh nghiệp
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="businessPhone"
                            value={formData.businessPhone}
                            onChange={handleChange}
                            placeholder="0281234567"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Loại hình doanh nghiệp <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.businessType
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Chọn loại hình doanh nghiệp</option>
                          <option value="spa">Spa</option>
                          <option value="salon">Salon tóc</option>
                          <option value="nails">Tiệm nail</option>
                          <option value="massage">Massage</option>
                          <option value="gym">Gym & Fitness</option>
                          <option value="other">Khác</option>
                        </select>
                        {errors.businessType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.businessType}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* USER FORM - ÁP DỤNG GRID 2 CỘT */
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Nguyễn Văn A"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.fullName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@gmail.com"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0901234567"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] shadow-lg"
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {/* GRID 2 CỘT CHO PASSWORD */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${passwordStrength.color}`}
                              style={{ width: `${passwordStrength.strength}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-4 h-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">
                      Tôi đồng ý với{" "}
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Điều khoản sử dụng
                      </a>{" "}
                      và{" "}
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Chính sách bảo mật
                      </a>
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                        Đang xử lý...
                      </span>
                    ) : (
                      "Đăng ký"
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Hoặc đăng ký với
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialRegister("google")}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Chrome className="w-5 h-5 text-red-500" />
              </button>
              <button
                onClick={() => handleSocialRegister("facebook")}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialRegister("zalo")}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.498 1.814 6.614 4.641 8.664.202 1.444.61 4.273.693 4.862.118.863.532 1.04 1.08.599.395-.318 2.71-2.164 3.725-2.98C10.703 22.427 11.337 22.5 12 22.5c6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm.051 16.614c-1.638 0-3.165-.51-4.423-1.382l-3.106 1.963.849-3.096c-.947-1.253-1.508-2.794-1.508-4.477 0-4.133 3.537-7.5 7.897-7.5 4.36 0 7.897 3.367 7.897 7.5s-3.537 7.5-7.897 7.5z" />
                </svg>
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-5">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;