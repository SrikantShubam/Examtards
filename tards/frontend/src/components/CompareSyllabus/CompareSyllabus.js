// import { Fragment,useState, useEffect } from 'react';

// import { Combobox, Transition } from '@headlessui/react'

// function CompareSyllabus() {
//   const [selectedExamOne, setSelectedExamOne] = useState('');
//   const [selectedExamTwo, setSelectedExamTwo] = useState('');
//   const [queryOne, setQueryOne] = useState('');
//   const [queryTwo, setQueryTwo] = useState('');
//   const [examNames, setExamNames] = useState([]);

//   useEffect(() => {
//     // Fetch data from the provided endpoint
//     fetch('http://localhost:8000/all-exams/')
//       .then((response) => response.json())
//       .then((data) => {
//         if (data && data.exam_names) {
//           setExamNames(data.exam_names);
//           setSelectedExamOne(data.exam_names[0]); // Set default selected exam for first Combobox
//           setSelectedExamTwo(data.exam_names[0]); // Set default selected exam for second Combobox
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         // Handle errors if needed
//       });
//   }, []); // Run this effect only once, similar to componentDidMount

//   const filteredExamsOne =
//     queryOne === ''
//       ? examNames
//       : examNames.filter((exam) =>
//           exam.toLowerCase().includes(queryOne.toLowerCase())
//         );

//   const filteredExamsTwo =
//     queryTwo === ''
//       ? examNames
//       : examNames.filter((exam) =>
//           exam.toLowerCase().includes(queryTwo.toLowerCase())
//         );

//   return (
//     <>
//       <div className="body">
//         <div className='banner'>
//           <div className="row px-4">
//             <div className="col-md-7 col-sm-12">
//               <div className="content mt-5">
//                 <h1 className='mt-5'>Compare Syllabus</h1>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row mt-5">
//           <div className="col-md-6 align-items-center text-center">
//             <Combobox value={selectedExamOne} onChange={setSelectedExamOne}>
//               <Combobox.Input onChange={(event) => setQueryOne(event.target.value)} />
//               <Combobox.Options>
//                 {filteredExamsOne.map((examName) => (
//                   <Combobox.Option key={examName} value={examName}>
//                     {examName}
//                   </Combobox.Option>
//                 ))}
//               </Combobox.Options>
//             </Combobox>
//           </div>



          
//           <div className="col-md-6 text-center">
//             <Combobox value={selectedExamTwo} onChange={setSelectedExamTwo}>
//               <Combobox.Input onChange={(event) => setQueryTwo(event.target.value)} />
//               <Combobox.Options>
//                 {filteredExamsTwo.map((examName) => (
//                   <Combobox.Option key={examName} value={examName}>
//                     {examName}
//                   </Combobox.Option>
//                 ))}
//               </Combobox.Options>
//             </Combobox>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // export default CompareSyllabus;
import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import './CompareSyllabus.css';

function CompareSyllabus() {
  const [selectedExamOne, setSelectedExamOne] = useState('');
  const [selectedExamTwo, setSelectedExamTwo] = useState('');
  const [queryOne, setQueryOne] = useState('');
  const [queryTwo, setQueryTwo] = useState('');
  const [examNames, setExamNames] = useState([]);

  useEffect(() => {
    // Fetch data from the provided endpoint
    fetch('http://localhost:8000/all-exams/')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.exam_names) {
          setExamNames(data.exam_names);
          setSelectedExamOne(data.exam_names[0]); // Set default selected exam for first Combobox
          setSelectedExamTwo(data.exam_names[0]); // Set default selected exam for second Combobox
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // Handle errors if needed
      });
  }, []); // Run this effect only once, similar to componentDidMount

const handleSelectExamOne = (value) => {
    setSelectedExamOne(value);
    setQueryOne(''); // Clear query after selecting an item
  };

