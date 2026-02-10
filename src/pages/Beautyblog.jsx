import React, { useState } from 'react';
import { Search, Calendar, Clock, Tag, TrendingUp, Heart, Share2, Bookmark, User, ChevronRight, Sparkles } from 'lucide-react';

const BeautyBlog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dữ liệu blog posts
  const blogPosts = [
    {
      id: 1,
      title: '10 Bí Quyết Chăm Sóc Da Mùa Hè Cho Làn Da Rạng Rỡ',
      excerpt: 'Khám phá những bí quyết chăm sóc da hiệu quả giúp bạn duy trì làn da khỏe đẹp và tươi sáng trong những ngày hè nắng nóng...',
      category: 'Chăm sóc da',
      author: 'Dr. Minh Anh',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      date: '15/02/2026',
      readTime: '8 phút đọc',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop',
      tags: ['skincare', 'mùa hè', 'chống nắng'],
      views: 2543,
      likes: 186,
      featured: true
    },
    {
      id: 2,
      title: 'Xu Hướng Trang Điểm 2026: Tự Nhiên Và Tối Giản',
      excerpt: 'Trang điểm tự nhiên đang là xu hướng hot nhất năm 2026. Cùng khám phá những tips makeup giúp bạn tỏa sáng với vẻ đẹp thanh thoát...',
      category: 'Trang điểm',
      author: 'Hương Trà',
      authorAvatar: 'https://i.pravatar.cc/150?img=5',
      date: '14/02/2026',
      readTime: '6 phút đọc',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop',
      tags: ['makeup', 'xu hướng', 'natural'],
      views: 1892,
      likes: 142,
      featured: false
    },
    {
      id: 3,
      title: 'Cách Chọn Serum Phù Hợp Với Từng Loại Da',
      excerpt: 'Serum là bước quan trọng trong quy trình skincare. Tìm hiểu cách chọn serum phù hợp để có làn da khỏe mạnh và rạng ngời...',
      category: 'Chăm sóc da',
      author: 'Bs. Thanh Hà',
      authorAvatar: 'https://i.pravatar.cc/150?img=9',
      date: '13/02/2026',
      readTime: '10 phút đọc',
      image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&auto=format&fit=crop',
      tags: ['serum', 'skincare', 'beauty tips'],
      views: 3201,
      likes: 267,
      featured: true
    },
    {
      id: 4,
      title: 'Top 5 Spa Cao Cấp Tại Hà Nội Đáng Trải Nghiệm',
      excerpt: 'Danh sách những spa cao cấp tại Hà Nội với dịch vụ chuyên nghiệp, không gian sang trọng và giá cả hợp lý...',
      category: 'Spa & Wellness',
      author: 'Kim Ngân',
      authorAvatar: 'https://i.pravatar.cc/150?img=10',
      date: '12/02/2026',
      readTime: '7 phút đọc',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop',
      tags: ['spa', 'Hà Nội', 'review'],
      views: 1678,
      likes: 98,
      featured: false
    },
    {
      id: 5,
      title: 'Bí Quyết Có Mái Tóc Khỏe Đẹp Tự Nhiên',
      excerpt: 'Những phương pháp chăm sóc tóc tự nhiên giúp bạn sở hữu mái tóc bồng bềnh, mềm mượt mà không cần dùng nhiều hóa chất...',
      category: 'Chăm sóc tóc',
      author: 'Minh Tâm',
      authorAvatar: 'https://i.pravatar.cc/150?img=12',
      date: '11/02/2026',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop',
      tags: ['hair care', 'tóc', 'natural'],
      views: 2156,
      likes: 178,
      featured: false
    },
    {
      id: 6,
      title: 'Review Chi Tiết Liệu Trình Trị Mụn Hiệu Quả',
      excerpt: 'Chia sẻ trải nghiệm thực tế về liệu trình trị mụn chuyên sâu, từ quy trình điều trị đến kết quả sau 3 tháng...',
      category: 'Điều trị',
      author: 'Lan Anh',
      authorAvatar: 'https://i.pravatar.cc/150?img=14',
      date: '10/02/2026',
      readTime: '12 phút đọc',
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop',
      tags: ['mụn', 'điều trị', 'review'],
      views: 4521,
      likes: 412,
      featured: true
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: blogPosts.length },
    { id: 'skincare', name: 'Chăm sóc da', count: 2 },
    { id: 'makeup', name: 'Trang điểm', count: 1 },
    { id: 'spa', name: 'Spa & Wellness', count: 1 },
    { id: 'hair', name: 'Chăm sóc tóc', count: 1 },
    { id: 'treatment', name: 'Điều trị', count: 1 }
  ];

  const trendingTopics = [
    { name: 'Skincare Routine', posts: 45 },
    { name: 'Natural Beauty', posts: 38 },
    { name: 'Korean Beauty', posts: 32 },
    { name: 'Anti-Aging', posts: 28 },
    { name: 'Makeup Tutorial', posts: 24 }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white">
      {/* Header với gradient sang trọng */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span className="text-yellow-300 font-semibold text-sm tracking-widest uppercase">Beauty Blog</span>
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Khám Phá Bí Quyết<br />
              <span className="text-yellow-300">Làm Đẹp</span> Hoàn Hảo
            </h1>
            <p className="text-xl text-rose-100 max-w-2xl mx-auto mb-8">
              Cập nhật xu hướng làm đẹp mới nhất, chia sẻ kinh nghiệm từ chuyên gia và cộng đồng
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-full bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-2xl text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar bên trái */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-6 sticky top-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-500" />
                Danh mục
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200'
                        : 'text-gray-600 hover:bg-rose-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Chủ đề HOT
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-white/20 last:border-0">
                    <span className="text-sm font-medium">#{topic.name}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{topic.posts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Posts - Bài viết nổi bật */}
            {selectedCategory === 'all' && searchQuery === '' && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-rose-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Bài viết nổi bật</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map(post => (
                    <div key={post.id} className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-rose-100 hover:border-rose-300">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          ⭐ NỔI BẬT
                        </span>
                      </div>
                      
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">
                            {post.category}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                              <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-gray-400">
                            <button className="hover:text-rose-500 transition-colors">
                              <Heart className="w-5 h-5" />
                            </button>
                            <button className="hover:text-rose-500 transition-colors">
                              <Bookmark className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'Tất cả bài viết' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredPosts.length} bài viết
                </span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
                  <p className="text-gray-500">Thử tìm kiếm với từ khóa khác nhé!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredPosts.map(post => (
                    <div key={post.id} className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-rose-200">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="relative md:col-span-1 h-64 md:h-auto overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-rose-700 text-xs font-bold rounded-full shadow-lg">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-2 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {post.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                              </span>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
                              {post.title}
                            </h3>

                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full ring-2 ring-rose-100" />
                              <div>
                                <p className="font-semibold text-gray-900">{post.author}</p>
                                <p className="text-xs text-gray-500">{post.views.toLocaleString()} lượt xem</p>
                              </div>
                            </div>

                            <button className="group/btn flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-lg hover:shadow-rose-200 transition-all">
                              Đọc thêm
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Newsletter Subscribe */}
            <div className="bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-3xl font-bold mb-4">Đăng ký nhận tin mới nhất</h3>
                <p className="text-rose-100 mb-6">
                  Nhận ngay những bài viết mới nhất về làm đẹp, skincare và xu hướng làm đẹp hot nhất
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    className="flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/50"
                  />
                  <button className="px-8 py-4 bg-white text-rose-600 rounded-full font-bold hover:shadow-xl transition-all whitespace-nowrap">
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="group w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-rose-300 transition-all hover:scale-110 flex items-center justify-center">
          <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default BeautyBlog;