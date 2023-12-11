

// // export default Popup;
// import React from 'react';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import './popup.css';

// function ExamDetail({ match }) {
//   // Access the exam name from the URL parameter
//   const { name } = match.params;

//   // Fetch exam details based on 'name' and display them
//   // Replace this with your logic to display exam details
//   return (
//     <div>
//       <h2>Exam Detail Page</h2>
//       <p>Exam Name: {decodeURIComponent(name)}</p>
//       {/* Add more details here */}
//     </div>
//   );
// }

// function Popup({ searchResults, closePopup }) {
//   return (
//     <Router>
//       <div>
//         <div className="popup-overlay" onClick={closePopup}></div>
//         <div className="container">
//           <div className="popup-header">
//             <div className="d-flex justify-content-between">
//               <div className='text'>Search <span>Results</span></div>
//               <button className="btn btn-dark" onClick={closePopup}>
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//           </div>
//           <Switch>
//             <Route exact path="/">
//               <div className="results-container">
//                 {searchResults.map((result, index) => (
//                   <div className="row pop-row" key={index}>
//                     <div className="col-md-4">{result.name}</div>
//                     <div className="col-md-4">{result.exam_date}</div>
//                     <div className="col-md-4">
//                       <Link to={`/exam-detail/${encodeURIComponent(result.name)}`}>
//                         <i className="fas fa-chevron-right"></i>
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="text-2">
//                 Did not find what you were looking for?
//               </div>
//               <div className='t2'>
//                 <a href="/">Click here.</a>
//               </div>
//             </Route>
//             <Route path="/exam-detail/:name" component={ExamDetail} />
//           </Switch>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default Popup;
// // Popup.js

// Popup.js

import React from 'react';
import { Link } from 'react-router-dom';
import './popup.css';



function Popup({ searchResults, closePopup }) {
  return (
 
      <div>
        <div className="popup-overlay" onClick={closePopup}></div>
        <div className="container">
          <div className="popup-header">
            <div className="d-flex justify-content-between">
              <div className='text'>Search <span>Results</span></div>
              <button className="btn btn-dark" onClick={closePopup}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
        
              <div className="results-container">
                {searchResults.map((result, index) => (
                  <div className="row pop-row" key={index}>
                    <div className="col-md-4">{result.name}</div>
                    <div className="col-md-4">{result.exam_date}</div>
                    <div className="col-md-4">
                      <Link to={`/exam-detail/${encodeURIComponent(result.name)}`}>
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-2">
                Did not find what you were looking for?
              </div>
              <div className='t2'>
                <a href="/">Click here.</a>
              </div>
        
        
          
        </div>
      </div>
    
  );
}

export default Popup;
