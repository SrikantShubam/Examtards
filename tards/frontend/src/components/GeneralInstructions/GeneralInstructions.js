import React from 'react';
import { useLocation } from 'react-router-dom';
import style from './generalinstuctions.module.css';

function GeneralInstructions() {
    const location = useLocation();
    console.log('Location state:', location.state); // Log location state

    const paperNamesData = location.state && location.state.paperData; // Extract paperData

    console.log('Received paperNamesData:', paperNamesData);
  
    return (
      <div className={style.body}>
        <h1>These are the general instructions</h1>
        <div>
          {/* Render paperNamesData here */}
          {paperNamesData && paperNamesData.map((paperData, index) => (
            <div key={index}>
              {/* Render individual paperData */}
              <p>Paper Name: {paperData.paperName}</p>
              {/* Render other data as needed */}
            </div>
          ))}
        </div>
      </div>
    );
}

export default GeneralInstructions;
