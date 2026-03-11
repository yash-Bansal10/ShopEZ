import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', mainImg: '', category: '', gender: '', price: '', discount: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}`)
      .then(res => {
        const p = res.data;
        setFormData({ title: p.title, description: p.description, mainImg: p.mainImg, category: p.category, gender: p.gender, price: p.price, discount: p.discount || 0 });
      });
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/products/${id}`, { ...formData, price: parseFloat(formData.price), discount: parseFloat(formData.discount) });
      alert('Product updated!');
      navigate('/admin/products');
    } catch (err) { alert('Update failed'); }
  };

  return (
    <div className="admin-page">
      <div className="new-product-form glass-effect">
        <h2>Update Product</h2>
        <form onSubmit={handleSubmit} className="new-product-grid">
          <input name="title" placeholder="Product name" value={formData.title} onChange={handleChange} required />
          <input name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />
          <input name="mainImg" placeholder="Thumbnail Img url" value={formData.mainImg} onChange={handleChange} required className="full-width" />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input name="gender" placeholder="Gender (Men/Women/Unisex)" value={formData.gender} onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input name="discount" type="number" placeholder="Discount (%)" value={formData.discount} onChange={handleChange} />
          <button type="submit" className="admin-submit-btn full-width">Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
