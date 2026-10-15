import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { t } from './lib/translations';
import { PUBLIC_ROUTES, getPageMeta, applyPageMeta } from './lib/seo';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import InstallPrompt from './components/InstallPrompt';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import NotFoundPage from './pages/NotFoundPage';
import { PUBLIC_PAGE_COMPONENTS } from './pages/publicPages';

// Signed-in screens are split out so public pages don't ship the map, socket and admin code.
const DonorDashboard = lazy(() => import('./pages/donor/DonorDashboard'));
const CreateListing = lazy(() => import('./pages/donor/CreateListing'));
const DonorClaims = lazy(() => import('./pages/donor/DonorClaims'));
const ReceiverMap = lazy(() => import('./pages/receiver/ReceiverMap'));
const ReceiverClaims = lazy(() => import('./pages/receiver/ReceiverClaims'));
const ClaimTracking = lazy(() => import('./pages/receiver/ClaimTracking'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminListings = lazy(() => import('./pages/admin/AdminListings'));

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
}

function PageMeta() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();

  useEffect(() => {
    applyPageMeta(getPageMeta(pathname, lang));
  }, [pathname, lang]);

  return null;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const { lang } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-warmOrange-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  const homeRedirect = () => {
    if (user?.role === 'donor') return <Navigate to="/donor" />;
    if (user?.role === 'receiver') return <Navigate to="/receiver" />;
    if (user?.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/login" />;
  };

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public, pre-rendered pages (English at /, Urdu at /ur) */}
        {PUBLIC_ROUTES.map(({ path, page }) => {
          const Page = PUBLIC_PAGE_COMPONENTS[page];
          return <Route key={path} path={path} element={page === 'home' && user ? homeRedirect() : <Page />} />;
        })}

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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <>
      <PageMeta />
      <AppRoutes />
      <ToastContainer />
      <InstallPrompt />
    </>
  );
}
