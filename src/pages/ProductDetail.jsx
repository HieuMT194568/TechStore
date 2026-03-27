import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { API_BASE, formatPrice } from '../utils/constants';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
function ProductDetail() {
  // ─── Hooks ────────────────────────────────────────────────────────────────
  const { id } = useParams();          // Lấy id từ URL
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────────────────────
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useContext(CartContext);
  // ─── Fetch sản phẩm theo id ───────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch sản phẩm
        const productRes = await fetch(`${API_BASE}/products/${id}`);
        if (!productRes.ok) {
          throw new Error('Không tìm thấy sản phẩm này.');
        }
        const productData = await productRes.json();
        setProduct(productData);

        // Fetch category của sản phẩm
        const catRes = await fetch(`${API_BASE}/categories/${productData.categoryId}`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategory(catData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Re-run khi id thay đổi

  // ─── Giả lập thêm vào giỏ hàng ───────────────────────────────────────────
  const handleAddToCart = () => {
  addToCart(product, 1); // Đẩy vào context
  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 2000);
};

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="loading-wrapper" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="loading-text">Đang tải sản phẩm...</span>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Container style={{ paddingTop: '60px' }}>
        <div className="alert-dark alert-error">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button className="back-btn mt-3" onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left"></i> Về trang chủ
        </button>
      </Container>
    );
  }

  return (
    <div className="detail-page">
      <Container>
        {/* ── Nút quay lại ── */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Quay lại
        </button>

        <Row className="g-4">
          {/* ── Ảnh sản phẩm ── */}
          <Col lg={6}>
            <div className="detail-img-wrapper">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x420?text=No+Image';
                }}
              />
            </div>
          </Col>

          {/* ── Thông tin chi tiết ── */}
          <Col lg={6}>
            <div className="detail-info">
              {/* Category tag */}
              {category && (
                <span className="detail-category-tag">
                  <i className="bi bi-tag"></i> {category.name}
                </span>
              )}

              {/* Tên sản phẩm */}
              <h1 className="detail-title">{product.name}</h1>

              {/* Giá */}
              <div className="detail-price">{formatPrice(product.price)}</div>

              {/* Thêm vào giỏ */}
              {addedToCart ? (
                <div className="alert-dark alert-success" style={{ marginTop: '1rem' }}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Đã thêm vào giỏ hàng!
                </div>
              ) : (
                <button className="btn-add-cart" onClick={handleAddToCart}>
                  <i className="bi bi-cart-plus"></i>
                  Thêm vào giỏ hàng
                </button>
              )}

              {/* Mô tả */}
              <div className="detail-desc">
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                }}>
                  Mô tả sản phẩm
                </div>
                <p style={{ margin: 0 }}>{product.description}</p>
              </div>

              {/* Thông tin thêm */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>ID sản phẩm</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--primary)' }}>
                    #{String(product.id).padStart(4, '0')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Danh mục</div>
                  <div style={{ fontSize: '0.85rem' }}>{category?.name || '—'}</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProductDetail;