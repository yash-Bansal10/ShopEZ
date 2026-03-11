import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [sortBy, setSortBy] = useState('Popular');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://shopez-83qn.onrender.com/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sync with URL query params (Search / Category from Home)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');

    let result = [...products];

    // Search text filter
    if (searchParam) {
      const lowerSearch = searchParam.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(lowerSearch) || 
        p.category?.toLowerCase().includes(lowerSearch)
      );
    }

    // Category click from Home Page
    if (categoryParam && selectedCategories.length === 0) {
       setSelectedCategories([categoryParam]);
    }

    // Sidebar Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Sidebar Gender Filter
    if (selectedGenders.length > 0) {
      result = result.filter(p => selectedGenders.includes(p.gender));
    }

    // Sorting
    if (sortBy === 'Price (low to high)') {
      result.sort((a, b) => {
        const pA = a.discount > 0 ? a.price * (1 - a.discount/100) : a.price;
        const pB = b.discount > 0 ? b.price * (1 - b.discount/100) : b.price;
        return pA - pB;
      });
    } else if (sortBy === 'Price (high to low)') {
      result.sort((a, b) => {
        const pA = a.discount > 0 ? a.price * (1 - a.discount/100) : a.price;
        const pB = b.discount > 0 ? b.price * (1 - b.discount/100) : b.price;
        return pB - pA;
      });
    } else if (sortBy === 'Discount') {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    // "Popular" could just be default order or sort by rating if we had it

    setFilteredProducts(result);
  }, [products, location.search, selectedCategories, selectedGenders, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleGenderChange = (gen) => {
    setSelectedGenders(prev => 
      prev.includes(gen) ? prev.filter(g => g !== gen) : [...prev, gen]
    );
  };

  return (
    <div className="products-layout">
      {/* LEFT SIDEBAR FILTERS */}
      <aside className="filters-sidebar">
        <h3>Filters</h3>
        
        <div className="filter-group">
          <h4>Sort By</h4>
          {['Popular', 'Price (low to high)', 'Price (high to low)', 'Discount'].map(sortOpt => (
            <label key={sortOpt} className="filter-label">
              <input 
                 type="radio" 
                 name="sortBy" 
                 checked={sortBy === sortOpt}
                 onChange={() => setSortBy(sortOpt)}
              />
              {sortOpt}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h4>Categories</h4>
          {['Mobiles', 'Electronics', 'Sports Equipments', 'Fashion', 'Groceries', 'Outerwear', 'Dresses', 'Footwear'].map(catOpt => (
            <label key={catOpt} className="filter-label">
              <input 
                type="checkbox"
                checked={selectedCategories.includes(catOpt)}
                onChange={() => handleCategoryChange(catOpt)}
              />
              {catOpt}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h4>Gender</h4>
          {['Men', 'Women', 'Unisex'].map(genOpt => (
            <label key={genOpt} className="filter-label">
              <input 
                type="checkbox"
                checked={selectedGenders.includes(genOpt)}
                onChange={() => handleGenderChange(genOpt)}
              />
              {genOpt}
            </label>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="products-main">
        <div className="products-header">
           <h1 className="title-gradient">All Products</h1>
        </div>

        {loading ? (
          <div className="loader">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
             <h2>No Products Found</h2>
             <p>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
