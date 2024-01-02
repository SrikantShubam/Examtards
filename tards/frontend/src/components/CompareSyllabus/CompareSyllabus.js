
import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';


import './CompareSyllabus.css';

function CompareSyllabus() {
  const [selectedExamOne, setSelectedExamOne] = useState('');
  const [selectedExamTwo, setSelectedExamTwo] = useState('');
  const [queryOne, setQueryOne] = useState('');
  const [queryTwo, setQueryTwo] = useState('');
  const [examNames, setExamNames] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null); // Track comparison result
  const [showMore, setShowMore] = useState(false);

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
 
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

  const fetchComparison = (examOne, examTwo) => {
 
    fetch(`http://127.0.0.1:8000/compare_syllabus/?selected_exam_names[]=${examOne}&selected_exam_names[]=${examTwo}`)
      .then(response => {
        if (response.ok) {
         
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
      
        if (data.error) {
      
          console.warn('Server-side error:', data.error);
          alert(data.error);
          
      
        
        } else {
         console.log(data);
          setComparisonResult(data); // Set comparisonResult state with received data

        
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
  const renderTopics = () => {
    if (!comparisonResult || !comparisonResult.common_topics) {
      return <div>No topics available</div>;
    }

    const topics = comparisonResult.common_topics;

    let topicList = [];

    // Extract all topics from each subject into a single array
    Object.values(topics).forEach(subjectTopics => {
      topicList = [...topicList, ...subjectTopics];
    });

    // Apply slicing based on the showMore state
    const slicedTopics = showMore ? topicList : topicList.slice(0, 3);

    return slicedTopics.map((topic, index) => (
      <div key={index}>
        {topic}
      </div>
    ));
  };

  const handleToggle = () => {
    setShowMore(!showMore);
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
          
        <section className="comparison">
        {comparisonResult && (
          <div>
            <h1 className='text-center'>Comparison</h1>
         
         

            <div className="row mt-5">
            <div className="col-md-8">
            <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>{selectedExamOne}</th>
                <th>{selectedExamTwo}</th>
              </tr>
            </thead>
            <tbody>
            <tr>
            <th scope="row">Total Subjects</th>
            <td>{comparisonResult.exam1_total_subject}</td>
            <td>{comparisonResult.exam2_total_subject}</td>
         
          </tr>
          <tr>
            <th scope="row">Subject Names</th>
            <td>{comparisonResult.names_subjects_exam1}</td>
            <td>{comparisonResult.names_subjects_exam2}</td>
         
          </tr>
         
          <tr>
          <th scope="row">Unique Subjects</th>
          <td>{comparisonResult.unique_subjects_in_exam1}</td>
          <td>{comparisonResult.unique_subjects_in_exam2}</td>
       
        </tr>
        
        <tr>
        <th scope="row">Total Topics</th>
        <td>{comparisonResult.total_topics_exam1}</td>
        <td>{comparisonResult.total_topics_exam2}</td>
    
      </tr>
      <tr>
      <th scope="row">Topic Count by Subjects</th>
      <td>
    
        {Object.entries(comparisonResult.subject_topic_count_exam1).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
      
      </td>
      <td>
    
      {Object.entries(comparisonResult.subject_topic_count_exam2).map(([key, value]) => (
        <div key={key}>
          {key}: {value}
        </div>
      ))}
    
    </td>
    
    </tr>
    <tr>
    <th scope="row">Common Subjects</th>
    <td>
    {renderTopics()}
    {comparisonResult && (
      <button onClick={handleToggle}>
        {showMore ? 'View less' : 'View more'}
      </button>
    )}
  
    </td>
    <td>Same as previous</td>
    </tr>
    <tr>
    <th scope="row">Common Subject Similarity
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Tooltip on left">
  Tooltip on left
</button>
    </th>
    <td>
{comparisonResult.common_subjects_similarity_score}
    </td>
    <td>Same as previous</td>
    </tr>
            </tbody>
            </table>
            </div>
            <div className="col-md-4"></div>
            
            </div>
          </div>
        )}
      </section>
      </div>


   
    </>
  );
}

export default CompareSyllabus;
