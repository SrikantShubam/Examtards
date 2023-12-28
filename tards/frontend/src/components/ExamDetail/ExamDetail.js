import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ExamDetail.css';

function calculateExamDuration(examDate) {
  const examDateTime = new Date(examDate);
  const now = new Date();

  const timeDiff = examDateTime - now;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}

function formatExamDate(examDate) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateObj = new Date(examDate);
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
}



function ExamDetail() {
  const { examName } = useParams();
  const [examDetails, setExamDetails] = useState(null);
  const [remainingTime, setRemainingTime] = useState({ days: 0, hours: 0, minutes: 0 });
  const [userInput, setUserInput] = useState('');
  
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        let decodedExamName = decodeURIComponent(examName);
        const apiUrl = `http://localhost:8000/exam-detail/${encodeURIComponent(decodedExamName)}`;

        const response = await axios.get(apiUrl);
        setExamDetails(response.data);

        const { days, hours, minutes } = calculateExamDuration(response.data.exam_date);
        setRemainingTime({ days, hours, minutes });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchExamData();
  }, [examName]);
  const [warningMessage, setWarningMessage] = useState('');

  const handleDownloadSyllabus = async (examName) => {
    try {
      const response = await axios.get(`http://localhost:8000/download-syllabus/${encodeURIComponent(examName)}`, {
        responseType: 'blob', // Ensure response type is set to 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const fileName = `${examName}_syllabus.pdf`; // Dynamically generate the file name
      link.href = url;
      link.setAttribute('download', fileName); // Use the generated file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
    } catch (error) {
      console.error('Error downloading syllabus:', error);
      // Handle other errors if needed
    }
  };
  const handleDownloadPattern = async (examName) => {
    try {
      const response = await axios.get(`http://localhost:8000/download-pattern/${encodeURIComponent(examName)}`, {
        responseType: 'blob', // Ensure response type is set to 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const fileName = `${examName}_pattern.pdf`; // Dynamically generate the file name
      link.href = url;
      link.setAttribute('download', fileName); // Use the generated file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
    } catch (error) {
      console.error('Error downloading pattern:', error);
      // Handle other errors if needed
    }
  };
  
  const handleButtonClick = async () => {
    const baseURL = 'https://www.perplexity.ai/search?';
    const encodedQuery = encodeURIComponent(userInput);
    const fullURL = baseURL + 'q=' + encodedQuery + '&copilot=false';
    
    window.open(fullURL, '_blank');
  };
  return (
    

    <>
    <div className="body">
  {examDetails ? (
    <div id="exam_details">
  
  
    <div className="row" id="main">
  <div className="col-md-5 col-sm-12">
    <h4>{examDetails.name}</h4>
    <h5>Exam Date: {formatExamDate(examDetails.exam_date)}</h5>
    <h5>About the exam</h5>
    <h6>{examDetails.exam_description}</h6>
  </div>
  <div className="col-md-7 col-sm-12">
    <h2>Time Remaining</h2>
    <div className="row">
      <div className="col-sm-4">
        <div className="card-2">
          <h2>{remainingTime.days}</h2>
        </div>
        <h3 className='text-center mt-3'>Days</h3>
      </div>
      <div className="col-sm-4">
        <div className="card-2">
          <h2>{remainingTime.hours}</h2>
        </div>
        <h3 className='text-center mt-3'>Hours</h3>
      </div>
      <div className="col-sm-4">
        <div className="card-2">
          <h2>{remainingTime.minutes}</h2>
        </div>
        <h3 className='text-center mt-3'>Minutes</h3>
      </div>
    </div>
  </div>
</div>

<section id="second">
  <div className="row">
    <div className="col-md-5 col-sm-12">
      <h1>Eligibility</h1>
      {examDetails && (
        <div>
          {examDetails.eligibility_criteria.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
    <div className="col-md-7 col-sm-12">
      <div className="row">
        <div className="col-md-11 col-sm-6 " id="content">
          <h2>Important Dates</h2>
          <div className="text-content">
          {examDetails && examDetails.important_dates && (
                  Object.entries(JSON.parse(examDetails.important_dates)).map(
                    ([key, value],index) => (
            <div className="d-flex justify-content-between flex-direction-column">
              <p>{key}</p>
              
              <p>{value}</p>
           
            </div>
                   )))}
          
          
          </div>
        </div>
        {/* Add other col-md-12 divs similarly for other date fields */}
     

        <div className="col-md-11 mt-5" id="content">
          <h2>Important Dates</h2>
          <div className="text-content">
          {examDetails && examDetails.important_dates && (
                  Object.entries(JSON.parse(examDetails.important_dates)).map(
                    ([key, value],index) => (
            <div className="d-flex justify-content-between flex-direction-column">
              <p>{key}</p>
              
              <p>{value}</p>
           
            </div>
                   )))}
          
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section id="third">
      <div className="row">
        <div className="col-md-5 col-sm-12">
          <div className="row">
            <div className="col-md-12" id="content" onClick={() => handleDownloadSyllabus(examName)}>
              <h2 className="plus-icon">+</h2>
              <h2 className="text-center italic-text">Download Syllabus</h2>
            </div>
     
            <div className="col-md-12 mt-5" id="content" onClick={() => handleDownloadPattern(examName)}>
              <h2 className="plus-icon">+</h2>
              <h2 className="text-center italic-text">Download Pattern</h2>
            </div>
          </div>
        </div>
        <div className="col-md-7 col-sm-12">
          <div className="content-2">
            <h1>Important Resources</h1>
         
                {examDetails && examDetails.important_resources && (
                  Object.entries(JSON.parse(examDetails.important_resources)).map(
                    ([key, value],index) => (
                 
                    <div key={index} className="d-flex align-items-center">
                      <div className="text-imp">{`${key}`}</div>
                      <div className="icon-imp">
                      <a href={`${value}`} target='_blank'>
                       <i className="fas fa-chevron-right"></i>
                      </a>
                      </div>
                    </div>
                    
                    )
                  )
                )}
          

          </div>
        </div>
      </div>
    </section>
 
 <section id="forth">
<div className="centered-input col-lg-12">
  <div className="wrapper">
  <input
          type="text"
          value={userInput}
         
          placeholder="Any doubts ask AI"
        />
        <button onClick={handleButtonClick}>
        <i className="fa-solid fa-angle-right fa-lg"></i>
        </button>
  </div>
        
      </div>
      </section>
    </div>
  ) : (
    <p>Loading...</p>
  )}
  </div>

</>

  );
}

export default ExamDetail;
