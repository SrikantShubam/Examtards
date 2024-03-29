import React,{useEffect,useState} from 'react';
import axios from 'axios';
import './Dashboard.css';
import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import {auth,provider} from '../SignUp/config';
import Popup from '../Popup/Popup';
import { getFirestore, collection, setDoc,getDoc,collectionGroup,addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';



import defaultuser from '../../assets/images/usercute.webp';
/*exam add */
import quizData from '../../../src/exams/results.json';

function Dashboard(props) {

  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userAddedExams, setUserAddedExams] = useState([]);

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase authentication instance
  
    // Listener for authentication state changes.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
  
   
  }, [user]); 

 
  const addQuizToFirestore = async () => {
    try {
      const db = getFirestore();
      const examName = 'CUET UG';
      const subjectName = 'General Compulsory';
      const paperName = 'CUET_UG_102';
  
      const examRef = doc(collection(db, 'quizzes'), examName);
      const subjectRef = doc(collection(examRef, 'subjects'), subjectName);
  
      // Store metadata
      const metadataRef = doc(collection(subjectRef, 'metadata'), paperName);
      await setDoc(metadataRef, { meta: quizData.meta[0] });
  
      // Store questions as separate sets/batches
      const questionsRef = collection(subjectRef, 'questions', paperName, 'sets');
      const numSets = 5; // Divide questions into 5 sets
      const questionsPerSet = Math.ceil(quizData.questions.length / numSets);
  
      for (let i = 0; i < numSets; i++) {
        const startIndex = i * questionsPerSet;
        const endIndex = startIndex + questionsPerSet - 1;
        const setQuestions = quizData.questions.slice(startIndex, endIndex + 1);
  
        const setRef = doc(questionsRef);
        await setDoc(setRef, { questions: setQuestions });
      }
  
      console.log('Quiz data added to Firestore successfully!');
    } catch (error) {
      console.error('Error adding quiz data to Firestore: ', error);
    }
  };
  useEffect(() => {
    // addQuizToFirestore();
  }, []);
 

  const fetchUserAddedExams = async () => {
    if (!user) {
      console.log("user not set shit!")
     
    }
    const db = getFirestore(); 
    const userAddedExamsRef = collection(db, 'user-added-exams');
    const q = query(userAddedExamsRef, where('userId', '==', user.uid));

    try {
      const querySnapshot = await getDocs(q);
      const exams = [];
      querySnapshot.forEach((doc) => {
       
        exams.push({ id: doc.id, ...doc.data() });
      });
      setUserAddedExams(exams);
    } catch (error) {
      console.error('Error fetching user-added exams:', error);
    }
  };
  const addExam = async (exam) => {
    const db = getFirestore();
    const userAddedExamsRef = doc(db, 'user-added-exams', user.uid);
  
    try {
      const docSnapshot = await getDoc(userAddedExamsRef);
      const userData = docSnapshot.exists() ? docSnapshot.data() : {};
  
      const updatedExams = [...(userData.exams || []), exam];
      
      await setDoc(userAddedExamsRef, { exams: updatedExams });
  
      // Update state immediately after adding the exam
      setAllExams(updatedExams);
  
      console.log('Exam added successfully.');
    } catch (error) {
      console.error('Error adding exam:', error);
    }
  };

  const removeExam = async (userId, indexToRemove) => {
    const db = getFirestore();
    const userAddedExamsRef = doc(db, 'user-added-exams', userId);
    
    try {
      const docSnapshot = await getDoc(userAddedExamsRef);
      const userData = docSnapshot.exists() ? docSnapshot.data() : {};
    
      const updatedExams = userData.exams.filter((exam, index) => index !== indexToRemove);
    
      await setDoc(userAddedExamsRef, { exams: updatedExams });
    
      // Update state immediately after removing the exam
      setAllExams(updatedExams);
    
      console.log('Exam removed successfully.');
    } catch (error) {
      console.error('Error removing exam:', error);
    }
  };
  





  /*---------search for the exam  */
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:8000/search/?search_query=${searchQuery}`);
      setSearchResults(response.data);
      setShowPopup(true); 
      document.body.classList.add('popup-open');
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    document.body.classList.remove('popup-open');
  };
  const [allExams, setAllExams] = useState([]);
  const curr_user = auth.currentUser;
  useEffect(() => {
    const fetchAllExams = async () => {
      if (!user) return; // Exit if user is not logged in
  
      const db = getFirestore();
      const userExamsRef = doc(db, 'user-added-exams', user.uid); // Assuming 'user-added-exams' is the collection where user-added exams are stored
  
      try {
        const userExamsSnapshot = await getDoc(userExamsRef);
        if (!userExamsSnapshot.exists()) {
          setAllExams([]); // If the document doesn't exist, set allExams to an empty array
          return;
        }
  
        const examsData = userExamsSnapshot.data().exams || [];
        setAllExams(examsData);
        // console.log('Total read operations fetched:', examsData.length);
      } catch (error) {
        console.error('Error fetching all exams:', error);
      }
    };
  
    fetchAllExams();
  
    // No dependencies here, so this effect will only run once after the initial render
  }, [user]);
  

/*---------------countdown------------ */
const calculateCountdown = (examDate) => {
  const now = new Date();
  const examDateTime = new Date(examDate);
  const diffMs = examDateTime - now;

  // Calculate days, hours, and minutes
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
};


/*------fetch exam-data-------*/

const [paperNames, setPaperNames] = useState({});
const [isLoading, setIsLoading] = useState(false);
useEffect(() => {
  // Fetch paper names for all exams after initial render
  fetchAllPaperNames();
 
}, [allExams]);

const fetchAllPaperNames = async () => {
  try {
    setIsLoading(true);
    const updatedPaperNames = { ...paperNames };

    for (const exam of allExams) {
      // Only fetch paper names if not already fetched
      if (!updatedPaperNames[exam.name]) {
        const names = await fetchSubcollectionNames(exam.name);
        updatedPaperNames[exam.name] = names;
      }
    }

    setPaperNames(updatedPaperNames);
  } catch (error) {
    console.error('Error fetching paper names:', error);
  } finally {
    setIsLoading(false);
  }
};


const fetchSubcollectionNames = async (examName) => {
  try {
    const firestore = getFirestore();
    const subjectsRef = collection(firestore, 'quizzes', examName, 'subjects');

    const subjectsSnapshot = await getDocs(subjectsRef);
    if (subjectsSnapshot.empty) {
      console.log(`No subjects found for the exam "${examName}".`);
      return [];
    }

    const subcollectionNames = [];

    for (const subjectDoc of subjectsSnapshot.docs) {
      const subcollectionsRef = collection(subjectDoc.ref, 'questions').withConverter({
        fromFirestore: (snapshot) => snapshot.id,
        toFirestore: (name) => firestore.FieldValue.serverTimestamp(),
      });

      const subcollectionsSnapshot = await getDocs(subcollectionsRef);
      subcollectionsSnapshot.forEach((subcollectionDoc) => {
        subcollectionNames.push(subcollectionDoc.id);
      });
    }

    return subcollectionNames;
  } catch (error) {
    console.error('Error fetching subcollection names:', error);
    return [];
  }
};



/* tags for the status of exams */




const userCreatedExamStuff = async (exam) => {
  const db = getFirestore();
  const userAddedExamsRef = doc(db, 'user-created-exams', user.uid);
  const userAttemptedExamsRef = collection(db, 'user-attempted-exams', user.uid, 'exams-attempted');

  try {
    const docSnapshot = await getDoc(userAddedExamsRef);
    const userData = docSnapshot.exists() ? docSnapshot.data() : {};

    const updatedExams = [...(userData.exams || []), exam];

    // Add the exam to the user-created-exams collection
    await setDoc(userAddedExamsRef, { exams: updatedExams });

    // Add the exam to the exams-attempted subcollection with a default status of false
    const examAttemptedRef = doc(userAttemptedExamsRef, exam.name);
    await setDoc(examAttemptedRef, { status: false });

    // Update state immediately after adding the exam
    setAllExams(updatedExams);

    console.log('Exam added successfully.');
  } catch (error) {
    console.error('Error adding exam:', error);
  }
};


const fetchExamAttemptStatus = async (examName) => {
  const db = getFirestore();
  const userAttemptedExamsRef = collection(db, 'user-attempted-exams', user.uid, 'exams-attempted');
  const examAttemptedRef = doc(userAttemptedExamsRef, examName);

  try {
    const examAttemptDoc = await getDoc(examAttemptedRef);
    if (examAttemptDoc.exists()) {
      const { status } = examAttemptDoc.data();
      return status;
    }
  } catch (error) {
    console.error('Error fetching exam attempt status:', error);
  }

  // If no status found, return false as the default
  return false;
};

const [examAttemptStatus, setExamAttemptStatus] = useState({});

useEffect(() => {
  const fetchStatusForExams = async () => {
    const statusObj = {};
    for (const exam of allExams) {
      for (const paperName of paperNames[exam.name] || []) {
        const status = await fetchExamAttemptStatus(paperName);
        statusObj[paperName] = status;
      }
    }
    setExamAttemptStatus(statusObj);
  };

  fetchStatusForExams();
  console.log('damn')
}, [allExams, paperNames]);





/* fetch quiz  */

const fetchSubjectNames = async (examName) => {
  try {
    const firestore = getFirestore();
    const subjectsRef = collection(firestore, 'quizzes', examName, 'subjects');

    const subjectsSnapshot = await getDocs(subjectsRef);
    if (subjectsSnapshot.empty) {
      console.log(`No subjects found for the exam "${examName}".`);
      return [];
    }

    const subjectNames = [];

    for (const subjectDoc of subjectsSnapshot.docs) {
      const subjectData = subjectDoc.data();
      const subjectName = subjectData.name || subjectDoc.id; // Use the 'name' field or the document ID as the subject name
      subjectNames.push(subjectName);
    }

    return subjectNames;
  } catch (error) {
    console.error('Error fetching subject names:', error);
    return [];
  }
};

const [subjectNames, setSubjectNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (allExams.length > 0) {
        const firstExamName = allExams[0].name;
        const fetchedSubjectNames = await fetchSubjectNames(firstExamName);
        setSubjectNames(fetchedSubjectNames);
      }
    };

    fetchData();
  }, [allExams]);

  
 
  return (
    <>
   
      <div className="body mb-5">
        <div className="user-wrapper">
          
            <div className="div-4">
              <div className="column">
              {user ? (
                <React.Fragment>
                <img
                alt='user-profile'
                  loading="lazy"
                  srcSet={user.photoURL || defaultuser}
                  className="img"
                />
                </React.Fragment>
              ) : (
                <p>Loading...</p>
              )}
            
              </div>
              <div className="column-2">
                <div className="div-5">
                {user ? (
                    <React.Fragment>
                    <div className="div-6">Hello ,{user.displayName.split(' ')[0]} !</div>
                    </React.Fragment>
                  ) : (
                    <p>Loading...</p>
                  )}
                  
                  <div className="div-7">
                    Hey why don’t you give some of our exams a try !
                  </div>
                </div>
              </div>
            </div>
         
            <div className="main-container-points">
      <header className="header">🏆</header>
      <div className="total-points">
        <h3 className="points">155</h3>
        <h2 className="description">Total Points</h2>
      </div>
    </div>
        </div>
        <div className="div-13">
          <div className="div-14">
            <div id="your_exams">
              <div className="div-15 g1">
                <div className="div-16">
            
                <div className="div-17">
                <div className="div-18">Your exams</div>
           
         
                {allExams.length > 0 ? (
                  allExams.map((exam, index) => (
                      <div className="refined-content my-4" key={index}>
                          <div className="row">
                              {/* Exam Name Section */}
                              <div className="col-lg-6">
                                  <h2 className='text-start'>{exam.name}</h2>
                                  <div className="d-flex my-4">
                                      <button className="btn-view-more">
                                          <Link to={`/exam-detail/${encodeURIComponent(exam.name.replace(/\s/g, '-'))}`} className="view-more">
                                              View More
                                          </Link>
                                          <i className="fa-solid fa-chevron-right"></i>
                                      </button>
                                      <button className="btn-view-more btn-danger mx-2" onClick={() => removeExam(user.uid,index)}>
                                          Remove
                                      </button>
                                  </div>
                              </div>
                              
                              {/* Countdown Boxes Section */}
                              <div className="col-lg-6">
                                  <div className="row">
                                      <div className="col-4 col-md-4">
                                          <div className="box">{calculateCountdown(exam.exam_date).days}</div>
                                          <h4 className='mt-2 text-center'>days</h4>
                                      </div>
                                      <div className="col-4 col-md-4">
                                          <div className="box">{calculateCountdown(exam.exam_date).hours}</div>
                                          <h4 className='mt-2 text-center'>hours</h4>
                                      </div>
                                      <div className="col-4 col-md-4">
                                          <div className="box">{calculateCountdown(exam.exam_date).minutes}</div>
                                          <h4 className='mt-2 text-center'>minutes</h4>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="div-19">
                      Uh oh! You have not added in any exams
                  </div>
              )}
              
        
                {allExams.length < 2 ? (
                  <form action="/search" method="GET" className="search-form" onSubmit={handleSearch}>
                      <div className="input-group">
                          <div className="input-group-prepend">
                              <span className="input-group-text">
                                  <i className="fas fa-search"></i>
                              </span>
                          </div>
                          <input
                              type="text"
                              className="form-control"
                              placeholder="Search for your exam"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                          />
                      </div>
                  </form>
              ) : null}
              
            </div>
            
                  
              
            
                 
                </div>
              </div>
            </div>
            <div className="column-6">
              <div className="div-22 g2">
                <div className="div-23">Your Ranking</div>
                <div className="div-24">
                  <div className="div-25">Rank</div>
                  <div className="div-26">Category</div>
                </div>
                <div className="div-27">
                  <li className="div-28">257</li>
                  <li className="div-29">Medical</li>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showPopup && (
          <Popup searchResults={searchResults} closePopup={closePopup}  showButtons={true} addExam={addExam}/>
        )}   
      
        <div className="user-wrapper">
          
        <div className="div-4">
       
       
        </div>
     
  
    </div>
    <div className="div-13">
      <div className="div-14">
        <div id="your_exams">
          <div className="div-15 g2">
            <div className="div-16">
        
            <div className="div-17">
            <div className="div-18">Available Exams</div>
       
     
      
              <p className='mt-3 '>
              2 or 3 hour real mock exams paper . Let the odds be in your favour !
              </p>
              {isLoading ? (
                <p>Loading...</p>
              ) : allExams.length > 0 ? (
         
                <div>
                {allExams.map((exam, index) => (
                  <div className="refined-content my-4" key={index}>
                    <div className="row align-items-center">
                      {/* Exam Name Section */}
                      <div className="col-12 d-flex align-items-center">
                        {/* Get paperName values */}
                        <div className="flex-grow-1">
                          {paperNames[exam.name] ? (
                            <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                              {paperNames[exam.name].map((paperName, idx) => (
                                <div key={idx}>
                                  <div className="d-flex justify-content-between">
                                    <h3>{paperName}</h3>
                                    <button className="btn btn-gray">Attempt <i className="fas mx-2 fa-chevron-right"></i></button>
                                  </div>
                                  {examAttemptStatus[paperName] === true ? (
                                    <button className="btn mt-1 btn-success" style={{ borderRadius: '50px', border: 'none' }}>
                                      Attempted
                                    </button>
                                  ) : examAttemptStatus[paperName] === false ? (
                                    <button className="btn mt-1 btn-danger" style={{ borderRadius: '50px', border: 'none' }}>
                                      Not Attempted
                                    </button>
                                  ) : (
                                    <button className="btn mt-1 btn-warning" style={{ borderRadius: '50px', border: 'none' }}>
                                      Attempt Pending
                                    </button>
                                  )}
                                </div>
                              ))}
                            </ul>
                          ) : (
                            <p>Sorry we currently don't have any exam for {exam.name}. See all exams to find more exams.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                </div>
              ) : (
                <h5 className='mt-3'>Add an exam in the 'Your exams' section to see related exams</h5>
              )}
              
              
            <div className="row">
              <div className="col-7"> <Link to='/all-exams'>  <button className=" exam-btn mt-3 mb-5">View All Exams </button> </Link> </div>
            </div>
          
            
          
        </div>
        
              
          
        
             
            </div>
          </div>
        </div>
        <div className="column-6">
          <div className="div-22 g1">
            <div className="div-23">Available Quizzes</div>
            <p className='mt-3 '>
            For the fast and the furious ! Tests that make you pull your eyes out!
              </p>
              
              {isLoading ? (
                <p>Loading...</p>
              ) : allExams.length > 0 ? (
                <div>
                  {allExams.map((exam, index) => (
                    <div key={index}>
                 
                      <div>
                  
                        
                          {subjectNames.map((subjectName, idx) => (
                            <div className='d-flex justify-content-between align-items-center'>
                            <h5 className="mt-2" key={idx}>{subjectName}</h5>
                            <button className="btn btn-gray">Attempt <i className="fas mx-2 fa-chevron-right"></i></button>
                          </div>
                            ))}
                      
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <h5 className='mt-3'>
                  Add an exam in the 'Your exams' section to see related exams
                </h5>)}
                <div className="row mt-5">
                <div className="col-7">
                <button className=" exam-btn mt-5 mb-5">Take Random Quiz </button>
                </div>
                </div>
               
          </div>
        </div>
      </div>
    </div>
      
      </div>
   
      <style jsx>{`
      .btn-gray{
        border-radius: 30px;
        -webkit-box-shadow: 0px 6px 30px rgba(0, 0, 0, 0.3); /* Adjusted box shadow with opacity */
        -moz-box-shadow: 0px 6px 30px rgba(0, 0, 0, 0.3);
        padding: 10px 20px; 
        background: #ffffff;
        color:black;
      }
      .exam-btn {
        border:none;
        -webkit-border-radius: 30;
        -moz-border-radius: 30;
        border-radius: 30px;
        -webkit-box-shadow: 0px 6px 30px rgba(0, 0, 0, 0.3); /* Adjusted box shadow with opacity */
        -moz-box-shadow: 0px 6px 30px rgba(0, 0, 0, 0.3);
        box-shadow: 0px 6px 30px rgba(0, 0, 0, 0.3)
        font-family: 'Roboto';
        color: #000000;
        font-size: 24px;
        background: #ffffff;
        padding: 10px 20px; 
        text-decoration: none;
      }
      
      .exam-btn:hover,.btn-gray:hover {
        background: #001a41;
        text-decoration: none;
        color: white;
      }
      
      @media (max-width: 991px) {
        .points {
          font-size: 40px;
        }
        .exam-btn{
          font-size: 18px;
          padding: 8px 16px; 
        }
      }
      
     
      
    
        .dash-container {
          justify-content: center;
          align-items: center;
          background-color: #fff;
          display: flex;
          flex-direction: column;
       
        }
        @media (max-width: 991px) {
          .dash-container {
            padding: 0 20px;
          }
          .user-wrapper {
            max-width: 100%;
            flex-wrap: wrap;
            flex-direction:row;
          }
        }
        .user-wrapper {
          justify-content: space-between;
          display: flex;
          margin-top: 14px;
          width: 100%;
      
          gap: 20px;
        }
        @media (max-width: 991px) {
         
        }
      
      
        .div-4 {
        
          display: flex;
        }
        @media (max-width: 991px) {
          .div-4 {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
            width:60%;
          }
        }
        .column {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 20%;
          margin-left: 0px;
        }
        @media (max-width: 991px) {
          .column {
            width: 100%;
          }
        }
        .img {
          aspect-ratio: 0.91;
          object-fit: auto;
          object-position: center;
          width: 120px;
          max-width: 100%;
          flex-grow: 1;
          border-radius:14px;
        }
        @media (max-width: 991px) {
          .img {
            margin-top: 33px;
          }
        }
        .column-2 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 75%;
          margin-left: 20px;
        }
        @media (max-width: 991px) {
          .column-2 {
       
            margin-left:0;
          }
        }
        .div-5 {
          display: flex;
          flex-direction: column;
          color: var(--material-theme-black, #000);
          font-weight: 400;
        }
        @media (max-width: 991px) {
          .div-5 {
            margin-top: 33px;
          }
        }
        .div-6 {
          white-space: nowrap;
          font: 45px/116% Comfortaa, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        @media (max-width: 991px) {
          .div-6 {
            font-size: 24px;
            font-weight:800;
            white-space: initial;
          }
          .div-7{
            font-size: 20px;
          }
        }
        .div-7 {
          margin-top: 11px;
          font: 24px/32px Roboto, sans-serif;
        }
        @media (max-width: 991px) {.div-7{
          font-size: 16px;
          line-height:21px;
          font-weight:bold;
        }
      }
        .div-8 {
          display: flex;
          gap: 7px;
          margin: auto 0;
        }
        .div-9 {
          color: #000;
          text-align: center;
          align-self: start;
          flex-grow: 1;
          font: 500 43px/143% Roboto, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        .div-10 {
          display: flex;
          flex-grow: 1;
          flex-basis: 0%;
          flex-direction: column;
          color: var(--material-theme-black, #000);
        }
        .div-11 {
          align-self: center;
          font: 400 45px/116% Comfortaa, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        @media (max-width: 991px) {
          .div-11 {
            font-size: 40px;
          }
        }
        .div-12 {
          text-align: center;
          white-space: nowrap;
          font: 500 14px/143% Roboto, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        @media (max-width: 991px) {
          .div-12 {
            white-space: initial;
          }
        }
        .div-13 {
          margin-top: 74px;
          width: 100%;
       
        }
        @media (max-width: 991px) {
          .div-13 {
            max-width: 100%;
            margin-top: 40px;
          }
        }
        .div-14 {
          gap: 20px;
          display: flex;
        }
        @media (max-width: 991px) {
          .div-14 {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
        #your_exams .search-form .input-group{
          width:100%;
        } 
        #your_exams {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 60%;
          margin-left: 0px;
        }
        @media (max-width: 991px) {
          #your_exams {
            width: 100%;
          }
        }
        :root {
          --material-theme-sys-light-primary-container: #d8e2ff;
          
        
          --material-theme-sys-light-surface-variant:#e1e2ec;
          )
         
        }
        .g1{
          background-color:var(--material-theme-sys-light-primary-container);
        }
        .g2{
          background-color:var(--material-theme-sys-light-surface-variant);
        }
        .div-15 {
          justify-content: center;
          border-radius: 10px;
      
          flex-grow: 1;
          width: 100%;
          padding: 40px ;
        }
        @media (max-width: 991px) {
          .div-15 {
            max-width: 100%;
            margin-top: 40px;
            padding: 0 20px;
          }
        }
        .div-16 {
          gap: 20px;
          display: flex;
        }
        @media (max-width: 991px) {
          .div-16 {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
        .column-4 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 61%;
          margin-left: 0px;
        }
        @media (max-width: 991px) {
          .column-4 {
            width: 100%;
          }
        }
        .div-17 {
          display: flex;
          flex-grow: 1;
          flex-direction: column;
          color: #000;
          font-weight: 400;
        }
        @media (max-width: 991px) {
          .div-17 {
            margin-top: 40px;
          }
        }
        .div-18 {
          font: 28px/129% Roboto, sans-serif;
        }
        .div-19 {
          margin-top: 50px;
          font: 24px/32px Roboto, sans-serif;
        }
        @media (max-width: 991px) {
          .div-19 {
            margin-top: 40px;
          }
        }
        .column-5 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 39%;
          margin-left: 20px;
        }
        @media (max-width: 991px) {
          .column-5 {
            width: 100%;
          }
        }
        .div-20 {
          border-radius: 15px;
          background-color: ;
          display: flex;
          margin-top: 114px;
          flex-grow: 1;
          gap: 15px;
          font-size: 14px;
          color: #fff;
          font-weight: 500;
          white-space: nowrap;
          line-height: 143%;
          width: 100%;
          padding: 5px 7px;
        }
        @media (max-width: 991px) {
          .div-20 {
            margin-top: 40px;
            white-space: initial;
          }
        }
        .img-2 {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 26px;
        }
        .div-21 {
          font-family: Roboto, sans-serif;
          flex-grow: 1;
          margin: auto 0;
        }
        @media (max-width: 991px) {
          .div-21 {
            white-space: initial;
          }
        }
        .column-6 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 40%;
          margin-left: 20px;
        }
        @media (max-width: 991px) {
          .column-6 {
            width: 100%;
          }
        }
        .div-22 {
          border-radius: 10px;
        
          display: flex;
          width: 100%;
          flex-grow: 1;
          flex-direction: column;
          color: #000;
          font-weight: 400;
          margin: 0 auto;
          padding: 40px;
        }
        @media (max-width: 991px) {
          .div-22 {
            margin-top: 40px;
            padding: 0 20px;
          }
        }
        .div-23 {
          font: 28px/129% Roboto, sans-serif;
        }
        .div-24 {
          display: flex;
          margin-top: 17px;
          justify-content: space-between;
          gap: 20px;
          white-space: nowrap;
        }
        @media (max-width: 991px) {
          .div-24 {
            white-space: initial;
          }
        }
        .div-25 {
          font: 24px/133% Roboto, sans-serif;
        }
        .div-26 {
          font: 22px/127% Roboto, sans-serif;
        }
        .div-27 {
          display: flex;
          margin-top: 17px;
          justify-content: space-between;
          gap: 20px;
          white-space: nowrap;
        }
        @media (max-width: 991px) {
          .div-27 {
            white-space: initial;
          }
        }
        .div-28 {
          font: 24px/133% Roboto, sans-serif;
        }
        .div-29 {
          font: 22px/127% Roboto, sans-serif;
        }
        .div-30 {
          margin-top: 74px;
          width: 100%;
      
        }
        @media (max-width: 991px) {
          .div-30 {
            max-width: 100%;
            margin-top: 40px;
          }
        }
        .div-31 {
          gap: 20px;
          display: flex;
        }
        @media (max-width: 991px) {
          .div-31 {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
        .column-7 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 63%;
          margin-left: 0px;
        }
        @media (max-width: 991px) {
          .column-7 {
            width: 100%;
          }
        }
        .div-32 {
          align-items: start;
          border-radius: 10px;
          background-color: var(
            --material-theme-sys-light-surface-variant,
            #e1e2ec
          );
          display: flex;
          flex-direction: column;
          align-self: stretch;
          width: 100%;
          margin: auto 0;
          padding: 40px 20px;
        }
        @media (max-width: 991px) {
          .div-32 {
            max-width: 100%;
            margin-top: 40px;
          }
        }
        .div-33 {
          color: #000;
          white-space: nowrap;
          font: 400 28px/129% Roboto, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        @media (max-width: 991px) {
          .div-33 {
            white-space: initial;
          }
          .main-container-points{
            margin-top:33px;
          }
        }
        .div-34 {
          color: #000;
          margin-top: 4px;
          width: 249px;
          font: 400 14px/20px Roboto, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        .div-35 {
          align-self: stretch;
          display: flex;
          margin-top: 20px;
          justify-content: space-between;
          gap: 9px;
          white-space: nowrap;
        }
        @media (max-width: 991px) {
          .div-35 {
            max-width: 100%;
            flex-wrap: wrap;
            white-space: initial;
          }
        }
        .div-36 {
          display: flex;
          flex-grow: 1;
          flex-basis: 0%;
          flex-direction: column;
        }
        @media (max-width: 991px) {
          .div-36 {
            white-space: initial;
          }
        }
        .div-37 {
          color: #000;
          font: 400 24px/133% Roboto, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        @media (max-width: 991px) {
          .div-37 {
            white-space: initial;
          }
        }
        .div-38 {
          justify-content: center;
          border-radius: 30px;
          background-color: var(--Yellow, #f2c94c);
          align-self: start;
          color: var(--material-theme-black, #000);
          text-align: center;
          padding: 6px 12px;
          font: 500 11px/145% Roboto, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        @media (max-width: 991px) {
          .div-38 {
            white-space: initial;
          }
        }
        .div-39 {
          align-self: start;
          display: flex;
          gap: 9px;
          font-size: 16px;
          color: #000;
          font-weight: 400;
          text-align: center;
          line-height: 150%;
        }
        @media (max-width: 991px) {
          .div-39 {
            white-space: initial;
          }
        }
        .div-40 {
          border-radius: 30px;
          background-color: var(
            --material-theme-sys-light-surface-container-lowest,
            #fff
          );
          display: flex;
          justify-content: space-between;
          gap: 0px;
          padding: 5px 11px;
        }
        @media (max-width: 991px) {
          .div-40 {
            white-space: initial;
          }
        }
        .div-41 {
          font-family: Roboto, sans-serif;
          flex-grow: 1;
        }
        .img-3 {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 24px;
        }
        .div-42 {
          border-radius: 30px;
          background-color: var(
            --material-theme-sys-light-surface-container-lowest,
            #fff
          );
          display: flex;
          justify-content: space-between;
          gap: 0px;
          padding: 5px 9px;
        }
        @media (max-width: 991px) {
          .div-42 {
            white-space: initial;
          }
        }
        .div-43 {
          font-family: Roboto, sans-serif;
          flex-grow: 1;
        }
        @media (max-width: 991px) {
          .div-43 {
            white-space: initial;
          }
        }
        .img-4 {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 24px;
        }
        .column-8 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 37%;
          margin-left: 20px;
        }
        @media (max-width: 991px) {
          .column-8 {
            width: 100%;
          }
        }
        .div-44 {
          border-radius: 10px;
          background-color: var(
            --material-theme-sys-light-primary-container,
            #d8e2ff
          );
          display: flex;
          width: 100%;
          flex-grow: 1;
          flex-direction: column;
          color: #000;
          font-weight: 400;
          margin: 0 auto;
          padding: 50px 25px;
        }
        @media (max-width: 991px) {
          .div-44 {
            margin-top: 40px;
            padding: 0 20px;
          }
        }
        .div-45 {
          font: 28px/129% Roboto, sans-serif;
        }
        .div-46 {
          margin-top: 17px;
          font: 14px/20px Roboto, sans-serif;
        }
        .div-47 {
          display: flex;
          margin-top: 32px;
          justify-content: space-between;
          gap: 20px;
        }
        .div-48 {
          font: 24px/32px Roboto, sans-serif;
        }
        .div-49 {
          border-radius: 30px;
          background-color: var(
            --material-theme-sys-light-surface-container-lowest,
            #fff
          );
          display: flex;
          gap: 0px;
          font-size: 16px;
          white-space: nowrap;
          text-align: center;
          line-height: 150%;
          margin: auto 0;
          padding: 5px 11px;
        }
        @media (max-width: 991px) {
          .div-49 {
            white-space: initial;
          }
        }
        .div-50 {
          font-family: Roboto, sans-serif;
          flex-grow: 1;
          margin: auto 0;
        }
        .img-5 {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 24px;
        }
      `}</style>
    </>
  );
}




export default Dashboard
