import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminProducts, createProduct, updateProduct, deleteProduct, createOffer, deleteOffer, getOffers } from '../api/services';
import { Spinner } from '../components/common/Spinner';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './AdminProductsPage.css';

const CATEGORIES = ['Watches', 'Smartphones', 'Laptops', 'Headphones', 'Fashion', 'Home Appliances'];
const EMPTY_PRODUCT = { name: '', brand: '', model: '', description: '', category: '', images: '', specifications: '' };
const EMPTY_OFFER = { merchantName: '', price: '', destinationUrl: '', availability: 'In Stock' };

export default function AdminProductsPage() {
  const qc = useQueryClient();

  // State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [offerForms, setOfferForms] = useState({});
  const [page, setPage] = useState(1);

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => getAdminProducts({ page, limit: 10 }).then((r) => r.data),
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  // Mutations
  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { qc.invalidateQueries(['admin-products']); closeProductModal(); toast.success('Product created ✓'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-products']); closeProductModal(); toast.success('Product updated ✓'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast.success('Product deactivated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete'),
  });

  const createOfferMut = useMutation({
    mutationFn: ({ productId, data }) => createOffer(productId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries(['admin-products']);
      setOfferForms((f) => ({ ...f, [vars.productId]: EMPTY_OFFER }));
      toast.success('Offer added ✓');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to add offer'),
  });

  const deleteOfferMut = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast.success('Offer removed'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to remove'),
  });

  // Handlers
  const openCreate = () => { setEditingProduct(null); setProductForm(EMPTY_PRODUCT); setShowProductModal(true); };
  const openEdit = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, brand: p.brand, model: p.model || '', description: p.description,
      category: p.category, images: (p.images || []).join('\n'),
      specifications: Object.entries(p.specifications || {}).map(([k, v]) => `${k}: ${v}`).join('\n'),
    });
    setShowProductModal(true);
  };
  const closeProductModal = () => { setShowProductModal(false); setEditingProduct(null); setProductForm(EMPTY_PRODUCT); };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: productForm.name.trim(),
      brand: productForm.brand.trim(),
      model: productForm.model.trim(),
      description: productForm.description.trim(),
      category: productForm.category,
      images: productForm.images.split('\n').map((s) => s.trim()).filter(Boolean),
      specifications: Object.fromEntries(
        productForm.specifications.split('\n')
          .map((line) => line.split(':').map((s) => s.trim()))
          .filter((parts) => parts.length === 2 && parts[0])
      ),
    };
    if (editingProduct) updateMut.mutate({ id: editingProduct._id, data: payload });
    else createMut.mutate(payload);
  };

  const handleOfferSubmit = (e, productId) => {
    e.preventDefault();
    const f = offerForms[productId] || EMPTY_OFFER;
    createOfferMut.mutate({ productId, data: { ...f, price: Number(f.price) } });
  };

  const confirmDelete = (id, name) => {
    if (window.confirm(`Deactivate "${name}"? It will be hidden from users.`))
      deleteMut.mutate(id);
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="admin-products-header">
          <div>
            <h1 className="section-title">Manage Products</h1>
            <p className="section-sub">{pagination?.total || 0} total products</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Product</button>
        </div>

        {isLoading ? <Spinner /> : (
          <>
            <div className="admin-product-list">
              {products.map((p) => (
                <div key={p._id} className={`admin-product-row ${!p.isActive ? 'inactive' : ''}`}>
                  <div className="apr-main">
                    <div className="apr-img">
                      <img
                        src={p.images?.[0] || 'https://placehold.co/60x60/f3f4f6/aaa?text=?'}
                        alt=""
                        onError={(e) => { e.target.src = 'https://placehold.co/60x60/f3f4f6/aaa?text=?'; }}
                      />
                    </div>
                    <div className="apr-info">
                      <div className="apr-info-top">
                        <div>
                          <h4 className="apr-name">{p.name}</h4>
                          <p className="apr-meta">{p.brand} · {p.category}</p>
                        </div>
                        <div className="apr-meta-right">
                          <span className="badge badge-blue">₹{p.lowestPrice?.toLocaleString('en-IN') || 'N/A'}</span>
                          {!p.isActive && <span className="badge badge-red">Inactive</span>}
                        </div>
                      </div>
                      <div className="apr-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><FiEdit2 size={14}/> Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(p._id, p.name)}><FiTrash2 size={14}/> Deactivate</button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setExpandedProduct(expandedProduct === p._id ? null : p._id)}
                        >
                          {expandedProduct === p._id ? <FiChevronUp size={14}/> : <FiChevronDown size={14}/>}
                          {expandedProduct === p._id ? 'Hide' : 'Manage'} Offers
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Offer manager */}
                  {expandedProduct === p._id && (
                    <OfferSection
                      product={p}
                      offerForm={offerForms[p._id] || EMPTY_OFFER}
                      onOfferFormChange={(val) => setOfferForms((f) => ({ ...f, [p._id]: val }))}
                      onAddOffer={(e) => handleOfferSubmit(e, p._id)}
                      onDeleteOffer={(id) => deleteOfferMut.mutate(id)}
                      isAddingOffer={createOfferMut.isLoading}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹ Prev</button>
                <span className="page-btn active">{page}</span>
                <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)}>Next ›</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeProductModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={closeProductModal}><FiX /></button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="modal-body">
                <div className="modal-grid">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="form-input" required value={productForm.name} onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand *</label>
                    <input className="form-input" required value={productForm.brand} onChange={(e) => setProductForm((f) => ({ ...f, brand: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model</label>
                    <input className="form-input" value={productForm.model} onChange={(e) => setProductForm((f) => ({ ...f, model: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select" required value={productForm.category} onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}>
                      <option value="">Select category…</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" required value={productForm.description} onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URLs <small>(one per line)</small></label>
                  <textarea className="form-textarea" style={{ minHeight: 70 }} value={productForm.images} onChange={(e) => setProductForm((f) => ({ ...f, images: e.target.value }))} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
                </div>
                <div className="form-group">
                  <label className="form-label">Specifications <small>(Key: Value, one per line)</small></label>
                  <textarea className="form-textarea" style={{ minHeight: 90 }} value={productForm.specifications} onChange={(e) => setProductForm((f) => ({ ...f, specifications: e.target.value }))} placeholder="Display: 6.1-inch OLED&#10;RAM: 8GB&#10;Storage: 256GB" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeProductModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMut.isLoading || updateMut.isLoading}>
                  {(createMut.isLoading || updateMut.isLoading) ? 'Saving…' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── OfferSection: fetches and manages offers for a single product ──────────
function OfferSection({ product, offerForm, onOfferFormChange, onAddOffer, onDeleteOffer, isAddingOffer }) {
  const { data: offers = [], refetch } = useQuery({
    queryKey: ['offers', product._id],
    queryFn: () => getOffers(product._id).then((r) => r.data.data),
  });

  const set = (key, val) => onOfferFormChange({ ...offerForm, [key]: val });

  return (
    <div className="offer-manager">
      <h5>Merchant Offers for <em>{product.name}</em></h5>

      {offers.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No offers yet.</p>}

      {offers.map((o) => (
        <div key={o._id} className="offer-manager-row">
          <span className="offer-merchant-tag">{o.merchantName}</span>
          <span>₹{o.price?.toLocaleString('en-IN')}</span>
          <span className={`badge ${o.availability === 'In Stock' ? 'badge-green' : o.availability === 'Out of Stock' ? 'badge-red' : 'badge-yellow'}`}>{o.availability}</span>
          <button className="btn btn-danger btn-sm" onClick={() => { onDeleteOffer(o._id); setTimeout(refetch, 500); }}>
            <FiTrash2 size={12} />
          </button>
        </div>
      ))}

      <form className="add-offer-form" onSubmit={(e) => { onAddOffer(e); setTimeout(refetch, 800); }}>
        <h6>+ Add New Offer</h6>
        <div className="add-offer-grid">
          <input className="form-input" placeholder="Merchant name" required value={offerForm.merchantName} onChange={(e) => set('merchantName', e.target.value)} />
          <input className="form-input" placeholder="Price (₹)" type="number" min="0" required value={offerForm.price} onChange={(e) => set('price', e.target.value)} />
          <input className="form-input" placeholder="https://amazon.in/..." required value={offerForm.destinationUrl} onChange={(e) => set('destinationUrl', e.target.value)} />
          <select className="form-select" value={offerForm.availability} onChange={(e) => set('availability', e.target.value)}>
            <option>In Stock</option>
            <option>Out of Stock</option>
            <option>Limited</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-sm" disabled={isAddingOffer}>
          {isAddingOffer ? 'Adding…' : '+ Add Offer'}
        </button>
      </form>
    </div>
  );
}
