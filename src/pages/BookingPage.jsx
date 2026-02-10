import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Minus,
  Plus,
  Tag,
  Wallet,
  Navigation,
  MapPinned,
  User,
  AlertCircle
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getServicesById } from "../services/servicesService";
import { createBooking, getBookedTimeSlots } from "../services/bookingService";
// --- 1. IMPORT SERVICE GIẢM GIÁ MỚI ---
import discountService from "../services/discountService"; 
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Header from "../components/Header";

// --- COMPONENT BẢN ĐỒ (Giữ nguyên) ---
const SimpleMapView = ({ address, businessName }) => {
  const handleOpenMap = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="relative h-64 bg-gray-100 overflow-hidden group cursor-pointer rounded-t-3xl" onClick={handleOpenMap}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="bg-white p-4 rounded-full shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300">
          <MapPinned className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="font-bold text-gray-900">{businessName}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 px-4">{address}</p>
        <div className="mt-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 shadow-sm border border-purple-100 flex items-center gap-2">
           <Navigation className="w-3 h-3" /> Nhấn để mở Google Maps
        </div>
      </div>
    </div>
  );
};

// --- MODAL THÔNG BÁO THÀNH CÔNG (Giữ nguyên) ---
const BookingSuccessModal = ({ isOpen, onClose, onNavigateToHistory, bookingDetails }) => {
  if (!isOpen) return null;
  const { userName, serviceName, bookingTime, bookingDate, providerName } = bookingDetails;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 flex items-start gap-4 relative">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl leading-tight">Đang chờ xác nhận</h3>
            <p className="text-purple-100 text-sm mt-1">Yêu cầu đặt lịch đã được gửi</p>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-5 leading-relaxed text-[15px]">
            Cám ơn <span className="font-bold text-purple-600">{userName}</span> đã đặt hẹn <span className="font-bold text-gray-900">{serviceName}</span> vào lúc <span className="font-bold text-gray-900">{bookingTime}</span> ngày <span className="font-bold text-gray-900">{bookingDate}</span>.
          </p>

          <div className="bg-[#FFF9E6] border-l-4 border-[#FFB800] p-4 mb-6 flex gap-3">
            <div className="flex-shrink-0 mt-0.5"><span className="text-lg">⏳</span></div>
            <p className="text-sm text-[#856404] leading-snug">
               <span className="font-bold text-[#856404]">{providerName}</span> sẽ xác nhận lịch hẹn của bạn trong vài phút tới.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={onNavigateToHistory} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all active:scale-[0.98]">
              Xem lịch hẹn
            </button>
            <button onClick={onClose} className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODAL CHỌN LỊCH (Giữ nguyên) ---
const CalendarModal = ({ isOpen, onClose, selectedDate, onSelectDate, bookedTimeSlots, serviceDuration = 60 }) => {
  if (!isOpen) return null;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const vietnamTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const today = new Date(vietnamTime.getFullYear(), vietnamTime.getMonth(), vietnamTime.getDate());
  const currentHour = vietnamTime.getHours();
  const currentMinute = vietnamTime.getMinutes();

  const generateTimeSlots = () => {
    const slots = [];
    let currentSlotMinutes = 8 * 60; // 08:00
    const endMinutes = 21 * 60; // 21:00
    
    while (currentSlotMinutes < endMinutes) {
      const hour = Math.floor(currentSlotMinutes / 60);
      const minute = currentSlotMinutes % 60;
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      currentSlotMinutes += serviceDuration;
    }
    return slots;
  };

  const isTimeDisabled = (time) => {
    if (!selectedDate) return true;
    const selectedDateObj = new Date(selectedDate);
    const isToday = selectedDateObj.toDateString() === today.toDateString();
    
    if (isToday) {
      const [hour, minute] = time.split(':').map(Number);
      if ((hour * 60 + minute) <= (currentHour * 60 + currentMinute)) return true;
    }
    return bookedTimeSlots.includes(time);
  };

  const days = (() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysArr = [];
    for (let i = 0; i < firstDay.getDay(); i++) daysArr.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) daysArr.push(new Date(year, month, day));
    return daysArr;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-scaleIn overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <h3 className="font-bold text-gray-900 text-xl">Chọn lịch hẹn</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 mb-6">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-white rounded-xl shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                <span className="font-bold text-gray-900 capitalize">{currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-white rounded-xl shadow-sm"><ChevronRight className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>)}
                {days.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} />;
                    const isPast = date < today;
                    const dateStr = date.toLocaleDateString('en-CA');
                    return (
                        <button key={idx} onClick={() => { onSelectDate(dateStr, ""); setSelectedTime(""); }} disabled={isPast}
                            className={`aspect-square rounded-xl text-sm font-semibold transition-all flex items-center justify-center
                                ${selectedDate === dateStr ? 'bg-purple-600 text-white shadow-lg' : isPast ? 'text-gray-300' : 'hover:bg-purple-50 text-gray-700'}`}
                        >
                            {date.getDate()}
                        </button>
                    )
                })}
            </div>

            {selectedDate && (
                <div className="animate-fadeIn pb-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                        <Clock className="w-4 h-4 text-purple-600" /> Giờ trống
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {generateTimeSlots().map(time => {
                            const disabled = isTimeDisabled(time);
                            return (
                                <button key={time} onClick={() => !disabled && setSelectedTime(time)} disabled={disabled}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all
                                        ${selectedTime === time ? 'bg-purple-600 text-white shadow-md' : disabled ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border border-gray-200 hover:border-purple-500 hover:text-purple-600'}`}
                                >
                                    {time}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white z-10">
            <button onClick={() => { if(selectedDate && selectedTime) { onSelectDate(selectedDate, selectedTime); onClose(); } }} disabled={!selectedDate || !selectedTime}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
            >
                Xác nhận
            </button>
        </div>
      </div>
    </div>
  );
};

// --- 4. TRANG ĐẶT LỊCH CHÍNH ---
const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // --- STATE MỚI CHO DISCOUNT ---
  const [couponCode, setCouponCode] = useState(""); // Mã nhập vào
  const [appliedDiscount, setAppliedDiscount] = useState(null); // Thông tin mã đã áp dụng (từ API)
  const [couponError, setCouponError] = useState(""); // Lỗi mã
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false); // Loading khi check mã
  // ------------------------------

  const [submitting, setSubmitting] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingSuccessDetails, setBookingSuccessDetails] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetch = async () => {
      try {
        const res = await getServicesById(serviceId);
        setService(res.data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetch();
  }, [serviceId, user]);

  useEffect(() => {
    if (bookingDate && serviceId) {
        getBookedTimeSlots(serviceId, bookingDate).then(res => setBookedTimeSlots(res.bookedTimes || []));
    } else setBookedTimeSlots([]);
  }, [bookingDate, serviceId]);

  // --- HÀM TÍNH TỔNG TIỀN MỚI ---
  const calculateTotal = () => {
    if (!service) return 0;
    const baseTotal = service.price * quantity;
    
    // Nếu có mã giảm giá đã áp dụng, trừ tiền giảm
    if (appliedDiscount) {
        // API trả về appliedDiscount.discountAmount (số tiền giảm)
        // và appliedDiscount.finalPrice (giá sau giảm cho 1 đơn vị hoặc tổng, tuỳ API BE)
        // Tuy nhiên logic BE mình viết là trả về tổng tiền sau giảm.
        // Để an toàn, mình tính lại ở FE dựa trên discountAmount nhận được.
        // Logic BE: discountAmount là tổng số tiền được giảm cho cả đơn.
        
        const final = baseTotal - appliedDiscount.discountAmount;
        return final > 0 ? final : 0;
    }

    return baseTotal;
  };

  // --- HÀM XỬ LÝ ÁP DỤNG MÃ ---
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setIsValidatingCoupon(true);
    
    try {
        // Tính tổng tiền trước khi giảm để gửi xuống BE check điều kiện minOrder
        const totalBeforeDiscount = service.price * quantity;
        
        const res = await discountService.validateCoupon(
            couponCode, 
            serviceId, 
            totalBeforeDiscount
        );

        if (res.valid) {
            setAppliedDiscount({
                id: res.discountId,
                code: res.code,
                discountAmount: res.discountAmount, // Số tiền được giảm
                finalPrice: res.finalPrice
            });
            toast.success(res.message || "Áp dụng mã thành công!");
        }
    } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.error || "Mã giảm giá không hợp lệ";
        setCouponError(errorMsg);
        setAppliedDiscount(null); // Reset nếu lỗi
        toast.error(errorMsg);
    } finally {
        setIsValidatingCoupon(false);
    }
  };

  // --- HÀM GỠ MÃ ---
  const handleRemoveCoupon = () => {
      setAppliedDiscount(null);
      setCouponCode("");
      setCouponError("");
      toast.info("Đã gỡ mã giảm giá");
  };

  // Khi thay đổi số lượng, cần reset discount hoặc check lại (ở đây mình reset cho an toàn để user bấm áp dụng lại tính cho đúng)
  useEffect(() => {
      if (appliedDiscount) {
          setAppliedDiscount(null);
          toast.info("Vui lòng áp dụng lại mã giảm giá sau khi đổi số lượng.");
      }
  }, [quantity]);


  const handleBookingSubmit = async () => {
    if (!bookingDate || !bookingTime) {
      toast.warning("Vui lòng chọn ngày và giờ!");
      setShowCalendarModal(true);
      return;
    }
    setSubmitting(true);
    try {
      const [h, m] = bookingTime.split(":");
      const d = new Date(bookingDate);
      d.setHours(parseInt(h), parseInt(m));

      const response = await createBooking({
        serviceId: parseInt(serviceId),
        bookingDate: d.toISOString(),
        notes: bookingNotes.trim() || undefined,
        // quantity, // BE của bạn chưa xử lý quantity trong createBooking ở code trước, nhưng cứ gửi nếu cần
        // totalAmount: calculateTotal(), // BE tự tính lại để bảo mật, ko cần gửi
        discountId: appliedDiscount ? appliedDiscount.id : null // Gửi ID mã giảm giá
      });

      if (response.status === 400) throw new Error(response.data.error);

      const [y, mon, day] = bookingDate.split("-");
      setBookingSuccessDetails({
        userName: user.fullName,
        serviceName: service.name,
        bookingTime,
        bookingDate: `${day}/${mon}/${y}`,
        providerName: service.provider.businessName,
      });
      setShowSuccessModal(true);
      
      // Reset form
      setBookingDate(""); 
      setBookingTime(""); 
      setBookingNotes(""); 
      setQuantity(1); 
      setAppliedDiscount(null); 
      setCouponCode("");
      
    } catch (error) {
      toast.error(error?.message || "Đặt lịch thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
  if (!service) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">Không tìm thấy dịch vụ</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-12">
      <Header />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: MAP & INFO */}
          <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-gray-100">
             <SimpleMapView address={service.provider.businessAddress} businessName={service.provider.businessName} />
             <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    {service.images?.[0] && <img src={service.images[0].imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-100" />}
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg leading-tight mb-1">{service.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                             <Clock className="w-3.5 h-3.5" /> {service.duration} phút
                             <span className="text-gray-300">|</span>
                             <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> 5.0
                        </div>
                    </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center"><User className="w-4 h-4 text-purple-600"/></div>
                         <div><p className="text-xs text-gray-500">Người đặt</p><p className="font-semibold text-gray-900 text-sm">{user?.fullName}</p></div>
                    </div>
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><MapPin className="w-4 h-4 text-blue-600"/></div>
                         <div><p className="text-xs text-gray-500">Địa điểm</p><p className="font-semibold text-gray-900 text-sm line-clamp-1">{service.provider.businessAddress}</p></div>
                    </div>
                </div>
             </div>
          </div>

          {/* CỘT PHẢI: FORM */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Thông tin đặt lịch</h1>

                <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                             <label className="text-sm font-semibold text-gray-700">Ngày và giờ <span className="text-red-500">*</span></label>
                             <button onClick={() => setShowCalendarModal(true)} className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all ${bookingDate ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                                 <div className="flex items-center gap-3">
                                     <div className="bg-white p-2 rounded-xl shadow-sm"><Calendar className="w-5 h-5 text-purple-600" /></div>
                                     <div className="text-left">
                                         <p className="text-xs text-gray-500">Thời gian</p>
                                         <p className={`font-bold ${bookingDate ? 'text-purple-700' : 'text-gray-400'}`}>
                                             {bookingDate && bookingTime ? `${bookingTime} - ${new Date(bookingDate).toLocaleDateString('vi-VN')}` : "Chạm để chọn"}
                                         </p>
                                     </div>
                                 </div>
                             </button>
                         </div>

                         <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700">Số lượng</label>
                              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-3">
                                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Minus className="w-4 h-4 text-gray-600"/></button>
                                   <span className="font-bold text-lg text-gray-900">{quantity}</span>
                                   <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Plus className="w-4 h-4 text-gray-600"/></button>
                              </div>
                         </div>
                     </div>

                     <div className="space-y-2">
                           <label className="text-sm font-semibold text-gray-700">Ghi chú</label>
                           <textarea value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="Yêu cầu đặc biệt..." className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 min-h-[100px] resize-none text-sm" />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* --- PHẦN  (CẬP NHẬT) --- */}
                           <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Mã giảm giá</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={couponCode} 
                                            onChange={(e) => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponError(""); // Xóa lỗi khi nhập lại
                                            }}
                                            placeholder="Nhập mã " 
                                            className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm transition-all
                                                ${couponError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500'}
                                                ${appliedDiscount ? 'bg-gray-100 text-gray-500' : 'bg-white'}
                                            `}
                                            disabled={!!appliedDiscount} // Khóa ô nhập khi đã áp dụng
                                        />
                                    </div>
                                    {appliedDiscount ? (
                                        <button 
                                            onClick={handleRemoveCoupon} 
                                            className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl text-sm font-bold transition-colors"
                                        >
                                            Gỡ bỏ
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleApplyCoupon} 
                                            disabled={isValidatingCoupon || !couponCode}
                                            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 rounded-xl text-sm font-bold transition-colors"
                                        >
                                            {isValidatingCoupon ? "..." : "Áp dụng"}
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {couponError}</p>}
                                {appliedDiscount && <p className="text-xs text-green-600 mt-1 font-medium">Đã áp dụng mã: {appliedDiscount.code}</p>}
                           </div>
                           
                           <div className="space-y-2">
                               <label className="text-sm font-semibold text-gray-700">Thanh toán</label>
                               <div className="flex items-center gap-3 p-3 border border-purple-200 bg-purple-50 rounded-xl">
                                   <Wallet className="w-5 h-5 text-orange-500"/>
                                   <div className="flex-1"><p className="text-sm font-bold text-gray-900">Thanh toán tại chỗ</p><p className="text-xs text-gray-500"></p></div> 
                                   <div className="w-4 h-4 rounded-full border-[5px] border-purple-600"></div>
                               </div>
                           </div>
                     </div>
                     
                     <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                         <div className="flex justify-between text-sm text-gray-600">
                             <span>Đơn giá</span>
                             <span>{new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(service.price)} x {quantity}</span>
                         </div>
                         
                         {/* --- HIỂN THỊ DÒNG GIẢM GIÁ --- */}
                         {appliedDiscount && (
                            <div className="flex justify-between text-sm text-green-600 font-medium animate-fadeIn">
                                <span>Mã giảm giá ({appliedDiscount.code})</span>
                                <span>-{new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(appliedDiscount.discountAmount)}</span>
                            </div>
                         )}

                         <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                             <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                             <span className="font-bold text-2xl text-purple-600">
                                 {new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(calculateTotal())}
                             </span>
                         </div>
                         <button onClick={handleBookingSubmit} disabled={submitting} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
                             {submitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                         </button>
                     </div>
                </div>
          </div>
        </div>
      </div>

      <style>{`
         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
         @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
         .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
         .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
      `}</style>

      {/* Modals */}
      <CalendarModal isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)} selectedDate={bookingDate} onSelectDate={(d, t) => { setBookingDate(d); if(t) setBookingTime(t); }} bookedTimeSlots={bookedTimeSlots} serviceDuration={service?.duration || 60} />
      {showSuccessModal && bookingSuccessDetails && <BookingSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} onNavigateToHistory={() => navigate('/bookings')} bookingDetails={bookingSuccessDetails} />}
    </div>
  );
};

export default BookingPage;