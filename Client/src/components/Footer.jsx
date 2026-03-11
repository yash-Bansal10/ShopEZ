import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ShopEZ</h3>
          <p>Your one-stop destination for effortless online shopping. Experience the future of online shopping with ShopEZ today.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/">Contact Us</Link></li>
            <li><Link to="/">Returns & Exchanges</Link></li>
            <li><Link to="/">Shipping Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Stay Connected</h4>
          <p>Subscribe to our newsletter for updates and exclusive offers.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
