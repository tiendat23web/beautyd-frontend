import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { toast } from "react-toastify";
import { Calendar as CalendarIcon, X } from "lucide-react";
import ProviderLayout from "../../layouts/ProviderLayout";
import {
  getCalendarEvents,
  blockTimeSlot,
  removeBlockedTime,
} from "../../services/providerService";

const ProviderCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockData, setBlockData] = useState({
    title: "",
    start: null,
    end: null,
    type: "break", // break, holiday
  });

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      const response = await getCalendarEvents();
      if (response.status === 200) {
        setEvents(response.data || generateMockEvents());
      } else {
        setEvents(generateMockEvents());
      }
    } catch (error) {
      console.error("Fetch calendar error:", error);
      setEvents(generateMockEvents());
    }
  };

  const generateMockEvents = () => {
    // Mock events for demonstration
    return [
      {
        id: "1",
        title: "Khách hàng: Nguyễn Văn A - Cắt tóc",
        start: new Date(2026, 0, 20, 9, 0),
        end: new Date(2026, 0, 20, 10, 0),
        backgroundColor: "#9333ea",
        borderColor: "#9333ea",
        type: "booking",
      },
      {
        id: "2",
        title: "Nghỉ trưa",
        start: new Date(2026, 0, 20, 12, 0),
        end: new Date(2026, 0, 20, 13, 30),
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        type: "blocked",
      },
    ];
  };

  const handleDateSelect = (selectInfo) => {
    setBlockData({
      title: "",
      start: selectInfo.start,
      end: selectInfo.end,
      type: "break",
    });
    setShowBlockModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const handleBlockTimeSlot = async () => {
    if (!blockData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    try {
      const response = await blockTimeSlot({
        title: blockData.title,
        start: blockData.start,
        end: blockData.end,
        type: blockData.type,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Đã thêm thời gian nghỉ");
        fetchCalendarEvents();
        setShowBlockModal(false);
        setBlockData({ title: "", start: null, end: null, type: "break" });
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Block time error:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleRemoveBlock = async (eventId) => {
    try {
      const response = await removeBlockedTime(eventId);
      if (response.status === 200) {
        toast.success("Đã xóa thời gian nghỉ");
        fetchCalendarEvents();
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error("Remove block error:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <ProviderLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý Lịch
            </h1>
            <p className="text-gray-600">
              Xem lịch đặt chỗ và quản lý thời gian làm việc
            </p>
          </div>
          <CalendarIcon className="w-10 h-10 text-purple-600" />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Hướng dẫn sử dụng
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • Click và kéo trên lịch để chặn thời gian nghỉ trưa hoặc ngày
              nghỉ lễ
            </li>
            <li>• Click vào sự kiện để xem chi tiết đơn hàng</li>
            <li>• Sự kiện màu tím: Đơn đặt chỗ</li>
            <li>• Sự kiện màu đỏ: Thời gian đã block</li>
          </ul>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={viLocale}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Hôm nay",
              month: "Tháng",
              week: "Tuần",
              day: "Ngày",
            }}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            slotDuration="01:00:00"
            snapDuration="01:00:00"
            height="800px"
            contentHeight="auto"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            editable={false}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
          />
        </div>

        {/* Block Time Modal */}
        {showBlockModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Chặn thời gian
                </h3>
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    value={blockData.title}
                    onChange={(e) =>
                      setBlockData({ ...blockData, title: e.target.value })
                    }
                    placeholder="VD: Nghỉ trưa, Nghỉ lễ"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại
                  </label>
                  <select
                    value={blockData.type}
                    onChange={(e) =>
                      setBlockData({ ...blockData, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="break">Nghỉ trưa</option>
                    <option value="holiday">Ngày nghỉ lễ</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bắt đầu
                    </label>
                    <p className="text-sm text-gray-600">
                      {blockData.start?.toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kết thúc
                    </label>
                    <p className="text-sm text-gray-600">
                      {blockData.end?.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowBlockModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleBlockTimeSlot}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tiêu đề</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedEvent.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Thời gian</p>
                  <p className="text-gray-900">
                    {selectedEvent.start?.toLocaleString("vi-VN")} -{" "}
                    {selectedEvent.end?.toLocaleString("vi-VN")}
                  </p>
                </div>

                {selectedEvent.extendedProps?.type === "blocked" && (
                  <button
                    onClick={() => handleRemoveBlock(selectedEvent.id)}
                    className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xóa thời gian chặn
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderCalendarPage;
