import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/RouteGuards';

// Layouts
import Navbar from './components/common/Navbar';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Guest only */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Authenticated users */}
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
