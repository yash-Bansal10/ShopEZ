import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card glass-effect">
      <Link to={`/products/${product._id}`} className="product-img-container">
        <img 
          src={product.mainImg || 'https://via.placeholder.com/300x400?text=ShopEZ'} 
          alt={product.title} 
          className="product-img"
        />
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </Link>
      
      <div className="product-details">
        <div className="product-header">
          <span className="product-category">{product.category}</span>
          <h3 className="product-title">{product.title}</h3>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="current-price">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                <span className="original-price">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="current-price">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <button className="add-to-cart-btn btn-primary" title="Add to Cart">
             <FiShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
