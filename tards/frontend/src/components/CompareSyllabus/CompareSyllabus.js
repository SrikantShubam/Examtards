import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';

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
        <div className="row mt-5">
          <div className="col-md-6 align-items-center text-center">
            <Combobox value={selectedExamOne} onChange={setSelectedExamOne}>
              <Combobox.Input onChange={(event) => setQueryOne(event.target.value)} />
              <Combobox.Options>
                {filteredExamsOne.map((examName) => (
                  <Combobox.Option key={examName} value={examName}>
                    {examName}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
          </div>
          <div className="col-md-6 text-center">
            <Combobox value={selectedExamTwo} onChange={setSelectedExamTwo}>
              <Combobox.Input onChange={(event) => setQueryTwo(event.target.value)} />
              <Combobox.Options>
                {filteredExamsTwo.map((examName) => (
                  <Combobox.Option key={examName} value={examName}>
                    {examName}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompareSyllabus;
