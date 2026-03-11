import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <Link to="/admin" className="admin-brand">ShopEZ (admin)</Link>
      <div className="admin-nav-links">
        <Link to="/admin" className="admin-nav-link">Home</Link>
        <Link to="/admin/users" className="admin-nav-link">Users</Link>
        <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
        <Link to="/admin/products" className="admin-nav-link">Products</Link>
        <Link to="/admin/new-product" className="admin-nav-link">New Product</Link>
        <button onClick={handleLogout} className="admin-nav-link admin-logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