const handleSelectExamTwo = (value) => {
    setSelectedExamTwo(value);
    setQueryTwo(''); // Clear query after selecting an item
  };
  const handleComparison = () => {
    // Make an API call to pass selected exams to compare_syllabus endpoint
    fetchComparison(selectedExamOne, selectedExamTwo);
  };
  // const fetchComparison = (examOne, examTwo) => {
  //   // Perform a GET request using fetch or other HTTP request library
  //   fetch(`http://127.0.0.1:8000/compare_syllabus/?selected_exam_names[]=${examOne}&selected_exam_names[]=${examTwo}`)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json();
  //       }
  //       throw new Error('Network response was not ok.');
  //     })
  //     .then(data => {
  //       // Handle the comparison result received from the backend
  //       console.log('Comparison Result:', data.exam1_syllabus);
  
  //       // Further actions based on the comparison result
        
  //       // For example, if you want to display a success message:
  //       // displaySuccessMessage();
  
  //     })
  //     .catch(error => {
  //       console.error('There was a problem with the fetch operation:', error);
        
       
  //     });
  // };


  const fetchComparison = (examOne, examTwo) => {
    // Perform a GET request using fetch or other HTTP request library
    fetch(`http://127.0.0.1:8000/compare_syllabus/?selected_exam_names[]=${examOne}&selected_exam_names[]=${examTwo}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        // Check for server-side errors in the response
        if (data.error) {
          // Log and handle the server-side error
          console.warn('Server-side error:', data.error);
          alert(data.error);
          // Display the error message or perform actions based on this error
          // For example, display an alert with the error message
        
        } else {
          // Handle the comparison result received from the backend
          console.log('Comparison Result:', data.exam1_syllabus);
          // Proceed with any further processing if needed
        }
      })
      .catch(error => {
        // Check if the error is a fetch-related error (e.g., network issues)
        if (error.response && error.response.text) {
          // Fetch response text to get the error message
          error.response.text().then(errorMessage => {
            try {
              const errorObject = JSON.parse(errorMessage);
              if (errorObject.error) {
                // Log and handle the error message received from the server
                // alert('Server-side error:', errorObject.error);
                return; // Exit the catch block after handling the error
              }
            } catch (e) {
              // Handle any parsing errors or unexpected responses from the server
              console.error('Error parsing server response:', e);
            }
          });
        }
        
        // Log and handle other types of errors
        console.error('There was a problem with the fetch operation:', error);
        console.warn('There was an unexpected error. Please try again later.');
      });
  };
  















  const filteredExamsOne =
    queryOne === ''
      ? examNames
      : examNames.filter((exam) =>
          exam.toLowerCase().includes(queryOne.toLowerCase())
        );

  const filteredExamsTwo =
    queryTwo === ''
      ? examNames
      : examNames.filter((exam) =>
          exam.toLowerCase().includes(queryTwo.toLowerCase())
        );

  return (
    <>
      <div className="body">
        <div className='banner'>
          <div className="row px-4">
            <div className="col-md-7 col-sm-12">
              <div className="content mt-5">
                <h1 className='mt-5'>Compare Syllabus</h1>
              </div>
            </div>
          </div>
        </div>
        <section id="inputs">
        <div className="row mt-5">
          <div className="col-md-6 ">
          <label className='text-align-left'>Choose your exam</label>
          <div className="text-center align-items-center ">
            <Combobox value={selectedExamOne} onChange={handleSelectExamOne}>
              <Combobox.Input
                onChange={(event) => setQueryOne(event.target.value)}
                className="form-control" 
              />
              <Transition
                show={queryOne.length > 0 && filteredExamsOne.length > 0}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Combobox.Options className="list-group mt-2 rounded-md  shadow-lg">
                  {filteredExamsOne.map((examName) => (
                    <Combobox.Option key={examName} value={examName}>
                      <button className="list-group-item list-group-item-action">
                        {examName}
                        
                      

                      </button>
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Transition>
            </Combobox>
          </div>
          </div>
          <div className="col-md-6 ">
          <label className='text-align-left'>Choose your exam</label>
          <div className="text-center align-items-center">
          <Combobox value={selectedExamTwo} onChange={handleSelectExamTwo}>
          <Combobox.Input
            onChange={(event) => setQueryTwo(event.target.value)}
            className="form-control" 
          />
          <Transition
            show={queryTwo.length > 0 && filteredExamsTwo.length > 0}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Combobox.Options className="list-group mt-2 rounded-md shadow-lg">
              {filteredExamsTwo.map((examName) => (
                <Combobox.Option key={examName} value={examName}>
                  <button className="list-group-item list-group-item-action">
                    {examName}
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </Combobox></div>
         
          </div>
        </div>
        <button className="btn btn-primary mt-5" onClick={handleComparison}>Compare</button>
        </section>  
      </div>
    </>
  );
}

export default CompareSyllabus;
