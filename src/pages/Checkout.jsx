import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/constants';
import { API_BASE } from '../utils/constants';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'cod' // 'cod' hoặc 'card'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Nếu giỏ hàng trống thì đẩy về trang chủ
  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/');
    }
  }, [cartItems, navigate, success]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Lấy thông tin user hiện tại (nếu có đăng nhập)
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Tạo payload đơn hàng
    const newOrder = {
      userId: user ? user.id : 'guest', // Phân biệt khách vãng lai và user có tài khoản
      customerInfo: formData,
      items: cartItems,
      shippingFee: 30000,
      totalAmount: totalPrice + 30000,
      status: 'Đang xử lý', // Trạng thái mặc định
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (!res.ok) throw new Error('Có lỗi xảy ra khi tạo đơn hàng.');

      // Nếu thành công
      setSuccess(true);
      clearCart();

      // Sau 3 giây tự về trang chủ
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      alert(error.message); // Tạm thời dùng alert, bạn có thể tạo state error để hiện UI đẹp hơn
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section-padding text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container>
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
          <h2 className="mt-4 text-white">Thanh toán thành công!</h2>
          <p className="text-muted">Cảm ơn bạn đã mua sắm tại TechStore.<br/>Đơn hàng của bạn đang được xử lý và sẽ sớm được giao.</p>
          <div className="spinner-border text-primary mt-3" role="status" style={{ width: '1.5rem', height: '1.5rem' }}></div>
          <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Đang tự động quay về trang chủ...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <Container>
        <button className="back-btn mb-4" onClick={() => navigate('/cart')}>
          <i className="bi bi-arrow-left"></i> Quay lại giỏ hàng
        </button>

        <h2 className="mb-4 text-white">Thanh toán</h2>
        
        <Row className="g-4">
          <Col lg={7}>
            <div className="p-4" style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <h4 className="text-white mb-4" style={{ fontSize: '1.25rem' }}>Thông tin giao hàng</h4>
              <form id="checkout-form" onSubmit={handleCheckout}>
                <div className="mb-3">
                  <label className="form-label-custom">Họ và tên người nhận</label>
                  <input required name="fullName" type="text" className="form-control-custom w-100" value={formData.fullName} onChange={handleChange} placeholder="VD: Nguyễn Văn A" />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Số điện thoại</label>
                  <input required name="phone" type="tel" className="form-control-custom w-100" value={formData.phone} onChange={handleChange} placeholder="VD: 0912345678" />
                </div>
                <div className="mb-4">
                  <label className="form-label-custom">Địa chỉ giao hàng chi tiết</label>
                  <textarea required name="address" className="form-control-custom w-100" value={formData.address} onChange={handleChange} rows="3" placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."></textarea>
                </div>

                <h4 className="text-white mb-3 mt-4" style={{ fontSize: '1.25rem' }}>Phương thức thanh toán</h4>
                <div className="d-flex flex-column gap-2 mb-2">
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                </div>
                
                {formData.paymentMethod === 'card' && (
                  <div className="p-3 mt-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <div className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}><i className="bi bi-info-circle me-1"></i> (Giả lập) Vui lòng nhập thông tin thẻ</div>
                    <input type="text" className="form-control-custom w-100 mb-2" placeholder="Số thẻ (VD: 4123 4567 8901 2345)" required />
                    <div className="d-flex gap-2">
                      <input type="text" className="form-control-custom w-50" placeholder="MM/YY" required />
                      <input type="text" className="form-control-custom w-50" placeholder="CVC" required />
                    </div>
                  </div>
                )}
              </form>
            </div>
          </Col>

          <Col lg={5}>
            <div className="p-4" style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', position: 'sticky', top: '100px' }}>
              <h4 className="text-white mb-4" style={{ fontSize: '1.25rem' }}>Đơn hàng của bạn</h4>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '10px' }}>
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div>
                        <div className="text-white" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>SL: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-white" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: 'var(--border)' }} />
              
              <div className="d-flex justify-content-between mb-2 mt-3">
                <span className="text-muted">Tạm tính:</span>
                <span className="text-white" style={{ fontFamily: 'JetBrains Mono' }}>{formatPrice(totalPrice)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Phí vận chuyển:</span>
                <span className="text-white" style={{ fontFamily: 'JetBrains Mono' }}>{formatPrice(30000)}</span>
              </div>
              
              <hr style={{ borderColor: 'var(--border)' }} />
              
              <div className="d-flex justify-content-between mb-4 mt-3">
                <strong className="text-white">Tổng thanh toán:</strong>
                <strong className="text-primary" style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem' }}>{formatPrice(totalPrice + 30000)}</strong>
              </div>

              <button form="checkout-form" type="submit" className="btn-modal-primary w-100 d-flex justify-content-center align-items-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-check"></i> Đặt hàng ngay
                  </>
                )}
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Checkout;