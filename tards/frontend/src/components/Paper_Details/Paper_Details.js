import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Paper_Details = () => {
  const { examName } = useParams();
  const decodedExamName = decodeURIComponent(examName.replace(/-/g, ' '));

  useEffect(() => {
    console.log('Paper_Details component mounted');
    console.log('Received exam:', decodedExamName);
  }, [decodedExamName]);

  return (
    <div className='body'>
      <h1>Hello</h1>
      <p>Exam Name: {decodedExamName}</p>
    </div>
  );
};

export default Paper_Details;