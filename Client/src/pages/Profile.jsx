import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/${user._id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8000/api/orders/cancel/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
    } catch (error) {
       console.error("Error canceling order:", error);
    }
  };

  if (loading) return <div className="loader">Loading Profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header glass-effect">
         <div className="profile-info" style={{ 
            display: 'flex', flexDirection: 'column', gap: '1rem', 
            padding: '2rem', flex: '0 0 250px' 
         }}>
            <h3 style={{margin: 0}}>Username: <span style={{fontWeight: 'normal', color: 'var(--color-text-main)'}}>{user?.username}</span></h3>
            <h3 style={{margin: 0}}>Email: <span style={{fontWeight: 'normal', color: 'var(--color-text-light)'}}>{user?.email}</span></h3>
            <h3 style={{margin: 0}}>Orders: <span style={{fontWeight: 'normal', color: 'var(--color-text-main)'}}>{orders.length}</span></h3>
            <button 
               onClick={handleLogout} 
               className="btn btn-primary" 
               style={{alignSelf: 'flex-start', backgroundColor: '#e63946', borderColor: '#e63946'}}
            >
               Logout
            </button>
         </div>
      </div>

      <div className="orders-section">
         <h2 style={{color: 'var(--color-primary-dark)', marginBottom: '1.5rem'}}>Your Order History</h2>
         
         {orders.length === 0 ? (
            <div className="empty-state">
               <h3>No Orders found.</h3>
               <p>When you purchase items, they will appear here.</p>
            </div>
         ) : (
            <div className="orders-list">
               {orders.map((order) => (
                  <div key={order._id} className="order-card glass-effect">
                     <div className="order-header" style={{display: 'none'}}>
                        {/* Hidden per new layout */}
                     </div>
                     <div className="order-body" style={{flexDirection: 'row', alignItems: 'center'}}>
                        <img src={order.mainImg} alt={order.title} className="order-img" style={{width: '120px', height: '120px'}} />
                        <div className="order-details" style={{flex: 1, paddingLeft: '1rem'}}>
                           <h4 style={{fontSize: '1.2rem'}}>{order.title}</h4>
                           <p className="subtitle" style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>{order.description?.slice(0, 100)}...</p>
                           <p>
                             <strong>Size:</strong> {order.size || 'N/A'}&nbsp;&nbsp; 
                             <strong>Quantity:</strong> {order.quantity}&nbsp;&nbsp;
                             <strong>Price:</strong> ₹{((order.discount > 0 ? order.price * (1 - order.discount / 100) : order.price) * order.quantity).toFixed(0)}&nbsp;&nbsp;
                             <strong>Payment method:</strong> {order.paymentMethod}
                           </p>
                           <p style={{marginTop: '0.5rem'}}>
                             <strong>Address:</strong> {order.address}&nbsp;&nbsp;
                             <strong>Pincode:</strong> {order.pincode}&nbsp;&nbsp;
                             <strong>Ordered on:</strong> {new Date(order.orderDate).toLocaleDateString()}
                           </p>
                           <p style={{marginTop: '0.5rem'}}>
                             <strong>Order status:</strong> <span style={{color: '#777'}}>{order.orderStatus}</span>
                           </p>
                           <button 
                             className="btn btn-primary" 
                             style={{marginTop: '1rem', backgroundColor: '#e63946', borderColor: '#e63946', padding: '0.4rem 1.2rem'}}
                             onClick={() => handleCancel(order._id)}
                           >
                             Cancel
                           </button>
                        </div>
                     </div>
                     <div className="order-footer" style={{display: 'none'}}>
                        {/* Hidden per layout */}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default Profile;
