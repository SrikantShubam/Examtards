import React , { useState,useEffect } from 'react';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import ScrollToTop from "react-scroll-to-top";
import { ReactComponent as MySVG } from "./up.svg";
import {Header,Banner,Card,Sidenav,Footer,CompareSyllabus,ExamDetail,Contact,Disclaimer,SignUp,Userpanel,Login,ForgotPassword,Dashboard} from './components';



function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  useEffect(() => {
    // Make an HTTP request to the Django sitemap URL
    fetch('http://127.0.0.1:8000/sitemap.xml')
        .then(response => response.text())
        .then(data => {
            // Handle the sitemap XML data as needed
            // console.log(data);
        });
}, []);
  return (
    <>
      <Header />
   
    <Routes>
    <Route path="/compare-syllabus" element={<CompareSyllabus />} />
    <Route path="/user-panel" element={<Userpanel />} />
    <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/exam-detail/:examName" element={<ExamDetail />} />
      <Route path="/contact-us" element={<Contact />} />
<Route path="/disclaimer" element={<Disclaimer />}/>
<Route path="/sign-up" element={<SignUp />}/>
<Route path="/login" element={<Login />}/>
<Route path="/forgot-password" element={<ForgotPassword />}/>
      <Route
        path="/"
        element={
          <>
             <div className="body">
            <Banner />
            <div id="menu" className='mb-5'>
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
            <ScrollToTop smooth component={<MySVG />} />
            
            </div>
      
     
          
          </>
        }
      />
    </Routes>
    <Footer />
    </>
    
  );
}

export default App;
