import { Home } from "lucide-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// --- IMPORT COMPONENT MỚI (Để theo dõi Online/Offline) ---
import OnlineStatusManager from "./components/OnlineStatusManager";
// --------------------------------------------------------
import VerifyEmailPage from "./pages/VerifyEmailPage";
// Imports các trang dành cho người dùng
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgetPassWord from "./pages/ForgetPassWord";
import ProfilePage from "./pages/ProfilePage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ServicesListPage from "./pages/ServicesListPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotificationsPage from "./pages/NotificationPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import MessagesPage from "./pages/MessagesPage";
import MapPage from "./pages/MapPage";
import ProviderShopPage from "./pages/ProviderShopPage";
import BookingPage from "./pages/BookingPage"; 
import BeautyBlog from "./pages/Beautyblog"; 
import BookingDetailsPage from "./pages/BookingDetailsPage";
// --- MỚI: Trang Kho ưu đãi ---
import MyCoupons from "./pages/MyCoupons"; 

// Imports các trang dành cho Provider
import ProviderKYCPage from "./pages/provider/ProviderKYCPage";
import ProviderDashboardPage from "./pages/provider/ProviderDashboardPage";
import ProviderCalendarPage from "./pages/provider/ProviderCalendarPage";
import ProviderServicesPage from "./pages/provider/ProviderServicesPage";
import ProviderServiceFormPage from "./pages/provider/ProviderServiceFormPage";
import ProviderBookingsPage from "./pages/provider/ProviderBookingsPage";
import ProviderBookingDetailPage from "./pages/provider/ProviderBookingDetailPage";
import ProviderReviewsPage from "./pages/provider/ProviderReviewsPage";
import ProviderChatPage from "./pages/provider/ProviderChatPage"; 
// ✅ ĐÃ CẬP NHẬT: Import trang tạo mã giảm giá cho Provider
import CreateDiscount from "./pages/provider/CreateDiscount"; 

// Imports các trang dành cho Admin
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminKYCPage from "./pages/admin/AdminKYCPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* --- KÍCH HOẠT THEO DÕI ONLINE TRÊN TOÀN APP --- */}
        <OnlineStatusManager />
        {/* ----------------------------------------------- */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 999999 }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forget-password" element={<ForgetPassWord />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/services" element={<ServicesListPage />} />
          <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/booking-details/:id" element={<BookingDetailsPage />} />
          <Route path="/booking/:serviceId" element={<BookingPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/blog" element={<BeautyBlog />} />
          
          {/* --- MỚI: Route trang ưu đãi (Cần đăng nhập) --- */}
          <Route path="/my-coupons" element={
            <ProtectedRoute>
               <MyCoupons />
            </ProtectedRoute>
          } />

          <Route path="/bookings" element={<BookingHistoryPage />} />
          <Route path="/booking/:id" element={<BookingDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:userId" element={<MessagesPage />} />
          <Route path="/map" element={<MapPage />} />
          
          <Route path="/shop/:providerId" element={<ProviderShopPage />} />

          {/* Provider Routes - Protected */}
          <Route path="/provider/kyc" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderKYCPage />
            </ProtectedRoute>
          } />
          <Route path="/provider/dashboard" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/provider/calendar" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderCalendarPage />
            </ProtectedRoute>
          } />
          <Route path="/provider/services" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderServicesPage />
            </ProtectedRoute>
          } />
          <Route path="/provider/services/new" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderServiceFormPage />
            </ProtectedRoute>
          } />
          <Route path="/provider/services/edit/:id" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderServiceFormPage />
            </ProtectedRoute>
          } />
          <Route path="/provider/bookings" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderBookingsPage />
            </ProtectedRoute>
          } />
          <Route path="/provider/booking/:id" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderBookingDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/provider/reviews" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderReviewsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/provider/messages" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderChatPage />
            </ProtectedRoute>
          } />

          {/* ✅ ĐÃ CẬP NHẬT: Route tạo mã giảm giá cho Provider */}
          <Route path="/provider/discounts/new" element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <CreateDiscount />
            </ProtectedRoute>
          } />

          {/* Admin Routes - Protected */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/kyc" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminKYCPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />
              
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;