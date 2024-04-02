import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  Firestore,
} from "firebase/firestore";
import style from "./Paper_Details.module.css";
import { Link } from "react-router-dom";


const Paper_Details = () => {
  const [paperNames, setPaperNames] = useState([]);
  const { examName } = useParams();
  const decodedExamName = decodeURIComponent(examName.replace(/-/g, " "));
  const cleanedExamName = decodedExamName.replace(/ /g, '-');
  const [subjectNames, setSubjectNames] = useState([]);
  const [detailsData, setDetailsData] = useState(null);
  const [paperNamesWithData, setPaperNamesWithData] = useState([]);
  const [activeExam, setActiveExam] = useState("");
  const [paperNamesWithDataArray, setPaperNamesWithDataArray] = useState([]);
  const navigate = useNavigate(); // Add this line to get the history object


  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();

        // Fetch details data
        const detailsCollectionRef = collection(
          db,
          `quizzes/${decodedExamName}/Details`
        );
        const detailsDocRef = doc(detailsCollectionRef, "details");
        const detailsDocSnapshot = await getDoc(detailsDocRef);

        if (detailsDocSnapshot.exists()) {
          const fetchedDetailsData = detailsDocSnapshot.data();
          setDetailsData(fetchedDetailsData);
          console.log("Details data:", fetchedDetailsData);
        } else {
          console.log("No details data found for the specified exam.");
        }

        // Fetch subject names and paper names with data
        const subjectsCollectionRef = collection(
          db,
          `quizzes/${decodedExamName}/subjects`
        );
        const subjectsSnapshot = await getDocs(subjectsCollectionRef);
        const fetchedSubjectNames = subjectsSnapshot.docs.map((doc) => doc.id);
        setSubjectNames(fetchedSubjectNames);
        setActiveExam(fetchedSubjectNames[0]);

        const paperNamesWithDataBySubject = {};

        for (const subjectName of fetchedSubjectNames) {
          const metadataCollectionRef = collection(
            db,
            `quizzes/${decodedExamName}/subjects/${subjectName}/metadata`
          );
          const metadataSnapshot = await getDocs(metadataCollectionRef);
    
          const paperNamesWithDataForSubject = [];
    
          for (const metadataDoc of metadataSnapshot.docs) {
            const paperName = metadataDoc.id;
            const paperData = metadataDoc.data();
            paperNamesWithDataForSubject.push({ paperName, paperData, subjectName });
          }
    
          paperNamesWithDataBySubject[subjectName] = paperNamesWithDataForSubject;
        }
    
        setPaperNamesWithData(paperNamesWithDataBySubject);
        console.log("Paper names with data by subject:", paperNamesWithDataBySubject);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  
  const handleClick = async (subjectName) => {
    console.log("Selected subject:", subjectName);
    setActiveExam(subjectName);
  
    const subjectData = paperNamesWithData[subjectName];
  
    if (Array.isArray(subjectData) && subjectData.length > 0) {
      subjectData.forEach((paper, index) => {
        console.log(`Paper ${index + 1} for ${subjectName}:`);
        console.log('"paperName":', paper.paperName);
        console.log('"paperData":', paper.paperData);
       
      });
    } else {
      console.log(`No data found for the subject: ${subjectName}`);
    }
  };
  

  return (
    <>
      <div className="body">
        <div id={style.examDetails}>
          <div className="row" id={style.main}>
            <div className="col-md-12">
              <h2 className={style.textcolor}> {decodedExamName}</h2>
            </div>

            {detailsData ? (
              <div className="row">
                {Object.entries(detailsData).map(([key, value], index) => (
                  <div className="col-md-6" key={index}>
                    <h5 className="mt-5">
                      {key}: {value}
                    </h5>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-md-6">
                <p>Loading...</p>
              </div>
            )}
          </div>
          <div className={style.textstart}>
            <div id={style.menu}>
              <h2 className="mt-5">
                <span className={style.textcolor}>{decodedExamName}</span>
              </h2>
            </div>
            <div id={style.menu} className="mt-5">
              <h2>
                Select an exam from{" "}
                <span className={style.textcolor}>Subject</span>
              </h2>
            </div>
          </div>
        </div>

        <section id="category" className="mb-5">
          <div className="row mt-5">
            <div className="col-md-2 col-sm-12">
              <div className={`${style.sidebarContainer} `}>
                {subjectNames.length > 0 ? (
                  <ul
                    className={`${style.sidebar} d-flex justify-content-center align-items-center`}
                  >
                    {subjectNames.map((subjectName, index) => (
                      <li
                        className={` ${
                          activeExam === subjectName ? "active-side" : ""
                        }`}
                        key={index}
                      >
                        <div className="wrapper-buttons">
                          <button
                            onClick={() => handleClick(subjectName)}
                            className="btn"
                          >
                            {subjectName}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No exams found</p>
                )}
              </div>
            </div>
            <div className="col-md-7 col-sm-6">
            
  <div className="row">
  {Object.keys(paperNamesWithData).length > 0 ? (
    Object.entries(paperNamesWithData).map(([subjectName, paperNamesData], index) => (
      <div key={index} className="col-md-12">
      
        {activeExam === subjectName ? (
          paperNamesData.length > 0 ? (
            paperNamesData.map((paperData, idx) => (
           
              <div key={idx} className="row">
                <div className="col-md-12 col-sm-12">
                {console.log('paperData  aa gaya  -->>>>:', paperData.paperName)}
              
       
           
              

            <div
            className={style.examBox}
            onClick={() =>
              navigate(`/general-instructions/${encodeURIComponent(paperData.paperName)}`, {
                state: JSON.stringify(paperData.paperData),
              })
            } // Use navigate instead of history.push
          >
                    <div className="row mt-3 py-2 ">
                    <div className="col-md-7 col-sm-12">
                    <h4 className="px-3 py-2  mx-2" style={{color:"#005AC1"}}> Test Name : {paperData.paperName}</h4>
                    </div>
                    <div className="col-md-4 col-sm-12 mx-3 ">
                    <button className={`btn mx-4 ${style.btnGray}`}>Attempt

                    <i className="fas mx-2 fa-chevron-right"></i>
                    </button>
                    </div>
                   
                    
                    </div>
                   
                      <div className="card-body px-3 mx-2" style={{color:"#5C5C5C"}}>
                        {paperData.paperData && paperData.paperData.meta && (
                          <div className="row">
                          <div className="col-md-4 mt-2">
                          <div className="d-flex align-items-center ">
                          <i className="fa-regular fa-clock mx-2"></i>
                        
                          <p className="m-0 ml-2">Total Time: {paperData.paperData.meta.timeAllot/60} hours</p>
                        </div>
                          </div>
                          <div className="col-md-4 mt-2">
                          <div className="d-flex align-items-center ">
                          <i className="fa-regular fa-circle-question mx-2"></i>
                          <p className="m-0 ml-2">Total Questions: {paperData.paperData.meta.totalquestions}</p>
                        </div>
                          </div>
                          <div className="col-md-4 mt-2">
                          <div className="d-flex align-items-center ">
                        
                          <i className="fa-regular fa-circle-check mx-2"></i>
                          <p className="m-0 ml-2">Total Marks: {paperData.paperData.meta.totalmarks}</p>
                        </div>
                          </div>
                          </div>
                        
                        
                        )}
                      </div>
                    </div>
               
                </div>
              </div>
            ))
          ) : (
            <p>No paper names found for this subject.</p>
          )
        ) : null}
      </div>
    ))
    ) : (
      <p>Loading...</p>
    )}
  </div>
</div>
          </div>
        </section>


  
      </div>
    </>
  );
};

export default Paper_Details;
