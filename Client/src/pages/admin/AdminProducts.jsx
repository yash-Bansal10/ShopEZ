import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Popular');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.usertype !== 'Admin') { navigate('/'); return; }
    axios.get('https://shopez-83qn.onrender.com/api/products')
      .then(res => { setProducts(res.data); setFilteredProducts(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = [...products];
    if (selectedCategories.length > 0) result = result.filter(p => selectedCategories.includes(p.category));
    if (selectedGenders.length > 0) result = result.filter(p => selectedGenders.includes(p.gender));
    if (sortBy === 'Price (low to high)') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price (high to low)') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Discount') result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    setFilteredProducts(result);
  }, [products, selectedCategories, selectedGenders, sortBy]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`https://shopez-83qn.onrender.com/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleCategoryChange = (cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const handleGenderChange = (gen) => setSelectedGenders(prev => prev.includes(gen) ? prev.filter(g => g !== gen) : [...prev, gen]);

  if (loading) return <div className="loader">Loading Products...</div>;

  return (
    <div className="admin-products-layout">
      <aside className="admin-filters-sidebar">
        <h3>Filters</h3>
        <div className="admin-filter-group">
          <h4>Sort By</h4>
          {['Popular', 'Price (low to high)', 'Price (high to low)', 'Discount'].map(opt => (
            <label key={opt} className="admin-filter-label">
              <input type="radio" name="sortBy" checked={sortBy === opt} onChange={() => setSortBy(opt)} />
              {opt}
            </label>
          ))}
        </div>
        <div className="admin-filter-group">
          <h4>Categories</h4>
          {['Mobiles', 'Electronics', 'Sports Equipments', 'Fashion', 'Groceries', 'Outerwear', 'Dresses', 'Footwear'].map(cat => (
            <label key={cat} className="admin-filter-label">
              <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} />
              {cat}
            </label>
          ))}
        </div>
        <div className="admin-filter-group">
          <h4>Gender</h4>
          {['Men', 'Women', 'Unisex'].map(gen => (
            <label key={gen} className="admin-filter-label">
              <input type="checkbox" checked={selectedGenders.includes(gen)} onChange={() => handleGenderChange(gen)} />
              {gen}
            </label>
          ))}
        </div>
      </aside>

      <main className="admin-products-main">
        <h2 className="admin-section-title">All Products</h2>
        <div className="admin-products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="admin-product-card">
              <img src={product.mainImg} alt={product.title} className="admin-product-img" />
              <h4 className="admin-product-name">{product.title}</h4>
              <p className="admin-product-desc">{product.description?.slice(0, 60)}...</p>
              <div style={{display:'flex', gap:'0.5rem', justifyContent:'center'}}>
                {product.discount > 0 ? (
                  <><span className="admin-price">₹{(product.price * (1 - product.discount/100)).toFixed(0)}</span>
                  <span className="admin-original-price">{product.price}</span>
                  <span className="admin-discount">({product.discount}% off)</span></>
                ) : (
                  <span className="admin-price">₹{product.price}</span>
                )}
              </div>
              <div className="admin-product-actions">
                <button className="admin-update-btn" onClick={() => navigate(`/admin/products/${product._id}`)}>Update</button>
                <button className="admin-cancel-btn" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
