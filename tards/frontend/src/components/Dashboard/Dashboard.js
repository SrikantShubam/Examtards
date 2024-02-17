import React,{useEffect,useState} from 'react';
import axios from 'axios';
import './Dashboard.css';
import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import {auth,provider} from '../SignUp/config';
import Popup from '../Popup/Popup';
import { getFirestore, collection, setDoc,getDoc,addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import defaultuser from '../../assets/images/usercute.webp';
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
    const db = getFirestore(); // Get the Firebase Firestore instance
    const userAddedExamsRef = doc(db, 'user-added-exams', user.uid); // Set document ID to user's ID
  
    try {
      // Get the current data of the user's document
      const docSnapshot = await getDoc(userAddedExamsRef);
      const userData = docSnapshot.exists() ? docSnapshot.data() : {};
  
      // Add the new exam to the user's data
      const updatedExams = [...(userData.exams || []), exam];
      
      // Update the user's document with the new data
      await setDoc(userAddedExamsRef, { exams: updatedExams });
      
  
      fetchUserAddedExams();
      console.log('Exam added successfully.');
    } catch (error) {
      console.error('Error adding exam:', error);
    }
  };

  const removeExam = async (userId, indexToRemove) => {
    const db = getFirestore(); // Get the Firebase Firestore instance
    const userAddedExamsRef = doc(db, 'user-added-exams', userId); // Use the userId parameter directly
    
    try {
      // Get the current data of the user's document
      const docSnapshot = await getDoc(userAddedExamsRef);
      const userData = docSnapshot.exists() ? docSnapshot.data() : {};
    
      // Remove the exam at the specified index
      const updatedExams = userData.exams.filter((exam, index) => index !== indexToRemove);
    
      // Update the user's document with the updated data
      await setDoc(userAddedExamsRef, { exams: updatedExams });
    
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
      } catch (error) {
        console.error('Error fetching all exams:', error);
      }
    };
    

    fetchAllExams();

    // Cleanup function
    return () => {
    
    };
  }, [user,allExams]);

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
              <div className="div-15">
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
              <div className="div-22">
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
        <div className="div-13">
        <div className="div-14">
          <div className="your_exams">
            <div className="div-15">
              <div className="div-16">
                <div className="column-4">
                  <div className="div-17">
                    <div className="div-18">Available Exams</div>
                    <p className='mt-3'>
                    2 or 3 hour real mock exams paper . Let the odds be in your favour.
                    </p>
                  </div>
                </div>
              
              </div>
              <div className="row">
              <div className="col-md-9">
              
              <h3>UPSC EXAM</h3>
              <div className="d-flex flex-direction-row">
              <h6>UPSC EXAM</h6>  
               <h6 className='px-1'>UPSC EXAM</h6>
                <h6 className='px-1'>UPSC EXAM</h6>
              </div>
           
            
            
              
              </div>
              <div className="col-md-3">
              <button className="btn btn-primary mx-3">hey</button>
              <button className="btn btn-primary">hey</button>
              </div>
             
          </div>
            </div>
            
          </div>
          <div className="column-6">
          <div className="featured-tests">
          <header className="header">Available Tests</header>
          <p className="description">
            For the fast and the furious! Tests that make you pull your eyes out!
          </p>
          <div className="test-wrapper">
            <div className="test-container">
              <h2 className="test-title">UPSC Prelims Exam SP4</h2>
              <div className="start-button">
                <button className="start-btn">Start</button>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/65cb2edacc184908b2d0b7cb965e37398e29b840ed96897f15be75775102ce11?apiKey=de722ffef7e043389cb3e537e0a30338&"
                  className="test-image"
                  alt="Test Image"
                />
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
     
      </div>
    
      
      </div>
   
      <style jsx>{`

      @media (max-width: 991px) {
        .points {
          font-size: 40px;
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
        .div-15 {
          justify-content: center;
          border-radius: 10px;
          background-color: var(
            --material-theme-sys-light-primary-container,
            #d8e2ff
          );
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
          background-color: var(
            --material-theme-sys-light-on-primary-fixed-variant,
            #004494
          );
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
          background-color: var(
            --material-theme-sys-light-surface-variant,
            #e1e2ec
          );
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
