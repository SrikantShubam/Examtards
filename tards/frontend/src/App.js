import React from 'react';
import './App.css';
// import Cards from './cards'; // Assuming the file is named cards.js and exports the Cards component


/* importing main components from components**/
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ExamDetail from '../src/components/ExamDetail/ExamDetail';
import {Header,Banner,Card,Sidenav,Footer} from './components';
function App() {

  return (
    <>

            <Routes>
                <Route path='/exam-detail/<str:exam_name>' element={<ExamDetail/>} />
               
            </Routes>      
         
       
  <Header />
  <Banner />
  <Sidenav />
  < Card />
  <Footer />

    </>
  );
}

export default App;
