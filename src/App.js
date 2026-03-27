import React from 'react';  
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminOrders from './pages/AdminOrders';
// ─── Protected Route: chỉ cho admin vào ───────────────────────
const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ─── Protected Route: chỉ cho user thường (customer) vào ──────────────────
const ProtectedCustomerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  // Nếu chưa đăng nhập HOẶC là admin thì đẩy về trang chủ (hoặc login)
  if (!user || user.role === 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* Navbar hiển thị ở mọi trang */}
      <AppNavbar />

      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<Home />} />

        {/* Đăng nhập & Đăng ký */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Chi tiết sản phẩm */}
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* ── Các trang dành riêng cho User thường ── */}
        <Route 
          path="/cart" 
          element={
            <ProtectedCustomerRoute>
              <Cart />
            </ProtectedCustomerRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedCustomerRoute>
              <Checkout />
            </ProtectedCustomerRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedCustomerRoute>
              <OrderHistory />
            </ProtectedCustomerRoute>
          } 
        />
        <Route
  path="/admin/orders"
  element={
    <ProtectedAdminRoute>
      <AdminOrders />
    </ProtectedAdminRoute>
  }
/>
        {/* ── Admin Dashboard - chỉ role admin ── */}
        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback: điều hướng về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>         
      <Footer />
    </BrowserRouter>
  );
}

export default App;
