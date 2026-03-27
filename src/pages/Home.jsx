
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { API_BASE } from '../utils/constants';

function Home() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter & Sort
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('none'); // 'none' | 'asc' | 'desc'

  // ─── Fetch dữ liệu từ json-server ────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
        ]);

        if (!prodRes.ok || !catRes.ok) {
          throw new Error('Không thể kết nối đến server. Hãy chắc chắn json-server đang chạy.');
        }

        const [prodData, catData] = await Promise.all([
          prodRes.json(),
          catRes.json(),
        ]);

        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ─── Lọc và sắp xếp sản phẩm ─────────────────────────────────────────────
  const filteredProducts = products
    .filter((p) =>
      selectedCategory === 'all' ? true : p.categoryId === parseInt(selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  // Helper: lấy tên category theo id
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  };

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h1 className="hero-title">
                Công nghệ đỉnh cao,<br />
                <span>giá tốt nhất</span> thị trường
              </h1>
              <p className="hero-subtitle mt-3">
                Khám phá hàng nghìn sản phẩm công nghệ chính hãng — Laptop, Điện thoại,
                Phụ kiện và nhiều hơn nữa.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{products.length}+</span>
                  <span className="stat-label">Sản phẩm</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{categories.length}</span>
                  <span className="stat-label">Danh mục</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Chính hãng</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Danh sách sản phẩm ── */}
      <section className="section-padding">
        <Container>

          {/* ── Filter Bar ── */}
          <div className="filter-bar">
            {/* Filter theo Category */}
            <span className="filter-label">
              <i className="bi bi-funnel me-1"></i> Lọc
            </span>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Separator */}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }}></div>

            {/* Sort theo giá */}
            <span className="filter-label">
              <i className="bi bi-sort-numeric-down me-1"></i> Sắp xếp
            </span>
            <button
              className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
            >
              <i className="bi bi-sort-numeric-up"></i> Giá tăng dần
            </button>
            <button
              className={`sort-btn ${sortOrder === 'desc' ? 'active' : ''}`}
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
            >
              <i className="bi bi-sort-numeric-down-alt"></i> Giá giảm dần
            </button>

            {/* Số kết quả */}
            <span className="result-count">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="loading-wrapper">
              <Spinner animation="border" variant="primary" />
              <span className="loading-text">Đang tải sản phẩm...</span>
            </div>
          )}

          {/* ── Error ── */}
          {error && !loading && (
            <div className="alert-dark alert-error" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* ── Danh sách sản phẩm ── */}
          {!loading && !error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-inbox"></i>
                  <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
                </div>
              ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                  {filteredProducts.map((product) => (
                    <Col key={product.id}>
                      <ProductCard
                        product={product}
                        categoryName={getCategoryName(product.categoryId)}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

export default Home;