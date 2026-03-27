import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Modal } from 'react-bootstrap';
import { API_BASE, formatPrice } from '../utils/constants';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal chi tiết
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ─── Lấy toàn bộ đơn hàng ───────────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders`);
        if (res.ok) {
          const allOrders = await res.json();
          // Sắp xếp mới nhất lên đầu
          allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(allOrders);
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ─── Cập nhật trạng thái đơn hàng (Dùng method PATCH) ─────────────────
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Cập nhật lại state local để UI tự đổi mà không cần load lại trang
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái!');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
    }
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-wrapper" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="loading-text">Đang tải danh sách đơn hàng...</span>
      </div>
    );
  }

  return (
    <div className="admin-page section-padding">
      <Container>
        <div className="admin-header">
          <h2 className="admin-title">
            Quản lý Đơn hàng
            <span>Xem danh sách và cập nhật trạng thái đơn hàng của khách</span>
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <p>Hệ thống chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
            <Table className="admin-table" hover>
              <thead>
                <tr>
                  <th>Mã ĐH</th>
                  <th>Ngày đặt</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>#{String(order.id).padStart(4, '0')}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerInfo?.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customerInfo?.phone}</div>
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--primary)', fontWeight: 600 }}>
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td>
                      <select 
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        style={{ 
                          background: 'rgba(255,255,255,0.05)', 
                          color: 'var(--text-primary)', 
                          border: '1px solid var(--border)',
                          width: '140px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value="Đang xử lý" style={{ color: 'black' }}>Đang xử lý</option>
                        <option value="Đã giao hàng" style={{ color: 'black' }}>Đã giao hàng</option>
                        <option value="Đã hủy" style={{ color: 'black' }}>Đã hủy</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-view-detail" style={{ width: 'auto', padding: '0.35rem 0.75rem', margin: 0 }} onClick={() => openDetailModal(order)}>
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* ── Modal Chi Tiết Đơn Hàng ── */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="modal-dark">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đơn hàng #{selectedOrder && String(selectedOrder.id).padStart(4, '0')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-muted text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Thông tin giao hàng</h6>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <p className="mb-1"><strong>Họ tên:</strong> {selectedOrder.customerInfo.fullName}</p>
                      <p className="mb-1"><strong>SĐT:</strong> {selectedOrder.customerInfo.phone}</p>
                      <p className="mb-1"><strong>Địa chỉ:</strong> {selectedOrder.customerInfo.address}</p>
                      <p className="mb-0"><strong>Thanh toán:</strong> {selectedOrder.customerInfo.paymentMethod === 'cod' ? 'Tiền mặt (COD)' : 'Thẻ tín dụng'}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mt-3 mt-md-0">
                    <h6 className="text-muted text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Tóm tắt đơn hàng</h6>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <p className="mb-1 d-flex justify-content-between"><span>Phí vận chuyển:</span> <span style={{ fontFamily: 'JetBrains Mono' }}>{formatPrice(selectedOrder.shippingFee)}</span></p>
                      <hr style={{ borderColor: 'var(--border)', margin: '0.5rem 0' }} />
                      <p className="mb-1 d-flex justify-content-between"><strong>Tổng thanh toán:</strong> <strong className="text-primary" style={{ fontFamily: 'JetBrains Mono', fontSize: '1.1rem' }}>{formatPrice(selectedOrder.totalAmount)}</strong></p>
                      <p className="mb-0 mt-2"><strong>Trạng thái:</strong> <Badge bg={selectedOrder.status === 'Đang xử lý' ? 'warning' : selectedOrder.status === 'Đã giao hàng' ? 'success' : 'danger'}>{selectedOrder.status}</Badge></p>
                    </div>
                  </div>
                </div>

                <h6 className="text-muted text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Sản phẩm đã đặt</h6>
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="d-flex align-items-center mb-3 p-2" style={{ border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--dark-card)' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div className="ms-3 flex-grow-1">
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Số lượng: {item.quantity}</div>
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono', color: 'var(--primary)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn-modal-secondary" onClick={() => setShowModal(false)}>Đóng</button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default AdminOrders;