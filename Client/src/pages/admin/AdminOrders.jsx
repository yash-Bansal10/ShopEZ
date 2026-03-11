import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusInputs, setStatusInputs] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.usertype !== 'Admin') { navigate('/'); return; }
    axios.get('https://shopez-83qn.onrender.com/api/orders')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleStatusChange = (orderId, value) => {
    setStatusInputs(prev => ({ ...prev, [orderId]: value }));
  };

  const handleUpdate = async (orderId) => {
    const orderStatus = statusInputs[orderId];
    if (!orderStatus) return;
    try {
      await axios.put(`https://shopez-83qn.onrender.com/api/orders/${orderId}/status`, { orderStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus } : o));
    } catch (err) { console.error(err); }
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.delete(`https://shopez-83qn.onrender.com/api/orders/cancel/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loader">Loading Orders...</div>;

  return (
    <div className="admin-page">
      <h2 className="admin-section-title">Orders</h2>
      <div className="admin-orders-list">
        {orders.map(order => (
          <div key={order._id} className="admin-order-card">
            <img src={order.mainImg} alt={order.title} className="admin-order-img" />
            <div className="admin-order-details">
              <h3 className="admin-product-title">{order.title}</h3>
              <p className="admin-desc">{order.description?.slice(0, 100)}...</p>
              <p>
                <strong>Size:</strong> {order.size}&nbsp;&nbsp;
                <strong>Quantity:</strong> {order.quantity}&nbsp;&nbsp;
                <strong>Price:</strong> ₹{((order.discount > 0 ? order.price * (1 - order.discount/100) : order.price) * order.quantity).toFixed(0)}&nbsp;&nbsp;
                <strong>Payment method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>UserId:</strong> {order.userId}&nbsp;&nbsp;
                <strong>Name:</strong> {order.name}&nbsp;&nbsp;
                <strong>Email:</strong> {order.email}&nbsp;&nbsp;
                <strong>Mobile:</strong> {order.mobile}
              </p>
              <p className="admin-order-meta">
                <strong>Ordered on:</strong> {new Date(order.orderDate).toLocaleDateString()}&nbsp;&nbsp;
                <strong>Address:</strong> {order.address}&nbsp;&nbsp;
                <strong>Pincode:</strong> {order.pincode}
              </p>
              <div className="admin-order-actions">
                <span><strong>Order status:</strong> {order.orderStatus}</span>
                <select
                  value={statusInputs[order._id] || ''}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                  className="status-select"
                >
                  <option value="">Update order status</option>
                  <option value="order placed">Order Placed</option>
                  <option value="In-transit">In-transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="admin-update-btn" onClick={() => handleUpdate(order._id)}>Update</button>
                <button className="admin-cancel-btn" onClick={() => handleCancel(order._id)}>Cancel</button>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p>No orders found.</p>}
      </div>
    </div>
  );
};

export default AdminOrders;
