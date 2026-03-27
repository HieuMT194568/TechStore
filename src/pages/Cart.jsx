import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/constants';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="section-padding text-center">
        <Container>
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h2 className="mt-3 text-white">Giỏ hàng trống</h2>
          <p className="text-muted">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link to="/" className="btn-nav-admin mt-3">Tiếp tục mua sắm</Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <Container>
        <h2 className="mb-4 text-white">Giỏ hàng của bạn</h2>
        <Row>
          <Col lg={8}>
            {cartItems.map(item => (
              <div key={item.id} className="d-flex align-items-center mb-3 p-3" style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <div className="ms-3 flex-grow-1">
                  <h5 className="text-white mb-1" style={{ fontSize: '1rem' }}>{item.name}</h5>
                  <div className="text-primary" style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{formatPrice(item.price)}</div>
                </div>
                <div className="d-flex align-items-center">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="mx-3 text-white">{item.quantity}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="btn text-danger ms-4" onClick={() => removeFromCart(item.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </Col>
          <Col lg={4}>
            <div className="p-4" style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <h4 className="text-white mb-4">Tổng cộng</h4>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Tạm tính:</span>
                <span className="text-white" style={{ fontFamily: 'JetBrains Mono' }}>{formatPrice(totalPrice)}</span>
              </div>
              <hr style={{ borderColor: 'var(--border)' }} />
              <div className="d-flex justify-content-between mb-4">
                <strong className="text-white">Tổng thanh toán:</strong>
                <strong className="text-primary" style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem' }}>{formatPrice(totalPrice)}</strong>
              </div>
              <Link 
  to="/checkout" 
  className="btn-modal-primary w-100 text-center" 
  style={{ textDecoration: 'none', display: 'inline-block' }}
>
  Tiến hành thanh toán
</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Cart;