import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(response.data);
        if(response.data.sizes && response.data.sizes.length > 0) {
           setSelectedSize(response.data.sizes[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Please login to add items to cart");
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post('http://localhost:8000/api/cart', {
        userId: user._id,
        title: product.title,
        description: product.description,
        mainImg: product.mainImg,
        size: selectedSize,
        quantity: quantity,
        price: product.price,
        discount: product.discount
      });
      alert("Added to Cart Successfully!");
    } catch (error) {
       console.error("Cart addition failed", error);
       alert("Failed to add to cart");
    } finally {
       setAddingToCart(false);
    }
  };

  if (loading) return <div className="loader">Loading details...</div>;
  if (!product) return <div className="loader">Product not found.</div>;

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
         <FiArrowLeft /> Back
      </button>

      <div className="detail-container glass-effect">
        <div className="detail-image-section">
           <img 
              src={product.mainImg || 'https://via.placeholder.com/500x600?text=ShopEZ'} 
              alt={product.title} 
              className="detail-main-img" 
           />
           {product.discount > 0 && <span className="detail-discount">-{product.discount}% OFF</span>}
        </div>

        <div className="detail-info-section">
           <p className="detail-category">{product.category} | {product.gender}</p>
           <h1 className="detail-title">{product.title}</h1>
           
           <div className="detail-price-box">
             {product.discount > 0 ? (
               <>
                 <span className="detail-current-price">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                 <span className="detail-original-price">${product.price.toFixed(2)}</span>
               </>
             ) : (
               <span className="detail-current-price">${product.price.toFixed(2)}</span>
             )}
           </div>

           <p className="detail-description">{product.description}</p>

           {product.sizes && product.sizes.length > 0 && (
             <div className="detail-options">
               <label>Select Size</label>
               <div className="size-selector">
                 {product.sizes.map(s => (
                   <button 
                     key={s} 
                     className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                     onClick={() => setSelectedSize(s)}
                   >
                     {s}
                   </button>
                 ))}
               </div>
             </div>
           )}

           <div className="detail-options">
              <label>Quantity</label>
              <div className="quantity-selector">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                 <span>{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
           </div>

           <button 
             className="btn btn-primary add-to-cart-large" 
             onClick={handleAddToCart}
             disabled={addingToCart}
           >
              <FiShoppingCart size={20} style={{marginRight: '10px'}}/>
              {addingToCart ? 'Adding...' : 'Add to Cart'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
