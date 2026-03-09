import React, { useEffect } from 'react';
import { Target, Heart, Shield, Users, Star, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const stats = [
    { number: "5,000+", label: "Đối tác Spa & Salon" },
    { number: "200,000+", label: "Người dùng tin tưởng" },
    { number: "1M+", label: "Lượt đặt lịch thành công" },
    { number: "63", label: "Tỉnh thành phủ sóng" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-gray-800">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          BeautyD - Định Hình Lại Ngành Làm Đẹp Việt
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Được thành lập với khát vọng số hóa ngành công nghiệp làm đẹp, BeautyD không chỉ là một ứng dụng đặt lịch. Chúng tôi là cầu nối tin cậy giữa những người yêu cái đẹp và các chuyên gia chăm sóc sắc đẹp hàng đầu, mang đến trải nghiệm tiện lợi, minh bạch và đẳng cấp nhất.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-purple-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
            <h3 className="text-4xl font-black text-purple-700 mb-2">{stat.number}</h3>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Core Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:border-purple-300 transition-colors">
            <Target className="w-12 h-12 text-pink-500 mb-6" />
            <h3 className="text-xl font-bold mb-4">Chất lượng hàng đầu</h3>
            <p className="text-gray-600 leading-relaxed">Mọi đối tác trên BeautyD đều phải trải qua quy trình kiểm duyệt khắt khe về giấy phép, tay nghề và cơ sở vật chất để đảm bảo an toàn tuyệt đối cho khách hàng.</p>
          </div>
          <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:border-purple-300 transition-colors">
            <Shield className="w-12 h-12 text-purple-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Minh bạch tuyệt đối</h3>
            <p className="text-gray-600 leading-relaxed">Giá cả dịch vụ, hình ảnh cơ sở và đặc biệt là các đánh giá (review) từ người dùng trước đều được hiển thị công khai, không chỉnh sửa.</p>
          </div>
          <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:border-purple-300 transition-colors">
            <Heart className="w-12 h-12 text-red-500 mb-6" />
            <h3 className="text-xl font-bold mb-4">Trải nghiệm cá nhân hóa</h3>
            <p className="text-gray-600 leading-relaxed">Hệ thống AI của chúng tôi phân tích thói quen và sở thích để gợi ý những dịch vụ, chuyên viên và không gian làm đẹp phù hợp nhất với riêng bạn.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;