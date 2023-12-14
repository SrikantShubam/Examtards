import React , { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import ExamDetail from '../src/components/ExamDetail/ExamDetail';
import {Header,Banner,Card,Sidenav,Footer} from './components';



function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  return (
    <>
      <Header />
    <Routes>
      <Route path="/exam-detail/:examName" element={<ExamDetail />} />

    
      <Route
        path="/"
        element={
          <>
          
            <Banner />
            <div id="menu">
          <h2 className=''>Get Latest Exam <span>Details</span></h2>  
              <div className="row mt-5">
                <div className="col-md-2 col-sm-6">
                <Sidenav handleCategoryClick={handleCategoryClick} />
                </div>
                <div className="col-md-10 col-sm-6">
                <Card category={selectedCategory} />
                </div>
              </div>
            </div>
           
      
      
   
            <Footer />
          </>
        }
      />
    </Routes></>
    
  );
}

export default App;
