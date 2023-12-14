import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cards.css';
import { Link } from 'react-router-dom';
function Card({ category }) {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Fetch exams belonging to the specified category from Django backend
    if (category) {
      axios.get(`http://127.0.0.1:8000/category-data/${category}/`)
        .then(response => {
          setExams(response.data);
        })
        .catch(error => {
          console.error('Error fetching exams:', error);
        });
    }
  }, [category]);
  const formatDate = (inputDate) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(inputDate);
    return date.toLocaleDateString('en-US', options);
  };
  return (
    
  <div className="row " style={{marginLeft:'4rem'}}>
    {exams.map((exam, index) => (
      <div className="col-md-4" key={index}>
        <Link to={`/exam-detail/${encodeURIComponent(exam.name.replace(/\s/g, '-'))}`}>
         <div className="card">
          <div className="card-body">
            <h4 className="card-title">{exam.name}</h4>
            
           
            <p className="card-text">{formatDate(exam.exam_date)}</p>
           

        
          </div>
        </div>  
        </Link>
      </div>
    ))}
  </div>

  );
}

export default Card;
