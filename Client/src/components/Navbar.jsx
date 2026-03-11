import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiSearch } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-effect">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="title-gradient">ShopEZ</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
        </div>

        <form className="search-bar" onSubmit={(e) => {
          e.preventDefault();
          if (searchTerm.trim()) {
            navigate(`/products?search=${searchTerm}`);
          }
        }}>
          <input 
             type="text" 
             placeholder="Search Electronics, Fashion, mobiles, etc.," 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn"><FiSearch size={20}/></button>
        </form>

        <div className="navbar-actions">
          {token ? (
            <>
              <Link to={`/cart/${user?._id}`} className="icon-btn cart-btn">
                <FiShoppingCart size={22} />
              </Link>
              <Link to={`/profile/${user?._id}`} className="nav-link user-greet">
                <FiUser size={18} className="user-icon"/> 
                <span>{user?.username}</span>
              </Link>
              <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
                <FiLogOut size={22} />
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
