import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import InstallPrompt from './components/InstallPrompt';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import DonorDashboard from './pages/donor/DonorDashboard';
import CreateListing from './pages/donor/CreateListing';
import DonorClaims from './pages/donor/DonorClaims';
import ReceiverMap from './pages/receiver/ReceiverMap';
import ReceiverClaims from './pages/receiver/ReceiverClaims';
import ClaimTracking from './pages/receiver/ClaimTracking';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminListings from './pages/admin/AdminListings';
import LandingPage from './pages/LandingPage';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-warmOrange-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">Loading FoodShare...</p>
        </div>
      </div>
    );
  }

  const homeRedirect = () => {
    if (!user) return <LandingPage />;
    if (user.role === 'donor') return <Navigate to="/donor" />;
    if (user.role === 'receiver') return <Navigate to="/receiver" />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={homeRedirect()} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/verify-otp" element={user ? <Navigate to="/" /> : <OTPVerificationPage />} />

      {/* Donor routes */}
      <Route path="/donor" element={<ProtectedRoute roles={['donor']}><Layout><DonorDashboard /></Layout></ProtectedRoute>} />
      <Route path="/donor/create" element={<ProtectedRoute roles={['donor']}><Layout><CreateListing /></Layout></ProtectedRoute>} />
      <Route path="/donor/claims" element={<ProtectedRoute roles={['donor']}><Layout><DonorClaims /></Layout></ProtectedRoute>} />

      {/* Receiver routes */}
      <Route path="/receiver" element={<ProtectedRoute roles={['receiver']}><Layout><ReceiverMap /></Layout></ProtectedRoute>} />
      <Route path="/receiver/claims" element={<ProtectedRoute roles={['receiver']}><Layout><ReceiverClaims /></Layout></ProtectedRoute>} />
      <Route path="/receiver/tracking/:claimId" element={<ProtectedRoute roles={['receiver']}><Layout><ClaimTracking /></Layout></ProtectedRoute>} />

      {/* Common routes */}
      <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationsPage /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><Layout><AdminUsers /></Layout></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><Layout><AdminReports /></Layout></ProtectedRoute>} />
      <Route path="/admin/listings" element={<ProtectedRoute roles={['admin']}><Layout><AdminListings /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
      <InstallPrompt />
    </>
  );
}
