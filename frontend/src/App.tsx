import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';


import React, { Suspense, lazy } from 'react';

// Lazy-loaded Public pages
const HomePage = lazy(() => import('./pages/HomePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const FramesPage = lazy(() => import('./pages/FramesPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Lazy-loaded Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminFrames = lazy(() => import('./pages/admin/AdminFrames'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <Navbar />
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]"><div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin border-[#d4af37]" /></div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
              <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
              <Route path="/frames" element={<PublicLayout><FramesPage /></PublicLayout>} />
              <Route path="/order" element={<PublicLayout><OrderPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

              {/* Admin auth */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected admin routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/gallery" element={<AdminGallery />} />
                  <Route path="/admin/services" element={<AdminServices />} />
                  <Route path="/admin/frames" element={<AdminFrames />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/contacts" element={<AdminContacts />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a28',
              color: '#f0f0f5',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#d4af37', secondary: '#000' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
