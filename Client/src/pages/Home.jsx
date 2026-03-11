import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Fashion', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop' },
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop' },
    { name: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop' },
    { name: 'Groceries', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' },
    { name: 'Sports Equipments', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop' }
  ];

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div className="home-page">
      {/* Banner Section */}
      <div className="banner-section">
         <div className="banner-content">
            <h1 style={{fontSize: '4rem', marginBottom: '1rem'}}>SUPER SALE</h1>
            <h2 style={{fontSize: '2rem', marginBottom: '1.5rem'}}>UP TO 50% OFF</h2>
            <Link to="/products" className="btn btn-primary" style={{fontSize: '1.2rem', padding: '0.8rem 2rem', backgroundColor: 'var(--color-text-main)'}}>
               SHOP NOW
            </Link>
         </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
         {categories.map((cat, index) => (
            <div key={index} className="category-card" onClick={() => handleCategoryClick(cat.name)}>
               <img src={cat.img} alt={cat.name} className="category-img" />
               <div className="category-title">{cat.name}</div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Home;
