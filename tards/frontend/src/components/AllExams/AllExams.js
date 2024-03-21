import React, { useState, useEffect, useCallback, memo } from 'react';
import { getFirestore, collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import styles from '../AllExams/AllExams.module.css';

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
          <div className="col-3">
            <div className="card d-flex justify-content-center">
              {popularExams.map((exam) => (
                <div className="text-center" key={exam}><h4>{exam}</h4></div>
              ))}
            </div>
          </div>
        ) : (
          <p>No popular exams found</p>
        )}
      </>
    );
  });

  const quizzesRef = collection(firestore, 'quizzes');
  const getExamNames = useCallback(async () => {
    const examNames = [];

    try {
      const quizzesSnapshot = await getDocs(quizzesRef);
      quizzesSnapshot.forEach((doc) => {
        examNames.push(doc.id);
      });
    } catch (error) {
      console.error('Error getting exam names:', error);
    }

    return examNames;
  }, [quizzesRef]);

  const ExamNames = () => {
    const [examNames, setExamNames] = useState([]);
    const [paperNames, setPaperNames] = useState([]);

    useEffect(() => {
      const fetchExamNames = async () => {
        const names = await getExamNames();
        setExamNames(names);

        if (names.length > 0) {
          const firstExamName = names[0];
          const papers = await getPaperNamesForExam(firstExamName);
          setPaperNames(papers);
        }
      };

      fetchExamNames();
    }, [getExamNames]);

    const getPaperNamesForExam = useCallback(async (examName) => {
      const paperNames = [];
  
      try {
        const metadataRef = collection(firestore, `quizzes/${examName}/meta`);
        const papernamesQuery = query(metadataRef, where('__name__', '==', 'papernames'));
        const papernamesSnapshot = await getDocs(papernamesQuery);
  
        papernamesSnapshot.forEach((doc) => {
          const paperNamesData = doc.data();
          if (paperNamesData.papers) {
            paperNames.push(...paperNamesData.papers);
          }
        });
      } catch (error) {
        console.error(`Error getting paper names for ${examName}:`, error);
      }
  
      return paperNames;
    }, [firestore]);
  
    const handleClick = async (examName) => {
      const names = await getPaperNamesForExam(examName.target.value);
      console.log(names);
      setPaperNames(names);
    };
  
   

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
                        {examNames.map((name) => (
                          <li key={name}>
                            <div className="wrapper-buttons active-side">
                              <button onClick={handleClick} value={name} className="btn">{name}</button>
                              <i className="fas fa-chevron-right"></i>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No exams found</p>
                    )}
                  </div>
                </div>
                <div className="col-md-10 col-sm-6">
                <div className="row" id="card-jum">
             
                
                {paperNames.length > 0 ? (
                  <div className="row">
                    {paperNames.map((name, index) => (
                      <div className="col-md-3 col-sm-12" key={index}>
                        <div className="card"><h5 className="mt-5 mx-5">{name}</h5></div>
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