// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './sidenav.css';

// function Sidenav({ handleCategoryClick }) {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     // Fetch categories from Django backend
//     axios.get('http://localhost:8000/get-categories/')
//       .then(response => {
//         // Sort the categories to have 'Popular' at the top
//         const sortedCategories = response.data.categories.sort((a, b) => {
//           if (a === 'upcoming') return -1;  // 'upcoming' comes first
//           if (b === 'upcoming') return 1;   // If 'b' is 'upcoming', it comes after 'a'
//           if (a === 'popular') return -1;  // 'popular' comes after 'upcoming'
//           if (b === 'popular') return 1;   // If 'b' is 'popular', it comes before 'a'
//           return 0;  // Default case, maintain the original order
//         });
//         setCategories(sortedCategories);
//         console.log(response.data.categories);
//       })
//       .catch(error => {
//         console.error('Error fetching categories:', error);
//       });
//   }, []);

//   return (
//     <div>
//       <ul className='sidebar'>
//         {categories.map(category => (
//           <li key={category}>
//             <div className='wrapper-buttons ' onClick={() => handleCategoryClick(category)} target="_blank" rel="noopener noreferrer" tabIndex="0">
//               <button className="btn">{category}</button>
                
             
//               <i className="fas fa-chevron-right"></i>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidenav;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './sidenav.css';

function Sidenav({ handleCategoryClick }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8000/get-categories/')
      .then((response) => {
        const sortedCategories = response.data.categories.sort((a, b) => {
          if (a === 'upcoming') return -1;
          if (b === 'upcoming') return 1;
          if (a === 'popular') return -1;
          if (b === 'popular') return 1;
          return 0;
        });
        setCategories(sortedCategories);
        setLoading(false);
        console.log(response.data.categories);
        if (activeCategory === '') {
          setActiveCategory(sortedCategories[0]);
          handleCategoryClick(sortedCategories[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, [handleCategoryClick]);

  const handleClick = (category) => {
    setActiveCategory(category);
    handleCategoryClick(category);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul className="sidebar">
        {categories.map((category) => (
          <li key={category}>
            <div
              className={`wrapper-buttons ${category === activeCategory ? 'active-side' : ''}`}
              onClick={() => handleClick(category)}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex="0"
            >
              <button className="btn">{category}</button>
              <i className="fas fa-chevron-right"></i>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidenav;




