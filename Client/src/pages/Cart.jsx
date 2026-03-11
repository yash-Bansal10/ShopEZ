import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/cart/${user._id}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${id}`);
      setCartItems(cartItems.filter(item => item._id !== id));
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      return total + (itemPrice * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) return <div className="loader">Loading Cart...</div>;

  return (
    <div className="cart-page">
      <h1 className="title-gradient text-center" style={{marginBottom: '2rem'}}>Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is currently empty.</h2>
          <p style={{marginBottom: '2rem', color: 'var(--color-text-light)'}}>
             Discover our premium products and add some items to your cart!
          </p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item glass-effect">
                <img src={item.mainImg} alt={item.title} className="cart-item-img" />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>Size: {item.size || 'N/A'}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="cart-item-price">
                   <span>${((item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toFixed(2)}</span>
                   <button 
                     className="icon-btn remove-btn" 
                     onClick={() => handleRemove(item._id)}
                     title="Remove Item"
                   >
                     <FiTrash2 size={20} />
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary glass-effect">
             <h2>Order Summary</h2>
             <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${calculateTotal()}</span>
             </div>
             <div className="summary-row">
                <span>Shipping</span>
                <span style={{color: 'green'}}>Free</span>
             </div>
             <div className="summary-divider"></div>
             <div className="summary-row total-row">
                <span>Total</span>
                <span>${calculateTotal()}</span>
             </div>

             <button 
               className="btn btn-primary checkout-btn"
               onClick={() => navigate('/checkout')}
             >
               Proceed to Checkout
             </button>
             <Link to="/products" className="continue-shopping">
                Continue Shopping
             </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
