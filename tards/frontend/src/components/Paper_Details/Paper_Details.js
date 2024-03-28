import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
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
  const [subjectNames, setSubjectNames] = useState([]);
  const [detailsData, setDetailsData] = useState(null);
  const [paperNamesWithData, setPaperNamesWithData] = useState([]);
  const [activeExam, setActiveExam] = useState("");



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
        handleClick(fetchedSubjectNames[0]);
        const paperNamesWithDataArray = [];

        for (const subjectName of fetchedSubjectNames) {
          const metadataCollectionRef = collection(
            db,
            `quizzes/${decodedExamName}/subjects/${subjectName}/metadata`
          );
          const metadataSnapshot = await getDocs(metadataCollectionRef);

          for (const metadataDoc of metadataSnapshot.docs) {
            const paperName = metadataDoc.id;
            const paperData = metadataDoc.data();
            paperNamesWithDataArray.push({ paperName, paperData });
          }
        }

        setPaperNamesWithData(paperNamesWithDataArray);
        console.log("Paper names with data:", paperNamesWithDataArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  
 const handleClick = async (examName) => {
  // Find the selected exam object based on the clicked exam name
  const selectedExam = paperNamesWithDataArray.find((exam) => exam.paperName === examName);
  
  if (selectedExam) {
    // Retrieve the paper data associated with the selected exam
    const paperData = selectedExam.paperData;

    setPaperNamesWithData(paperData);
    setActiveExam(examName);
  } else {
    console.error(`Exam '${examName}' not found.`);
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
              <ul className={`${style.sidebar} d-flex justify-content-center align-items-center`}>
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
              <div className="row" >
                {paperNamesWithData && paperNamesWithData.length > 0 ? (
                  <div className="row">
                    {paperNamesWithData.map((paperName, index) => (
                      <div className="col-md-12 col-sm-12" key={index}>
                        <Link>
                          <div className="card">
                            <h4 className="card-title mt-3 mx-2">
                              {paperName.paperName}
                            </h4>
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
        </section>


  
      </div>
    </>
  );
};

export default Paper_Details;
