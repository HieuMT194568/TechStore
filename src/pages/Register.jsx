import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../utils/constants';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('user')) navigate('/');
  }, [navigate]);

  const handleChange = (e) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim() || !formData.fullName.trim()) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      // Kiểm tra username đã tồn tại chưa
      const checkRes = await fetch(`${API_BASE}/users?username=${formData.username}`);
      const existingUsers = await checkRes.json();
      
      if (existingUsers.length > 0) {
        setError('Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.');
        return;
      }

      // Tạo user mới với role mặc định là 'customer'
      const newUser = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        role: 'customer'
      };

      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!res.ok) throw new Error('Lỗi khi tạo tài khoản.');

      const createdUser = await res.json();
      
      // Tự động đăng nhập sau khi đăng ký
      const { password: _pass, ...safeUser } = createdUser;
      localStorage.setItem('user', JSON.stringify(safeUser));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">⚡</div>
        <h1 className="login-title">Đăng ký</h1>
        <p className="login-subtitle">Tạo tài khoản TechStore mới</p>

        {error && (
          <div className="alert-dark alert-error mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label-custom">Họ và tên</label>
            <input name="fullName" type="text" className="form-control-custom w-100" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label-custom">Tên đăng nhập</label>
            <input name="username" type="text" className="form-control-custom w-100" onChange={handleChange} />
          </div>
          <div className="mb-4">
            <label className="form-label-custom">Mật khẩu</label>
            <input name="password" type="password" className="form-control-custom w-100" onChange={handleChange} />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đã có tài khoản? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;