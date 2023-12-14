import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './sidenav.css'
function Sidenav({ handleCategoryClick }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from Django backend
    axios.get('http://127.0.0.1:8000/get-categories/')
      .then(response => {
        setCategories(response.data.categories);
        console.log(response.data.categories)
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <div >
    <ul className='sidebar'>
      {categories.map(category => (
        <li key={category}>
          <div className='wrapper-buttons' onClick={() => handleCategoryClick(category)} target="_blank" rel="noopener noreferrer" tabIndex="0">
            <button className="btn ">
              {category}
            </button>
            <i className="fas fa-chevron-right"></i>
          </div>
        </li>
      ))}
    </ul>
  </div>


  
  );
}

export default Sidenav;
