import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE, formatPrice } from '../utils/constants';

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(storedUser);

    const fetchOrders = async () => {
      try {
        // Chỉ gọi API lấy toàn bộ orders (Bỏ các tham số lọc dễ gây lỗi)
        const res = await fetch(`${API_BASE}/orders`);
        
        if (res.ok) {
          const allOrders = await res.json();
          
          // 1. Dùng JavaScript lọc ra các đơn hàng khớp với ID của user
          // (Dùng String() để đảm bảo chuỗi "2" và số 2 đều khớp nhau)
          const userOrders = allOrders.filter(
            order => String(order.userId) === String(user.id)
          );

          // 2. Dùng JavaScript sắp xếp đơn hàng: Mới nhất lên đầu
          userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // Cập nhật state để hiển thị
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);
  return (
    <div className="section-padding">
      <Container>
        <h2 className="text-white mb-4">Lịch sử mua hàng</h2>
        {orders.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-box-seam"></i>
            <p>Bạn chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
            <Table className="admin-table" hover>
              <thead>
                <tr>
                  <th>Mã ĐH</th>
                  <th>Ngày đặt</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{String(order.id).padStart(4, '0')}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {order.items.map(item => (
                        <div key={item.id} style={{ fontSize: '0.85rem' }}>
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)' }}>
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td>
                      <Badge bg={order.status === 'Đang xử lý' ? 'warning' : 'success'}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
}

export default OrderHistory;