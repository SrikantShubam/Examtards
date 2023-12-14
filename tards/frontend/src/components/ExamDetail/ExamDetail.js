import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ExamDetail() {
  const { examName } = useParams();

  useEffect(() => {
    // Decode the examName received from the URL
    const decodedExamName = decodeURIComponent(examName);

    // Use the decodedExamName in your component logic or make API requests
    console.log('Decoded Exam Name:', decodedExamName);

    // Example: Make an API request with the decoded exam name
    // fetch(`http://localhost:3000/exam-detail/${decodedExamName}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     // Handle API response data
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     // Handle errors
    //     console.error('Error fetching data:', error);
    //   });
  }, [examName]);

  return (
    <div>
      <h2>Exam Detail Page</h2>
      {/* Your component content */}
    </div>
  );
}

export default ExamDetail;
