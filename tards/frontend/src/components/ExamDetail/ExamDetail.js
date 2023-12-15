import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './ExamDetail.css'
function calculateExamDuration(examDate) {
  const examDateTime = new Date(examDate);
  const now = new Date();

  const timeDiff = examDateTime - now;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}

function ExamDetail() {
  const { examName } = useParams();
  const [examDetails, setExamDetails] = useState(null);
  const [remainingTime, setRemainingTime] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        let decodedExamName = decodeURIComponent(examName);
        const apiUrl = `http://localhost:8000/exam-detail/${encodeURIComponent(decodedExamName)}`;

        const response = await axios.get(apiUrl);
        setExamDetails(response.data);

        // Calculate remaining time until the exam
        const { days, hours, minutes } = calculateExamDuration(response.data.exam_date);
        setRemainingTime({ days, hours, minutes });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchExamData();
  }, [examName]);

  return (
    <section id="exam_details">
      <div>
        {examDetails ? (
          <div className="row" id="banner">
            <div className="col-md-4">
              <div>
                <h3>{examDetails.name}</h3>
               
                <p className='first'>About the exam</p>
                <p>{examDetails.exam_description}</p>
              </div>
            </div>
            <div className="col-md-8">
              <h3>Time Remaining</h3>
              <div className="row ml-5">
                <div className="col-md-4">
                  <div className="card-2 text-center">
                    <h4 className='d-flex flex-column align-items-center justify-content-center'>
                      {remainingTime.days}
                    </h4>
                  </div>
                  <h4 className='text-center t'>Days</h4>
                </div>
          
                <div className="col-md-4">
                  <div className="card-2 text-center">
                    <h4 className='d-flex flex-column align-items-center justify-content-center'>
                      {remainingTime.hours}
                    </h4>
                  </div>
                  <h4 className='text-center t'>Hours</h4>
                </div>
                <div className="col-md-4">
                  <div className="card-2 text-center">
                    <h4 className='d-flex flex-column align-items-center justify-content-center'>
                      {remainingTime.minutes}
                    </h4>
                  </div>
                  <h4 className='text-center t'>Minutes</h4>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </section>


    
  );
}

export default ExamDetail;
