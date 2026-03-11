import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [users, setUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser || currentUser.usertype?.toLowerCase() !== 'admin') {
      navigate('/');
      return;
    }

    // Fetch all data in parallel
    Promise.all([
      axios.get('http://localhost:8000/api/users'),
      axios.get('http://localhost:8000/api/products'),
      axios.get('http://localhost:8000/api/orders')
    ]).then(([usersRes, productsRes, ordersRes]) => {
      setStats({
        users: usersRes.data.length,
        products: productsRes.data.length,
        orders: ordersRes.data.length
      });
      setUsers(usersRes.data);
      setAllOrders(ordersRes.data);
    }).catch(console.error);
  }, []);

  // Count orders for each user
  const getOrderCount = (userId) => allOrders.filter(o => o.userId === userId?.toString()).length;

  return (
    <div className="admin-page">
      {/* Stat Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total users</h3>
          <p className="stat-num">{stats.users}</p>
          <Link to="/admin/users" className="admin-view-btn">View all</Link>
        </div>
        <div className="stat-card">
          <h3>All Products</h3>
          <p className="stat-num">{stats.products}</p>
          <Link to="/admin/products" className="admin-view-btn">View all</Link>
        </div>
        <div className="stat-card">
          <h3>All Orders</h3>
          <p className="stat-num">{stats.orders}</p>
          <Link to="/admin/orders" className="admin-view-btn">View all</Link>
        </div>
        <div className="stat-card">
          <h3>Add Product</h3>
          <p className="stat-num">(new)</p>
          <Link to="/admin/new-product" className="admin-view-btn">Add now</Link>
        </div>
      </div>

      {/* Users with Order History */}
      <div className="admin-users-table-section">
        <h2 className="admin-section-title" style={{ marginBottom: '1rem' }}>User Order History</h2>
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u._id}>
                <td>{idx + 1}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`user-type-badge ${u.usertype?.toLowerCase()}`}>
                    {u.usertype}
                  </span>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>
                  {getOrderCount(u._id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
