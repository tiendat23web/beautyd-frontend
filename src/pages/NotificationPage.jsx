import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  CheckCircle,
  MessageCircle,
  Star,
  Trash2,
  Check,
  ChevronLeft,
  Filter,
  MoreVertical,
} from "lucide-react";
import {
  getNotifications,
  markAsRead as markAsReadService,
  deleteNotification as deleteNotificationService,
  markMultipleAsRead,
} from "../services/notificationService";
import Header from "../components/Header";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await markAsReadService(notificationId);
      if (response.status === 200) {
        toast.success("Đã đánh dấu là đã đọc");
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      toast.info("Chức năng đang được phát triển");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await deleteNotificationService(notificationId);
      if (response.status === 200) {
        toast.success("Đã xóa thông báo");
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;

    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedIds.length} thông báo đã chọn?`
      )
    ) {
      try {
        for (const id of selectedIds) {
          await deleteNotificationService(id);
        }
        setSelectedIds([]);
        fetchNotifications();
      } catch (error) {
        console.error("Error deleting selected notifications:", error);
      }
    }
  };

  const markSelectedAsRead = async () => {
    if (selectedIds.length === 0) return;

    try {
      await markMultipleAsRead(selectedIds);
      setSelectedIds([]);
      toast.success("Đã đánh dấu các thông báo đã chọn là đã đọc");
      fetchNotifications();
    } catch (error) {
      console.error("Error marking selected as read:", error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      BOOKING_SUCCESS: {
        icon: <CheckCircle className="w-6 h-6" />,
        color: "bg-green-100 text-green-600",
      },
      BOOKING_REMINDER: {
        icon: <Calendar className="w-6 h-6" />,
        color: "bg-blue-100 text-blue-600",
      },
      BOOKING_CANCELLED: {
        icon: <Calendar className="w-6 h-6" />,
        color: "bg-red-100 text-red-600",
      },
      REVIEW_REMINDER: {
        icon: <Star className="w-6 h-6" />,
        color: "bg-yellow-100 text-yellow-600",
      },
      REVIEW_REPLY: {
        icon: <MessageCircle className="w-6 h-6" />,
        color: "bg-purple-100 text-purple-600",
      },
      PAYMENT_SUCCESS: {
        icon: <CheckCircle className="w-6 h-6" />,
        color: "bg-green-100 text-green-600",
      },
      PROMOTION: {
        icon: <Bell className="w-6 h-6" />,
        color: "bg-pink-100 text-pink-600",
      },
    };
    return icons[type] || icons.BOOKING_SUCCESS;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on type
    try {
      const metadata = JSON.parse(notification.metadata || "{}");

      switch (notification.type) {
        case "BOOKING_SUCCESS":
        case "BOOKING_REMINDER":
        case "BOOKING_CANCELLED":
          if (metadata.bookingId) {
            window.location.href = `/bookings/${metadata.bookingId}`;
          }
          break;
        case "REVIEW_REMINDER":
        case "REVIEW_REPLY":
          if (metadata.serviceId) {
            window.location.href = `/services/${metadata.serviceId}`;
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error parsing metadata:", error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <Header />
      {/* Notifications List */}
      {/* Action Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
            {unreadCount > 0 && (
              <span className="bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {unreadCount > 0 && selectedIds.length === 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        {/* Selected Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="mb-4 bg-purple-100 border border-purple-200 rounded-lg p-3 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredNotifications.length}
                onChange={selectAll}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="font-semibold text-purple-900">
                {selectedIds.length} thông báo đã chọn
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markSelectedAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Đánh dấu đã đọc
              </button>
              <button
                onClick={deleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { value: "all", label: "Tất cả" },
            { value: "unread", label: "Chưa đọc" },
            { value: "read", label: "Đã đọc" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === tab.value
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>{" "}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {filter === "unread"
              ? "Không có thông báo chưa đọc"
              : "Chưa có thông báo"}
          </h3>
          <p className="text-gray-600">
            {filter === "unread"
              ? "Tất cả thông báo của bạn đều đã được đọc"
              : "Bạn sẽ nhận được thông báo về đặt lịch, đánh giá và khuyến mãi tại đây"}
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 pb-6">
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const iconData = getNotificationIcon(notification.type);
              const isSelected = selectedIds.includes(notification.id);

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
                    notification.isRead
                      ? "border-gray-200"
                      : "border-purple-600 bg-purple-50/30"
                  } ${isSelected ? "ring-2 ring-purple-600" : ""}`}
                >
                  <div className="p-4 flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(notification.id);
                      }}
                      className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />

                    {/* Icon */}
                    <div
                      onClick={() => handleNotificationClick(notification)}
                      className="flex-1 flex items-start gap-4"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconData.color}`}
                      >
                        {iconData.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                            className={`font-semibold text-gray-800 ${
                              !notification.isRead ? "font-bold" : ""
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>

                        {/* Unread Indicator */}
                        {!notification.isRead && (
                          <div className="mt-2 inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            Mới
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <Check className="w-5 h-5 text-gray-600" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              "Bạn có chắc muốn xóa thông báo này?"
                            )
                          ) {
                            deleteNotification(notification.id);
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
