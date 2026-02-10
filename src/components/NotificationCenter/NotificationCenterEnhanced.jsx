import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  X, 
  Info, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Volume2, 
  VolumeX
} from 'lucide-react';
import './NotificationCenter.css';

import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '../../services/notificationService';

// --- Toast Component (Popup thông báo góc màn hình) ---
const ToastNotification = ({ notification, onClose, soundEnabled }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Phát âm thanh nếu được bật
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    // Tự đóng sau 5s
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose, soundEnabled]);

  return (
    <div className="toast-notification" onClick={onClose}>
      <audio ref={audioRef} preload="auto">
        {/* Âm thanh thông báo nhẹ nhàng */}
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKzn77BfGgU+ltryxnMpBSuBzvLXiTYIG2W57+SaSwwOUKvm8LRjHAc4kdfy2YA4BxhnvOzt" />
      </audio>
      <div className="toast-icon"><Bell size={20} /></div>
      <div className="toast-content">
        <h4>{notification.title || 'Thông báo mới'}</h4>
        <p>{notification.message}</p>
      </div>
      <button className="toast-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <X size={16} />
      </button>
    </div>
  );
};

// --- Main Component ---
const NotificationCenterEnhanced = () => {
  // State quản lý dữ liệu
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [toasts, setToasts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Refs để xử lý logic không render lại
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const notificationsRef = useRef([]);

  // Cập nhật ref mỗi khi danh sách thay đổi (để dùng trong setInterval)
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // 1. Khởi tạo & Polling (Tự động cập nhật)
  useEffect(() => {
    fetchNotifications();
    
    // Load cài đặt âm thanh từ localStorage
    const savedSound = localStorage.getItem('notificationSound');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');

    // Tự động kiểm tra tin mới mỗi 10 giây
    const interval = setInterval(checkNewNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  // 2. Xử lý click ra ngoài để đóng bảng thông báo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        panelRef.current && 
        !panelRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 3. Logic Lọc (Filter) - Đã thêm tab 'read'
  useEffect(() => {
    let result = [...notifications];
    
    if (filter === 'unread') {
      result = result.filter(n => !n.isRead);
    } else if (filter === 'read') {
      result = result.filter(n => n.isRead);
    }

    // Sắp xếp tin mới nhất lên đầu
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredNotifications(result);
  }, [notifications, filter]);

  // ============ API FUNCTIONS ============

  const fetchNotifications = async () => {
    // Chỉ hiện loading lần đầu
    if (notifications.length === 0) setLoading(true);
    try {
      const data = await getNotifications();
      const list = Array.isArray(data) ? data : [];
      
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Lỗi lấy thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra tin mới (chạy ngầm)
  const checkNewNotifications = async () => {
    try {
      const data = await getNotifications();
      const list = Array.isArray(data) ? data : [];
      
      if (list.length > 0) {
        const currentNotifications = notificationsRef.current;

        // Tìm tin mới dựa trên ID chưa tồn tại trong danh sách cũ
        const newItems = list.filter(n => !currentNotifications.find(old => old.id === n.id));
        
        // Nếu có thay đổi dữ liệu (tin mới hoặc tin cũ bị xóa/đọc ở tab khác)
        if (newItems.length > 0 || list.length !== currentNotifications.length) {
          setNotifications(list);
          setUnreadCount(list.filter(n => !n.isRead).length);

          // Nếu có tin mới thật sự -> Hiện Toast (chỉ hiện 1 cái mới nhất để tránh spam)
          if (newItems.length > 0) {
            newItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            showToast(newItems[0]); 
          }
        }
      }
    } catch (error) {
      // console.error('Polling error:', error);
    }
  };

  // ============ HANDLERS ============

  const showToast = (notification) => {
    // Luôn set lại mảng chỉ chứa 1 phần tử để đảm bảo chỉ hiện 1 toast
    setToasts([{ id: Date.now(), notification }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem('notificationSound', newVal.toString());
  };

  const handleMarkAsRead = async (id, event) => {
    event?.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) { console.error(error); }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id, event) => {
    event?.stopPropagation();
    try {
      await deleteNotification(id);
      const isUnread = notifications.find(n => n.id === id)?.isRead === false;
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (isUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) { console.error(error); }
  };

  // ============ UI HELPERS ============

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="icon-success" size={20} />;
      case 'WARNING': return <AlertCircle className="icon-warning" size={20} />;
      case 'ERROR': return <X className="icon-error" size={20} />;
      default: return <Info className="icon-info" size={20} />;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); 

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <>
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <ToastNotification 
            key={t.id} 
            notification={t.notification} 
            onClose={() => removeToast(t.id)} 
            soundEnabled={soundEnabled} 
          />
        ))}
      </div>

      <div className="notification-center">
        {/* Nút Chuông */}
        <button 
          ref={buttonRef} 
          className={`notification-bell ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Bảng Thông báo (Dropdown) */}
        {isOpen && (
          <div ref={panelRef} className="notification-panel">
            <div className="notification-header">
              <h3>Thông báo</h3>
              <div className="header-actions">
                <button 
                  className="icon-btn" 
                  onClick={toggleSound} 
                  title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'} 
                  style={{ marginRight: '8px' }}
                >
                  {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button 
                  className="mark-all-btn" 
                  onClick={handleMarkAllRead} 
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck size={18} />
                </button>
              </div>
            </div>

            {/* Tabs Lọc: Tất cả - Chưa đọc - Đã đọc */}
            <div className="notification-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`} 
                onClick={() => setFilter('all')}
              >
                Tất cả ({notifications.length})
              </button>
              <button 
                className={`filter-tab ${filter === 'unread' ? 'active' : ''}`} 
                onClick={() => setFilter('unread')}
              >
                Chưa đọc ({unreadCount})
              </button>
              <button 
                className={`filter-tab ${filter === 'read' ? 'active' : ''}`} 
                onClick={() => setFilter('read')}
              >
                Đã đọc ({notifications.length - unreadCount})
              </button>
            </div>

            {/* Danh sách thông báo */}
            <div className="notification-list">
              {loading ? (
                <div className="notification-loading">Đang tải...</div>
              ) : filteredNotifications.length === 0 ? (
                <div className="notification-empty">
                  <Bell size={48} strokeWidth={1} />
                  <p>
                    {filter === 'all' && 'Không có thông báo nào'}
                    {filter === 'unread' && 'Bạn đã đọc hết thông báo'}
                    {filter === 'read' && 'Chưa có thông báo đã đọc'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="notification-icon">{getIcon(notification.type)}</div>
                    
                    <div className="notification-content">
                      <h4 className="notification-title">{notification.title}</h4>
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">
                        <Clock size={12} /> {formatTime(notification.createdAt)}
                      </span>
                    </div>

                    <div className="notification-actions">
                       {!notification.isRead && (
                          <button 
                            className="action-btn read-btn" 
                            title="Đã đọc" 
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <div className="dot"></div>
                          </button>
                       )}
                       <button 
                          className="action-btn delete-btn" 
                          title="Xóa" 
                          onClick={(e) => handleDelete(notification.id, e)}
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="notification-footer">
              <button className="view-all-btn">Xem tất cả</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationCenterEnhanced;