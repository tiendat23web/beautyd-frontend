import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, Send, Paperclip, MoreVertical, Phone, Video, 
  Image as ImageIcon, Smile, MessageCircle, User as UserIcon 
} from 'lucide-react';
import ProviderLayout from '../../layouts/ProviderLayout';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

import {
  getConversations,
  getMessages,
  sendMessage,
  markAllAsRead,
} from '../../services/messageService';

const ProviderChatPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const processedPartnerRef = useRef(null);

  const { partnerId, partnerName, partnerAvatar, partnerPhone } = location.state || {};

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); 
  
  const EMOJI_LIST = ['👍', '❤️', '😊', '😂', '😭', '😡', '🎉', '👋', 'OK', '🙏', '😍', '🤔'];

  // Bộ đếm để update giao diện thời gian
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Xử lý logic chuyển hướng từ Booking qua
  useEffect(() => {
    if (!partnerId || processedPartnerRef.current === parseInt(partnerId)) return;
    if (loading && conversations.length === 0) return;

    const existingConvIndex = conversations.findIndex(c => c.user.id === parseInt(partnerId));
    
    if (existingConvIndex !== -1) {
        const targetConv = conversations[existingConvIndex];
        if (partnerPhone && !targetConv.user.phone) {
            setConversations(prev => {
                const newConvs = [...prev];
                newConvs[existingConvIndex] = {
                    ...targetConv,
                    user: { ...targetConv.user, phone: partnerPhone }
                };
                return newConvs;
            });
            handleSelectConversation({ ...targetConv.user, phone: partnerPhone }, false);
        } else {
            handleSelectConversation(targetConv.user, false);
        }
    } else {
        setSelectedUser({
            id: parseInt(partnerId),
            fullName: partnerName || "Khách hàng",
            avatar: partnerAvatar || null,
            phone: partnerPhone || null,
            lastActiveAt: new Date().toISOString()
        });
        setMessages([]);
    }
    processedPartnerRef.current = parseInt(partnerId);
  }, [partnerId, conversations, loading]); 

  // Polling dữ liệu Real-time
  useEffect(() => {
    if (selectedUser) {
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(selectedUser.id, false);
        fetchConversations(false); 
      }, 3000);

      return () => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      };
    }
  }, [selectedUser?.id]);

  // Đồng bộ lại thông tin user
  useEffect(() => {
    if (selectedUser && conversations.length > 0) {
        const updatedUserInList = conversations.find(c => c.user.id === selectedUser.id);
        if (updatedUserInList && updatedUserInList.user.lastActiveAt) {
            if (updatedUserInList.user.lastActiveAt !== selectedUser.lastActiveAt) {
                setSelectedUser(prev => ({
                    ...prev,
                    lastActiveAt: updatedUserInList.user.lastActiveAt,
                }));
            }
        }
    }
  }, [conversations]);

  // --- ĐÃ XÓA ĐOẠN MÃ TỰ ĐỘNG CUỘN XUỐNG DƯỚI ---
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const fetchConversations = async (showLoading = true) => {
    try {
      if(showLoading) setLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Lỗi tải hội thoại:", error);
    } finally {
      if(showLoading) setLoading(false);
    }
  };

  const fetchMessages = async (targetUserId, showLoading = false) => {
    try {
      const data = await getMessages(targetUserId);
      setMessages(data);
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    }
  };

  const handleSelectConversation = async (targetUser, showSpinner = true) => {
    setSelectedUser(targetUser);
    setSearchTerm("");
    if(showSpinner) setLoading(true);
    try {
        await fetchMessages(targetUser.id);
        await markAllAsRead(targetUser.id);
        await fetchConversations(false);
    } catch (error) {
        console.error(error);
    } finally {
        if(showSpinner) setLoading(false);
    }
  };

  // --- HÀM TÍNH TOÁN TRẠNG THÁI ONLINE ---
  const getUserStatus = (targetUser) => {
    if (!targetUser) return "";
    
    let lastTime = targetUser.lastActiveAt 
        ? new Date(targetUser.lastActiveAt) 
        : (targetUser.updatedAt ? new Date(targetUser.updatedAt) : new Date(0));

    if (lastTime.getTime() === 0) return <span className="text-xs text-gray-400">Ngoại tuyến</span>;

    const now = new Date();
    const diffSeconds = Math.floor((now - lastTime) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 2) {
        return (
            <span className="text-xs font-bold text-green-600 flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Đang hoạt động
            </span>
        );
    } else if (diffMinutes < 60) {
        return (
            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Hoạt động {diffMinutes} phút trước
            </span>
        );
    } else if (diffMinutes < 1440) {
        return (
            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Hoạt động {Math.floor(diffMinutes / 60)} giờ trước
            </span>
        );
    } else {
        return (
            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Hoạt động {Math.floor(diffMinutes / 1440)} ngày trước
            </span>
        );
    }
  };

  const redactPhoneNumber = (text) => {
    const vnPhoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g;
    if (vnPhoneRegex.test(text)) {
        toast.info("Lưu ý: Số điện thoại đã được ẩn để bảo mật.");
        return text.replace(vnPhoneRegex, "xxx-xxxx-xxx");
    }
    return text;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    const safeContent = redactPhoneNumber(messageInput.trim());

    setMessageInput("");
    setSending(true);
    setShowEmoji(false);

    try {
      await sendMessage(selectedUser.id, safeContent);
      await fetchMessages(selectedUser.id);
      await fetchConversations(false);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      toast.error("Gửi thất bại");
    } finally {
      setSending(false);
    }
  };

  const handleImageClick = () => { fileInputRef.current.click(); };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.info(`Đang gửi ảnh: ${file.name}`);
    setSending(true);
    try {
        await sendMessage(selectedUser.id, `[Hình ảnh: ${file.name}]`); 
        await fetchMessages(selectedUser.id);
    } catch (error) {
        toast.error("Không thể gửi ảnh");
    } finally {
        setSending(false);
        e.target.value = null;
    }
  };

  const addEmoji = (emoji) => { setMessageInput(prev => prev + emoji); };

  const handleVideoCall = () => { toast.info("Tính năng Video Call đang phát triển"); };

  const filteredConversations = conversations.filter(conv => 
    conv.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    if (!date) return "";
    const msgDate = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now - msgDate) / 60000);
    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} giờ`;
    return msgDate.toLocaleDateString("vi-VN", {day: '2-digit', month: '2-digit'});
  };

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
  };

  return (
    <ProviderLayout>
      <div className="flex h-[calc(100vh-100px)] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-100 bg-purple-600 text-white">
            <h2 className="text-xl font-bold mb-4">Tin nhắn</h2>
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..." 
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 border-none placeholder-purple-100 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-100" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 && !loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                    {searchTerm ? "Không tìm thấy kết quả" : "Chưa có tin nhắn nào"}
                </div>
            ) : (
                filteredConversations.map((conv) => (
                <div 
                    key={conv.user.id}
                    onClick={() => handleSelectConversation(conv.user)}
                    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedUser?.id === conv.user.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''}`}
                >
                    <div className="relative">
                    {conv.user.avatar ? (
                        <img src={conv.user.avatar} alt={conv.user.fullName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border border-gray-200">
                            <UserIcon className="w-6 h-6 text-purple-600" />
                        </div>
                    )}
                    {(new Date() - new Date(conv.user.lastActiveAt || 0)) < 120000 && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    </div>
                    <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`text-sm font-bold truncate ${selectedUser?.id === conv.user.id ? 'text-purple-700' : 'text-gray-800'}`}>
                            {conv.user.fullName}
                        </h3>
                        <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(conv.lastMessage.createdAt)}</span>
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                        {conv.lastMessage.senderId === user?.id && "Bạn: "} {conv.lastMessage.content}
                    </p>
                    </div>
                    {conv.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                        {conv.unreadCount}
                    </div>
                    )}
                </div>
                ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {selectedUser.avatar ? (
                        <img src={selectedUser.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-purple-600" />
                        </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedUser.fullName}</h3>
                    {getUserStatus(selectedUser)}
                  </div>
                </div>
                <div className="flex gap-1 text-purple-600">
                  {selectedUser.phone ? (
                    <a 
                      href={`tel:${selectedUser.phone}`}
                      className="p-2 hover:bg-green-50 text-green-600 rounded-full transition-colors flex items-center justify-center"
                      title={`Gọi điện: ${selectedUser.phone}`}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  ) : (
                    <button 
                      onClick={() => toast.info("Người dùng này chưa cập nhật số điện thoại")}
                      className="p-2 bg-gray-100 text-gray-400 rounded-full cursor-not-allowed"
                      title="Không có số điện thoại"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                  )}

                  <button onClick={handleVideoCall} className="p-2 hover:bg-purple-50 rounded-full transition-colors" title="Video Call"><Video className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-purple-50 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-xs text-gray-400 my-4">-- Bắt đầu cuộc trò chuyện với khách hàng --</div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.senderId === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start items-end'} gap-2`}>
                                {!isOwn && (
                                    <div className="flex-shrink-0">
                                        {selectedUser.avatar ? (
                                            <img src={selectedUser.avatar} alt={selectedUser.fullName} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
                                                <UserIcon className="w-4 h-4 text-purple-600" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                                isOwn 
                                    ? 'bg-purple-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                }`}>
                                <p>{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right ${isOwn ? 'text-purple-200' : 'text-gray-400'}`}>
                                    {formatMessageTime(msg.createdAt)}
                                </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-gray-100 relative">
                {showEmoji && (
                   <div className="absolute bottom-20 right-10 bg-white shadow-xl border border-gray-200 rounded-2xl p-3 grid grid-cols-6 gap-2 w-64 animate-in fade-in slide-in-from-bottom-2 z-20">
                      {EMOJI_LIST.map(emoji => (
                          <button key={emoji} onClick={() => addEmoji(emoji)} className="text-2xl hover:bg-gray-100 rounded-lg p-1">{emoji}</button>
                      ))}
                   </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <button type="button" onClick={handleImageClick} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors" title="Gửi ảnh">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      className="w-full pl-4 pr-10 py-3 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500 rounded-xl transition-all outline-none text-sm font-medium"
                      disabled={sending}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-500"
                    >
                        <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!messageInput.trim() || sending}
                    className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <MessageCircle className="w-12 h-12 text-purple-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-600">Chọn một cuộc trò chuyện</h3>
              <p className="text-sm">Chọn từ danh sách bên trái để bắt đầu chat</p>
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
};

export default ProviderChatPage;