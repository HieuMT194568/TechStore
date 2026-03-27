import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // Thêm import
function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useContext(CartContext);
  // ─── Đọc user từ localStorage ───────────────────────────────────────────
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cập nhật lại user mỗi khi route thay đổi (sau login/logout)
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  // ─── Xử lý Logout ───────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="app-navbar">
      <Container>
        {/* ── Logo / Brand ── */}
        <Navbar.Brand as={Link} to="/">
          <span className="brand-icon">⚡</span>
          TechStore
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-nav"
          style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px' }}
        />

        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link-custom">
              <i className="bi bi-house me-1"></i> Trang Chủ
            </Link>
          </Nav>

          {/* ── Phần bên phải: auth ── */}
         <Nav className="align-items-center gap-2">
            {user ? (
              <>
                {/* Badge tên user */}
                <span className="user-badge">
                  <i className="bi bi-person-fill me-1"></i>
                  {user.fullName || user.username}
                </span>

                {/* ── CHỈ HIỆN CHO USER THƯỜNG (KHÔNG PHẢI ADMIN) ── */}
                {user.role !== 'admin' && (
                  <>
                    <Link to="/cart" className="nav-link-custom position-relative me-2" style={{ textDecoration: 'none' }}>
                      <i className="bi bi-cart3" style={{ fontSize: '1.2rem' }}></i>
                      {totalItems > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                          {totalItems}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="nav-link-custom me-2" style={{ textDecoration: 'none' }}>
                      <i className="bi bi-receipt me-1"></i> Đơn hàng
                    </Link>
                  </>
                )}

                {/* ── CHỈ HIỆN CHO ADMIN ── */}
                {user.role === 'admin' && (
                    <>
                  <Link to="/admin/products" className="btn-nav-admin">
                    <i className="bi bi-grid me-1"></i> Quản trị
                  </Link>

                  <Link to="/admin/orders" className="btn-nav-admin me-2" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                  <i className="bi bi-card-checklist me-1"></i> Quản lý Đơn hàng
                  </Link>
                  <Link to="/admin/products" className="btn-nav-admin">
                  <i className="bi bi-grid me-1"></i> Quản lý Sản phẩm
                  </Link>
                  </>   
                  )}
                

                {/* Nút Đăng xuất */}
                <button className="btn-nav-logout" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
                </button>
              </>
            ) : (
              /* Chưa đăng nhập */
              <Link to="/login" className="btn-nav-admin">
                <i className="bi bi-person me-1"></i> Đăng nhập
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;