import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import style from './generalinstuctions.module.css'; // Import CSS module

function GeneralInstructions(props) {
  const location = useLocation();
  const { examName } = useParams(); // Get the paperName parameter using useParams
  const paperData = JSON.parse(location.state) || {}; // Parse paperData if it's a string

  return (
    <div className='body'>
      <h2>General Instructions</h2>
      <ul className={`${style.starList} mt-5`}> {/* Apply CSS class for star list */}
        <li>The paper name is {examName}</li>
        <li>It's an MCQ-based question with single choice options</li>
        {paperData.meta && paperData.meta.totalquestions ? (
          <>
            <li>Total questions are {paperData.meta.totalquestions}</li>
            <li>Time allotted is {paperData.meta.timeAllot} minutes</li>
            {paperData.meta.negativeMarking ? (
              <>
                <li>There's negative marking</li>
                <li>For each incorrect answer you will be deducted {paperData.meta.negativeMark} marks</li>
              </>
            ) : (
              <li>There's no negative marking</li>
            )}
            <li>Each correct answer is {paperData.meta.totalmarks / paperData.meta.totalquestions} marks</li>
            <li>To keep this service free for every student, upon clicking on "Attempt", you will see an ad ranging from 30 seconds to 1 minute</li>
            <li>After completing your paper, click on "Finish". After which, you will again see an ad</li>
            <li>Your report will be generated in PDF format at the end of the ad</li>
          </>
        ) : (
          <li>Oops! Paper data is not available</li>
        )}
      </ul>
    </div>
  );
}

export default GeneralInstructions;
