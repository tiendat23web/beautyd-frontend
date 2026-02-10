import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Chrome, Sparkles, Star } from "lucide-react";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email hoặc số điện thoại";
    } else {
      const isEmail = /\S+@\S+\.\S+/.test(formData.email);
      const isPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.email);

      if (!isEmail && !isPhone) {
        newErrors.email = "Email hoặc số điện thoại không hợp lệ";
      }
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData.email, formData.password);
      if (response.status === 200) {
        const { token, user } = response.data;

        login(token, user);

        toast.success("Đăng nhập thành công!");

        const roleUser = user.role;
        if (roleUser === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (roleUser === "PROVIDER") {
          navigate("/provider/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(
          response.data.error ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

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

      {/* Content Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Promotional Content */}
          <div className="hidden lg:block text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold leading-tight">
                Chào mừng
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Khám phá thế giới làm đẹp với hàng ngàn dịch vụ spa, salon và thẩm mỹ viện uy tín. 
                Đặt lịch dễ dàng, trải nghiệm đẳng cấp.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Đặt lịch nhanh chóng</h3>
                  <p className="text-sm text-blue-100">Chỉ với vài cú click, lịch hẹn của bạn đã sẵn sàng</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dịch vụ chất lượng</h3>
                  <p className="text-sm text-blue-100">Hơn 1000+ spa và salon đã được xác minh</p>
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
                Chưa phải là thành viên? <Link to="/register" className="text-white font-semibold underline hover:text-pink-200 transition-colors">Đăng kí ngay</Link>
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">B</span>
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    BeautyD
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Đăng nhập
                </h2>
                <p className="text-gray-600">Chào mừng trở lại! Vui lòng nhập thông tin của bạn</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email/Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email hoặc số điện thoại"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
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
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                  </label>
                  <Link
                    to="/forget-password"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
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
                      Đang đăng nhập...
                    </span>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Chrome className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button
                  onClick={() => handleSocialLogin("facebook")}
                  className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Facebook
                  </span>
                </button>
                <button
                  onClick={() => handleSocialLogin("zalo")}
                  className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.498 1.814 6.614 4.641 8.664.202 1.444.61 4.273.693 4.862.118.863.532 1.04 1.08.599.395-.318 2.71-2.164 3.725-2.98C10.703 22.427 11.337 22.5 12 22.5c6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm.051 16.614c-1.638 0-3.165-.51-4.423-1.382l-3.106 1.963.849-3.096c-.947-1.253-1.508-2.794-1.508-4.477 0-4.133 3.537-7.5 7.897-7.5 4.36 0 7.897 3.367 7.897 7.5s-3.537 7.5-7.897 7.5z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Zalo</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
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
    {/* Animation Styles */}
<style>{`
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

export default LoginPage;