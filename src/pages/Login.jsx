import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../utils/constants';

function Login() {
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Nếu đã đăng nhập → về trang chủ
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) navigate('/');
  }, [navigate]);

  // ─── Xử lý thay đổi input ────────────────────────────────────────────────
  const handleChange = (e) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── Xử lý Submit đăng nhập ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Gọi API lấy danh sách users khớp username
      const res = await fetch(
        `${API_BASE}/users?username=${encodeURIComponent(formData.username)}`
      );

      if (!res.ok) {
        throw new Error('Không thể kết nối server. Hãy kiểm tra json-server đang chạy.');
      }

      const users = await res.json();

      // Tìm user khớp cả username và password
      const matched = users.find(
        (u) =>
          u.username === formData.username &&
          u.password === formData.password
      );

      if (!matched) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        return;
      }

      // Lưu thông tin user vào localStorage (không lưu password)
      const { password: _pass, ...safeUser } = matched;
      localStorage.setItem('user', JSON.stringify(safeUser));

      // Điều hướng: admin → /admin/products, customer → /
      if (matched.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* ── Logo ── */}
        <div className="login-logo">⚡</div>
        <h1 className="login-title">Đăng nhập</h1>
        <p className="login-subtitle">TechStore — Cửa hàng Thiết bị Công nghệ</p>

        {/* ── Error Alert ── */}
        {error && (
          <div className="alert-dark alert-error mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label-custom" htmlFor="username">
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-control-custom w-100"
              placeholder="Nhập username..."
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label-custom" htmlFor="password">
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control-custom w-100"
                placeholder="Nhập mật khẩu..."
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '1rem',
                }}
              >
                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                Đăng nhập
              </>
            )}
          </button>
        </form>

        {/* ── Gợi ý tài khoản ── */}
        <div className="login-hint">
          <div style={{ marginBottom: '6px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <i className="bi bi-info-circle me-1"></i> Tài khoản demo:
          </div>
          <div>
            Admin: <code>admin</code> / <code>admin123</code>
          </div>
          <div style={{ marginTop: '4px' }}>
            Khách hàng: <code>user</code> / <code>user123</code>
          </div>
        </div>

        {/* ── Back to home ── */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/"
            style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}
          >
            <i className="bi bi-arrow-left me-1"></i> Về trang chủ
          </Link>
        </div>
        {/* Thêm đoạn này dưới nút "Về trang chủ" */}
<div style={{ textAlign: 'center', marginTop: '1rem' }}>
  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có tài khoản? </span>
  <Link to="/register" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
    Đăng ký ngay
  </Link>
</div>
      </div>
    </div>
  );
}

export default Login;