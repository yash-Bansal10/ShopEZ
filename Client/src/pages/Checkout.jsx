import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // Reuse form styles

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    paymentMethod: 'Credit Card'
  });
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
        const response = await axios.get(`https://shopez-83qn.onrender.com/api/cart/${user._id}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      return total + (itemPrice * item.quantity);
    }, 0).toFixed(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(cartItems.length === 0) {
       alert("No items in cart to checkout!");
       return;
    }

    try {
      // Loop through cart items and create an order for each (based on schema)
      for (let item of cartItems) {
         await axios.post('https://shopez-83qn.onrender.com/api/orders', {
             userId: user._id,
             name: formData.name,
             email: user.email,
             mobile: formData.mobile,
             address: formData.address,
             pincode: formData.pincode,
             title: item.title,
             description: item.description,
             mainImg: item.mainImg,
             size: item.size,
             quantity: item.quantity,
             price: item.price,
             discount: item.discount,
             paymentMethod: formData.paymentMethod
         });
         // Clean up cart as we go
         await axios.delete(`https://shopez-83qn.onrender.com/api/cart/${item._id}`);
      }

      alert("Order Placed Successfully!");
      navigate(`/profile/${user._id}`); // Or Order Confirmation
    } catch (err) {
      console.error(err);
      alert('Order Placement Failed');
    }
  };

  if (loading) return <div className="loader">Processing Checkout...</div>;

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start' }}>
      <div className="auth-box glass-effect" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="title-gradient text-center">Secure Checkout</h2>
        <p className="text-center auth-subtitle" style={{marginBottom: '1rem'}}>
           Total: <strong style={{color: 'var(--color-primary-dark)'}}>${calculateTotal()}</strong>
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="John Doe"
            />
          </div>
          
          <div className="form-group">
            <label>Mobile Number</label>
            <input 
              type="text" 
              name="mobile" 
              value={formData.mobile} 
              onChange={handleChange} 
              required 
              placeholder="123-456-7890"
            />
          </div>

          <div className="form-group">
            <label>Shipping Address</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
              placeholder="123 Main St, Apt 4"
            />
          </div>

          <div className="form-group">
            <label>Pincode / Zip</label>
            <input 
              type="text" 
              name="pincode" 
              value={formData.pincode} 
              onChange={handleChange} 
              required 
              placeholder="10001"
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select 
               name="paymentMethod" 
               value={formData.paymentMethod} 
               onChange={handleChange}
               style={{
                  padding: '0.8rem', borderRadius: '8px', 
                  border: '1px solid var(--color-border)', 
                  fontFamily: 'inherit', fontSize: '1rem'
               }}
            >
               <option value="Credit Card">Credit Card</option>
               <option value="PayPal">PayPal</option>
               <option value="Cash On Delivery">Cash On Delivery</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" style={{marginTop: '1.5rem'}}>
             Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
