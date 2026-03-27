import React, { useState, useEffect, useCallback } from 'react';
import { Container, Spinner, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE, formatPrice } from '../utils/constants';

// ─── Giá trị mặc định form ─────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '',
  price: '',
  categoryId: '',
  image: '',
  description: '',
};

function AdminDashboard() {
  const navigate = useNavigate();

  // ─── State: dữ liệu ────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ─── State: Modal Thêm/Sửa ─────────────────────────────────────────────────
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ─── State: Modal Xác nhận Xóa ────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Kiểm tra quyền admin ─────────────────────────────────────────────────
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  // ─── Fetch danh sách sản phẩm + categories ────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/categories`),
      ]);

      if (!prodRes.ok || !catRes.ok) throw new Error('Lỗi khi tải dữ liệu từ server.');

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Helper: hiển thị thông báo thành công ────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ─── Helper: lấy tên category ─────────────────────────────────────────────
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === parseInt(categoryId));
    return cat ? cat.name : '—';
  };

  // ══════════════════════════════════════════════════════════════════════════
  // CREATE / UPDATE
  // ══════════════════════════════════════════════════════════════════════════

  // Mở Modal Thêm mới
  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setShowFormModal(true);
  };

  // Mở Modal Sửa
  const handleOpenEdit = (product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: String(product.price),
      categoryId: String(product.categoryId),
      image: product.image,
      description: product.description,
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi user bắt đầu nhập
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Tên sản phẩm không được để trống.';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      errors.price = 'Giá phải là số dương hợp lệ.';
    if (!formData.categoryId) errors.categoryId = 'Vui lòng chọn danh mục.';
    if (!formData.image.trim()) errors.image = 'URL ảnh không được để trống.';
    if (!formData.description.trim()) errors.description = 'Mô tả không được để trống.';
    return errors;
  };

  // Submit form (CREATE hoặc UPDATE)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      categoryId: parseInt(formData.categoryId),
      image: formData.image.trim(),
      description: formData.description.trim(),
    };

    try {
      let res;
      if (isEditing) {
        // ── PUT: Cập nhật sản phẩm ──
        res = await fetch(`${API_BASE}/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingId }),
        });
      } else {
        // ── POST: Thêm mới sản phẩm ──
        res = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error('Thao tác thất bại. Vui lòng thử lại.');

      setShowFormModal(false);
      await fetchData(); // Làm mới danh sách
      showSuccess(isEditing ? '✅ Cập nhật sản phẩm thành công!' : '✅ Thêm sản phẩm thành công!');
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // DELETE
  // ══════════════════════════════════════════════════════════════════════════

  // Mở Modal xác nhận Xóa
  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // Xác nhận Xóa
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleting(true);

    try {
      const res = await fetch(`${API_BASE}/products/${deletingProduct.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Xóa thất bại. Vui lòng thử lại.');

      setShowDeleteModal(false);
      setDeletingProduct(null);
      await fetchData(); // Làm mới danh sách
      showSuccess('🗑️ Xóa sản phẩm thành công!');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="admin-page">
      <Container>

        {/* ── Header ── */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">
              Quản lý Sản phẩm
              <span>Tổng cộng {products.length} sản phẩm</span>
            </h1>
          </div>
          <button className="btn-add-product" onClick={handleOpenCreate}>
            <i className="bi bi-plus-lg"></i> Thêm sản phẩm
          </button>
        </div>

        {/* ── Thông báo thành công ── */}
        {successMsg && (
          <div className="alert-dark alert-success mb-4" role="alert">
            {successMsg}
          </div>
        )}

        {/* ── Thông báo lỗi ── */}
        {error && (
          <div className="alert-dark alert-error mb-4" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* ── Loading ── */}
        {loading ? (
          <div className="loading-wrapper">
            <Spinner animation="border" variant="primary" />
            <span className="loading-text">Đang tải dữ liệu...</span>
          </div>
        ) : (
          /* ── Bảng sản phẩm ── */
          <div className="admin-table-wrapper">
            <Table responsive className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th style={{ width: 60 }}>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th style={{ width: 150 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      Chưa có sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.id}>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                        {index + 1}
                      </td>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="table-product-img"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/44?text=?'; }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ID: #{product.id}
                        </div>
                      </td>
                      <td>  
                        <span className="table-category-badge">
                          {getCategoryName(product.categoryId)}
                        </span>
                      </td>
                      <td>
                        <span className="table-price">{formatPrice(product.price)}</span>
                      </td>
                      <td>
                        <button className="btn-edit" onClick={() => handleOpenEdit(product)}>
                          <i className="bi bi-pencil me-1"></i> Sửa
                        </button>
                        <button className="btn-delete" onClick={() => handleOpenDelete(product)}>
                          <i className="bi bi-trash me-1"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Container>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: THÊM / SỬA SẢN PHẨM
      ════════════════════════════════════════════════════════════════════ */}
      <Modal
        show={showFormModal}
        onHide={() => !submitting && setShowFormModal(false)}
        centered
        size="lg"
        className="modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? (
              <><i className="bi bi-pencil-square me-2 text-warning"></i>Cập nhật sản phẩm</>
            ) : (
              <><i className="bi bi-plus-circle me-2 text-primary"></i>Thêm sản phẩm mới</>
            )}
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleFormSubmit} noValidate>
          <Modal.Body style={{ padding: '1.5rem' }}>
            {/* Submit error */}
            {formErrors.submit && (
              <div className="alert-dark alert-error mb-3">{formErrors.submit}</div>
            )}

            <div className="row g-3">
              {/* Tên sản phẩm */}
              <div className="col-12">
                <label className="form-label">Tên sản phẩm *</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="VD: MacBook Pro 14 M3"
                  value={formData.name}
                  onChange={handleFormChange}
                />
                {formErrors.name && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>
                    {formErrors.name}
                  </div>
                )}
              </div>

              {/* Giá */}
              <div className="col-md-6">
                <label className="form-label">Giá (VNĐ) *</label>
                <input
                  name="price"
                  type="number"
                  className="form-control"
                  placeholder="VD: 49990000"
                  value={formData.price}
                  onChange={handleFormChange}
                  min="0"
                />
                {formErrors.price && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>
                    {formErrors.price}
                  </div>
                )}
              </div>

              {/* Danh mục */}
              <div className="col-md-6">
                <label className="form-label">Danh mục *</label>
                <select
                  name="categoryId"
                  className="form-select"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>
                    {formErrors.categoryId}
                  </div>
                )}
              </div>

              {/* URL Ảnh */}
              <div className="col-12">
                <label className="form-label">URL Ảnh *</label>
                <input
                  name="image"
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleFormChange}
                />
                {formErrors.image && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>
                    {formErrors.image}
                  </div>
                )}
                {/* Preview ảnh */}
                {formData.image && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={formData.image}
                      alt="preview"
                      style={{
                        width: '80px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Mô tả */}
              <div className="col-12">
                <label className="form-label">Mô tả sản phẩm *</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                />
                {formErrors.description && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>
                    {formErrors.description}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="btn-modal-secondary"
              onClick={() => setShowFormModal(false)}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-modal-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang lưu...
                </>
              ) : isEditing ? (
                <><i className="bi bi-check-lg me-1"></i> Cập nhật</>
              ) : (
                <><i className="bi bi-plus-lg me-1"></i> Thêm mới</>
              )}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: XÁC NHẬN XÓA
      ════════════════════════════════════════════════════════════════════ */}
      <Modal
        show={showDeleteModal}
        onHide={() => !deleting && setShowDeleteModal(false)}
        centered
        size="sm"
        className="modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
            Xác nhận xóa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Bạn có chắc chắn muốn xóa sản phẩm{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              "{deletingProduct?.name}"
            </strong>
            ? Hành động này không thể hoàn tác.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-modal-secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Hủy
          </button>
          <button
            className="btn-modal-danger"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang xóa...
              </>
            ) : (
              <><i className="bi bi-trash me-1"></i> Xóa</>
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDashboard;