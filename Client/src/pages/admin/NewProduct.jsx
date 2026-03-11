import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const NewProduct = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mainImg: '',
    carousel1: '',
    carousel2: '',
    carousel3: '',
    sizes: [],
    category: '',
    gender: '',
    price: '',
    discount: ''
  });

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      mainImg: formData.mainImg,
      carousel: [formData.carousel1, formData.carousel2, formData.carousel3].filter(Boolean),
      sizes: formData.sizes,
      category: formData.category,
      gender: formData.gender,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount) || 0
    };
    try {
      await axios.post('https://shopez-83qn.onrender.com/api/products', payload);
      alert('Product added successfully!');
      navigate('/admin/products');
    } catch (err) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="admin-page">
      <div className="new-product-form glass-effect">
        <h2>New Product</h2>
        <form onSubmit={handleSubmit} className="new-product-grid">
          <input name="title" placeholder="Product name" value={formData.title} onChange={handleChange} required />
          <input name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />
          <input name="mainImg" placeholder="Thumbnail Img url" value={formData.mainImg} onChange={handleChange} required className="full-width" />
          <input name="carousel1" placeholder="Add on img1 url" value={formData.carousel1} onChange={handleChange} />
          <input name="carousel2" placeholder="Add on img2 url" value={formData.carousel2} onChange={handleChange} />
          <input name="carousel3" placeholder="Add on img3 url" value={formData.carousel3} onChange={handleChange} />

          <div className="full-width">
            <h4>Available Size</h4>
            <div className="size-options">
              {allSizes.map(s => (
                <label key={s} className="size-check-label">
                  <input type="checkbox" checked={formData.sizes.includes(s)} onChange={() => handleSizeToggle(s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="full-width">
            <h4>Gender</h4>
            <div className="gender-options">
              {['Men', 'Women', 'Unisex'].map(g => (
                <label key={g} className="size-check-label">
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <input name="category" placeholder="Category (e.g. Electronics, Fashion)" value={formData.category} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input name="discount" type="number" placeholder="Discount (%)" value={formData.discount} onChange={handleChange} />

          <button type="submit" className="admin-submit-btn full-width">Add product</button>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
