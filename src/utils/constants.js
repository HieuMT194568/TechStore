// Base URL của json-server
export const API_BASE = 'http://localhost:3001';

// Format giá tiền VNĐ
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};