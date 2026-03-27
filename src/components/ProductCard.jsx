import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/constants';

function ProductCard({ product, categoryName }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      {/* ── Ảnh sản phẩm ── */}
      <div className="product-img-wrapper">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {categoryName && (
          <span className="category-badge">{categoryName}</span>
        )}
      </div>

      {/* ── Thông tin sản phẩm ── */}
      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">{formatPrice(product.price)}</div>
        <button className="btn-view-detail">
          <i className="bi bi-eye"></i> Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export default ProductCard;