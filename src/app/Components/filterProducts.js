import { useState } from 'react';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import styles from './filterProducts.module.css'; 

const FilterProducts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 350]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    'Category 1',
    'Category 2',
    'Category 3'
  ];

  const products = [
    'Product 1',
    'Product 2',
    'Product 3'
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleFilterClick = () => {
    // Handle filter logic here
    console.log('Filter applied:', {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categories: selectedCategories
    });
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(prevSelected =>
      prevSelected.includes(value)
        ? prevSelected.filter(category => category !== value)
        : [...prevSelected, value]
    );
  };

  return (
    <div className={styles['filter-products']}>
      <div onClick={toggleMenu} className={styles['filter-products-icon']}>
        <FilterAltOutlinedIcon /> Filter Products
      </div>
      {isOpen && (
        <div className={styles['mega-menu']}>
        <div className={styles['menu-section']}>
            <ul className={styles['product-list']}>
                {products.map((product) => (
                <li key={product}>
                    <span>{product}</span>
                </li>
                ))}
            </ul>
          </div>
          <div className={styles['menu-section']}>
            <h3>Product Categories</h3>
             
            <ul className={styles['category-list']}>
                {categories.map((category) => (
                <li key={category}>
                    <label>
                    <input
                        type="checkbox"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={handleCategoryChange}
                    />
                    <span>{category}</span>
                    </label>
                </li>
                ))}
            </ul>
          </div>
          
          <div className={styles['menu-section']}>
            <h3>Filter By Price</h3>
            
            <div className='flex items-center gap-4'>
                <div className={styles['price-range-labels']}>
                <span>Price: ${priceRange[0]}-${priceRange[1]}</span>
                </div>
                <button className={styles['filter-button']} onClick={handleFilterClick}>
                Filter
                </button>
            </div>
            
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={350}
              aria-labelledby="price-range-slider"
            />
          </div>
          
          <div className={styles['menu-section']}>
            <h3>Product Status</h3>
            <div className={styles['checkbox-group']}>
                <label>
                <input
                    type="checkbox"
                    value="in-stock"
                />
                <span>In Stock</span>
                </label>
                <label>
                <input
                    type="checkbox"
                    value="on-sale"
                />
                <span>On Sale</span>
                </label>
            </div>
          </div>
          
          
        </div>
      )}
    </div>
  );
};

export default FilterProducts;
