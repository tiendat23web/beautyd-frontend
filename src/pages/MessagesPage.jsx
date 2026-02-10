import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Search, Send, Paperclip, MoreVertical, Phone, Video, 
  Image as ImageIcon, Smile, MessageCircle, User as UserIcon, ArrowLeft,
  CheckCircle2, Store
} from "lucide-react";
import Header from "../components/Header";
// import Footer from "../components/Footer"; 
import {
  getConversations,
  getMessages,
  sendMessage,
  markAllAsRead,
} from "../services/messageService";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const MessagesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  
  const [, setCurrentTime] = useState(new Date());

  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  const EMOJI_LIST = ['👍', '❤️', '😊', '😂', '😭', '😡', '🎉', '👋', 'OK', '🙏', '😍', '🤔'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId && conversations.length > 0) {
      const targetUserId = parseInt(userId);
      const existingConv = conversations.find((c) => c.user.id === targetUserId);
      if (existingConv) {
        handleSelectConversation(existingConv.user);
      } else if (!selectedUser || selectedUser.id !== targetUserId) {
        const placeholderUser = { 
            id: targetUserId, 
            fullName: "Người dùng", 
            businessName: null, 
            avatar: null, 
            role: 'USER' 
        };
        handleSelectConversation(placeholderUser);
      }
    }
  }, [userId, conversations.length]);

  useEffect(() => {
    if (selectedUser) {
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(selectedUser.id);
        fetchConversations(false);
      }, 3000);
      return () => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      };
    }
  }, [selectedUser?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const fetchConversations = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await getConversations();
      
      // --- LOG KIỂM TRA DỮ LIỆU (F12) ---
      console.log("👉 Dữ liệu Conversations:", data); 
      // Nếu ở đây bạn không thấy trường 'businessName' trong object user,
      // nghĩa là Backend chưa gửi nó lên.
      // ----------------------------------

      setConversations(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchMessages = async (targetUserId) => {
    try {
      const data = await getMessages(targetUserId);
      setMessages(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectConversation = async (targetUser) => {
    setSelectedUser(targetUser);
    if (window.innerWidth < 768) {
      navigate(`/messages/${targetUser.id}`, { replace: true });
    }
    try {
      await fetchMessages(targetUser.id);
      await markAllAsRead(targetUser.id);
      fetchConversations(false);
      scrollToBottom();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getUserStatus = (targetUser) => {
    if (!targetUser || !targetUser.lastActiveAt) return <span className="text-xs text-gray-400">Ngoại tuyến</span>;
    const lastTime = new Date(targetUser.lastActiveAt);
    const diffMinutes = Math.floor((new Date() - lastTime) / 60000);

    if (diffMinutes < 2) {
      return <span className="text-xs font-bold text-green-500 flex items-center gap-1">● Đang hoạt động</span>;
    }
    if (diffMinutes < 60) return <span className="text-xs text-gray-500">{diffMinutes} phút trước</span>;
    return <span className="text-xs text-gray-500">{Math.floor(diffMinutes / 60)} giờ trước</span>;
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedUser) return;
    const content = inputText.trim();
    setInputText("");
    setSending(true);
    setShowEmoji(false);
    try {
      await sendMessage(selectedUser.id, content);
      await fetchMessages(selectedUser.id);
      fetchConversations(false);
      scrollToBottom(); 
    } catch (error) {
      toast.error("Lỗi gửi tin");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;
    setSending(true);
    try {
      await sendMessage(selectedUser.id, `[Hình ảnh: ${file.name}]`);
      await fetchMessages(selectedUser.id);
      scrollToBottom();
    } catch (error) {
      toast.error("Lỗi gửi ảnh");
    } finally {
      setSending(false);
      e.target.value = null;
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    const msgDate = new Date(date);
    const diffMinutes = Math.floor((new Date() - msgDate) / 60000);
    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} giờ`;
    return msgDate.toLocaleDateString("vi-VN");
  };

  // --- LOGIC HIỂN THỊ TÊN CHUẨN ---
  const getDisplayName = (user) => {
      // Log kiểm tra từng user (Optional: mở comment nếu cần debug sâu)
      // console.log("Checking user:", user.fullName, "Role:", user.role, "Business:", user.businessName);
      
      if (user?.role === 'PROVIDER' && user?.businessName) {
          return user.businessName;
      }
      return user?.fullName || "Người dùng";
  };
  // --------------------------------

  const filteredConversations = conversations.filter(conv => {
    const nameToSearch = getDisplayName(conv.user);
    return nameToSearch.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden font-sans text-gray-900">
      <Header />

      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-6 h-[calc(100vh-80px)]">
        <div className="bg-white w-full h-full rounded-3xl shadow-2xl flex overflow-hidden border border-gray-100">
          
          {/* SIDEBAR TRÁI */}
          <div className={`${selectedUser && window.innerWidth < 768 ? "hidden" : "flex"} w-full md:w-[350px] lg:w-[400px] flex-col border-r border-gray-100`}>
            <div className="p-6 bg-[#9333ea] text-white">
              <h2 className="text-2xl font-bold mb-4">Tin nhắn</h2>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/20 border border-white/10 placeholder-purple-100 text-white focus:outline-none focus:bg-white focus:text-gray-800 focus:placeholder-gray-400 transition-all shadow-inner"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-100 group-focus-within:text-gray-500" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Đang tải...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                  <MessageCircle size={48} className="mb-2 opacity-20" />
                  <p>Chưa có cuộc trò chuyện nào</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.user.id}
                    onClick={() => handleSelectConversation(conv.user)}
                    className={`relative p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all
                      ${selectedUser?.id === conv.user.id ? "bg-purple-50/50" : ""}
                    `}
                  >
                    {selectedUser?.id === conv.user.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9333ea]" />
                    )}

                    <div className="relative shrink-0">
                      {conv.user.avatar ? (
                        <img src={conv.user.avatar} className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm" alt="" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl shadow-sm">
                          {getDisplayName(conv.user).charAt(0)}
                        </div>
                      )}
                      {(new Date() - new Date(conv.user.lastActiveAt || 0)) < 120000 && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                           <h3 className={`font-bold truncate text-[15px] ${selectedUser?.id === conv.user.id ? 'text-[#9333ea]' : 'text-gray-800'}`}>
                             {getDisplayName(conv.user)}
                           </h3>
                           {conv.user.role === 'PROVIDER' && (
                             <span className="flex-shrink-0 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-blue-200">
                               Nhà cung cấp
                             </span>
                           )}
                        </div>
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">{formatTime(conv.lastMessage?.createdAt)}</span>
                      </div>
                      
                      {/* Hiển thị thêm tên chủ shop nếu là Provider và có businessName */}
                      {conv.user.role === 'PROVIDER' && conv.user.businessName && (
                          <div className="flex items-center gap-1 mb-0.5">
                             <Store size={10} className="text-gray-400"/>
                             <p className="text-[10px] text-gray-500 font-medium truncate">
                                Chủ shop: {conv.user.fullName}
                             </p>
                          </div>
                      )}

                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate pr-2 ${conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                          {conv.lastMessage?.senderId === user.id && "Bạn: "}{conv.lastMessage?.content}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="shrink-0 h-5 min-w-[20px] px-1.5 bg-[#9333ea] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CHAT WINDOW (PHẢI) */}
          <div className={`${!selectedUser && window.innerWidth < 768 ? "hidden" : "flex"} flex-1 flex-col bg-[#FDFDFD] relative`}>
            {selectedUser ? (
              <>
                {/* Header Chat */}
                <div className="h-[80px] px-6 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-20">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="relative">
                      {selectedUser.avatar ? (
                        <img src={selectedUser.avatar} className="w-11 h-11 rounded-full object-cover border border-gray-100" alt="" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                          {getDisplayName(selectedUser).charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            {getDisplayName(selectedUser)}
                        </h3>
                        {selectedUser.role === 'PROVIDER' && (
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                             <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                             <span className="text-[10px] font-black uppercase tracking-tight">Nhà cung cấp</span>
                          </div>
                        )}
                      </div>
                      
                      {selectedUser.role === 'PROVIDER' && selectedUser.businessName && (
                          <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                             <Store size={12} /> Chủ shop: {selectedUser.fullName}
                          </p>
                      )}
                      
                      {getUserStatus(selectedUser)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2.5 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"><Phone size={22} /></button>
                    <button className="p-2.5 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"><Video size={22} /></button>
                    <button className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors"><MoreVertical size={22} /></button>
                  </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa] custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                          <MessageCircle size={48} className="text-purple-200" />
                      </div>
                      <p className="text-base font-medium">Bắt đầu trò chuyện ngay</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwn = msg.senderId === user.id;
                      const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== msg.senderId);

                      return (
                        <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-3 group`}>
                          {!isOwn && (
                            <div className="w-8 flex-shrink-0">
                              {showAvatar && (
                                selectedUser.avatar ? 
                                  <img src={selectedUser.avatar} className="w-8 h-8 rounded-full object-cover shadow-sm" alt="" /> : 
                                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">{getDisplayName(selectedUser).charAt(0)}</div>
                              )}
                            </div>
                          )}

                          <div className={`max-w-[70%] relative ${isOwn ? 'text-right' : 'text-left'}`}>
                            <div 
                              className={`
                                inline-block px-5 py-3 text-[15px] shadow-sm leading-relaxed
                                ${isOwn 
                                  ? "bg-[#9333ea] text-white rounded-2xl rounded-tr-sm" 
                                  : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
                                }
                              `}
                            >
                              <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            
                            <p className={`text-[11px] mt-1.5 font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isOwn ? "text-gray-400 mr-1" : "text-gray-400 ml-1"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-5 bg-white border-t border-gray-100 relative">
                  {showEmoji && (
                    <div className="absolute bottom-24 right-6 bg-white shadow-2xl border border-gray-100 rounded-2xl p-4 grid grid-cols-6 gap-2 w-72 z-30 animate-in fade-in slide-in-from-bottom-4">
                      {EMOJI_LIST.map(emoji => (
                        <button key={emoji} onClick={() => setInputText(prev => prev + emoji)} className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-transform hover:scale-110">{emoji}</button>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    
                    <div className="flex gap-1 text-gray-400">
                        <button type="button" onClick={() => fileInputRef.current.click()} className="p-2.5 hover:text-[#9333ea] hover:bg-purple-50 rounded-full transition-colors">
                            <ImageIcon size={22} />
                        </button>
                        <button type="button" className="p-2.5 hover:text-[#9333ea] hover:bg-purple-50 rounded-full transition-colors">
                            <Paperclip size={22} />
                        </button>
                    </div>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="w-full pl-5 pr-12 py-3.5 bg-gray-100/80 border-transparent focus:bg-white focus:ring-2 focus:ring-[#9333ea]/30 focus:border-[#9333ea] rounded-full outline-none text-gray-800 transition-all placeholder-gray-500"
                        disabled={sending}
                      />
                      <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9333ea] transition-colors">
                        <Smile size={22} />
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!inputText.trim() || sending}
                      className="p-3.5 bg-[#9333ea] text-white rounded-full hover:bg-purple-700 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                      <Send size={20} className={sending ? "animate-pulse" : "ml-0.5"} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#fafafa]">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 animate-pulse">
                  <MessageCircle size={64} className="text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Chào mừng đến với BeautyD</h3>
                <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu kết nối</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SỬA LỖI CSS TẠI ĐÂY: Dùng thẻ style chuẩn thay vì jsx */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;