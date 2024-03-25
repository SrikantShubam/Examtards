import React, { useState, useEffect, useCallback, memo } from 'react';
import { getFirestore, collection,orderBy , getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import styles from '../AllExams/AllExams.module.css';
import { Link } from 'react-router-dom';
function AllExams() {
  const firestore = getFirestore();

  const getPopularExams = useCallback(async () => {
    const popularExams = [];

    try {
      const popularDocRef = doc(firestore, 'popular-exams', 'popular');
      const popularDoc = await getDoc(popularDocRef);

      if (popularDoc.exists()) {
        const popularData = popularDoc.data();
        for (const [examName, isPopular] of Object.entries(popularData)) {
          if (isPopular === true) {
            popularExams.push(examName);
          }
        }
      }
    } catch (error) {
      console.error('Error getting popular exams:', error);
    }

    return popularExams;
  }, [firestore]);

  const PopularExams = memo(() => {
    const [popularExams, setPopularExams] = useState([]);

    useEffect(() => {
      const fetchPopularExams = async () => {
        const exams = await getPopularExams();
        setPopularExams(exams);
      };

      fetchPopularExams();
    }, [getPopularExams]);

    return (
    
        <>
          {popularExams.length > 0 ? (
            popularExams.map((exam, index) => (
              <div className="col-md-3 col-sm-12" key={index}>
              <Link to={`/exam-series/${encodeURIComponent(exam.replace(/ /g, '-'))}`}>
              <div className="card d-flex justify-content-center align-items-center">
                    <div className="text-center">
                      <h4 className="m-0">{exam}</h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No popular exams found</p>
          )}
        </>

    
    );
  });



  const quizzesRef = collection(firestore, 'categories'); 
  const getExamNames = useCallback(async () => {
    const examNames = [];
    try {
      const quizzesSnapshot = await getDocs(quizzesRef);
      quizzesSnapshot.forEach((doc) => {
        const docData = doc.data();
        const arrayData = {};
        const keys = Object.keys(docData);
        keys.forEach((fieldName) => {
          if (Array.isArray(docData[fieldName])) {
            arrayData[fieldName] = docData[fieldName];
          }
        });
        const arrayDataKeys = Object.keys(arrayData).sort(); // Sort keys alphabetically
        examNames.push({ id: doc.id, arrayDataKeys, arrayData });
      });
    
      return examNames;
    } catch (error) {
      console.error('Error getting exam names:', error);
      return [];
    }
  }, [quizzesRef]);
  
  const ExamNames = () => {
    const [examNames, setExamNames] = useState([]);
    const [paperNames, setPaperNames] = useState([]);
    const [activeExam, setActiveExam] = useState('');
  
    useEffect(() => {
      const fetchExamNames = async () => {
        const names = await getExamNames();
        setExamNames(names);
    
        // Automatically set the first exam as active and fetch its data
        if (names.length > 0) {
          const firstExamKey = names[0].arrayDataKeys[0];
          setActiveExam(firstExamKey);
          handleClick(firstExamKey);
        }
      };
    
      fetchExamNames();
    }, [getExamNames]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const quizzesSnapshot = await getDocs(quizzesRef);
          const exams = quizzesSnapshot.map((doc) => {
            const docData = doc.data();
            const arrayData = {};
            const keys = Object.keys(docData);
            keys.forEach((fieldName) => {
              if (Array.isArray(docData[fieldName])) {
                arrayData[fieldName] = docData[fieldName];
              }
            });
            const arrayDataKeys = Object.keys(arrayData).sort();
            return { id: doc.id, arrayDataKeys, arrayData };
          });
    
          setExamNames(exams);
    
          // Set the first exam as active and fetch its paperNames
          if (exams.length > 0) {
            const firstExam = exams[0];
            const firstExamKey = firstExam.arrayDataKeys[0];
            setActiveExam(firstExamKey);
            const firstExamPaperNames = firstExam.arrayData[firstExamKey] || [];
            setPaperNames(firstExamPaperNames);
          }
        } catch (error) {
          console.error('Error getting exam names:', error);
        }
      };
    
      fetchData();
    }, []);
    
  
    const handleClick = async (examName) => {
      // Find the selected exam object based on the clicked exam name
      const selectedExam = examNames.find(exam => exam.arrayDataKeys.includes(examName));
      
      if (selectedExam) {
        // Retrieve the array data associated with the selected exam
        const arrayData = selectedExam.arrayData[examName];

        setPaperNames(arrayData);
        setActiveExam(examName);
    
      } else {
        // console.error(`Exam '${examName}' not found.`);
      }
    };
  
    useEffect(() => {
      const selectedExam = examNames.find(exam => exam.arrayDataKeys.includes(activeExam));
      if (selectedExam) {
        const arrayData = selectedExam.arrayData[activeExam];
        setPaperNames(arrayData);
      } else {
        console.error(`Exam '${activeExam}' not found.`);
      }
     
    }, [activeExam, examNames]);
    

  

  
  
  
  
  
  
  

  

    
    
    
    
  
  
   

    return (
      <>
        <div className="body">
          <div className='banner'>
            <div className="row px-4">
              <div className="col-md-7 col-sm-12">
                <div className="content">
                  <h1>Prepare and excel with examtards</h1>
                  <h4>Use our free tests and mock tests to win the exams race!</h4>
                </div>
              </div>
            </div>
          </div>
          <div id="menu">
            <h2>Popular Exam <span>Series</span></h2>
          </div>
          <div className="row">
            <PopularExams />
          </div>
        </div>
        <section id="category">
          <div className={styles.sec2}>
            <div className="body pt-4 mt-5">
              <div className="row">
                <div className="col-md-6 d-flex justify-content-start align-items-center">
                  <div id="menu">
                    <h2>Exam Series by <span>Category</span></h2>
                  </div>
                </div>
                <div className="col-md-6 d-flex justify-content-end align-items-center">
                  <form action="/search" method="GET" className="search-form" id="menu">
                    <div className={styles.custom_input}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.svg_icon} svg-icon`} viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                      </svg>
                      <input className={styles.input} type="text" placeholder="Search for exam" />
                    </div>
                  </form>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-2 col-sm-6">
                <div>
                {examNames.length > 0 ? (
                  <ul className="sidebar">
                    {examNames.map((exam, index) => (
                      exam.arrayDataKeys.map((key, idx) => (
                        <li
                          className={`d-flex justify-content-center align-items-center ${activeExam === key ? 'active-side' : ''}`}
                          key={`${index}-${idx}`}
                        >
                          <div className="wrapper-buttons">
                            <button onClick={() => handleClick(key)} className="btn">
                              {key}
                            </button>
                          </div>
                        </li>
                      ))
                    ))}
                  </ul>
                ) : (
                  <p>No exams found</p>
                )}
              </div>
       

              
              
              
              
              
                </div>
                <div className="col-md-10 col-sm-6">
                <div className="row" id="card-jum">
             
                
                {paperNames && paperNames.length > 0  ? (
                  <div className="row">
    {paperNames.map((paperName, index) => (
      <div className="col-md-3 col-sm-12" key={index}>
      <Link to={`/exam-series/${encodeURIComponent(paperName.replace(/ /g, '-'))}`}>
        <div className="card">
        <h5 className="card-title mt-3 mx-2">{paperName}</h5>
        </div>
        </Link>
      </div>
    ))}
  </div>
                ) : (
                  <p>No paper names found</p>
                )}
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return <ExamNames />;
}

export default AllExams;