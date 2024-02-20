import React,{useEffect,useState,useCallback} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut, sendPasswordResetEmail, onAuthStateChanged} from 'firebase/auth';
import {auth,provider} from '../SignUp/config';
import styles from './Userpanel.module.css';
import star from '../../assets/images/star.svg';
import medal from '../../assets/images/medal.svg';
import fire from '../../assets/images/fire.svg';
import { useDropzone } from 'react-dropzone';

function Userpanel() {


const location = useLocation();
const navigate = useNavigate();
const [email, setEmail] = useState('')
const triggerResetEmail = async (event) => {
  event.preventDefault();
  console.log("the email is ..",email)
  await sendPasswordResetEmail(auth, user.email);
  console.log("Password reset email sent")
  alert("Reset password instructions send on registered email");
}
const [isEditable, setIsEditable] = useState(false);

const handleToggleEdit = () => {
  setIsEditable(!isEditable);
};
const [user, setUser] = useState(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  return () => unsubscribe();
}, []);

// Check if props.location.state is defined before accessing its properties

  const handleLogout = async () => {
    try {
        const auth = getAuth();

        await signOut(auth);

      // Redirect to the login page after logout
    
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };
 
  const StatisticCard = ({ imageSrc, imageAlt, value, description }) => (
    <div className="statistic-card">
      <img src={imageSrc} alt={imageAlt} className="statistic-image" />
      <div className="statistic-content">
        <div className="statistic-value">{value}</div>
        <div className="statistic-description">{description}</div>
      </div>
    </div>
  );
  const statistics = [
    {
      imageSrc: star,
      imageAlt: "Total Points Icon",
      value: "202",
      description: "Total Points",
    },
    {
      imageSrc: fire,
      imageAlt: "Days Streak Icon",
      value: "202",
      description: "Days Streak",
    },
    {
      imageSrc: medal,
      imageAlt: "Current Rank Icon",
      value: "202",
      description: "Current Rank",
    },
  ];


  /*dropzone*/
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);


  const handleImageUpload = (file) => {
    if (file) {
      // Perform image upload logic here
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      return imageUrl; // Return the URL
    }
  };
  const onDrop = useCallback((acceptedFiles) => {
    // Perform image upload logic and update state with the uploaded image URL
    const imageUrl = handleImageUpload(acceptedFiles[0]);
    setImageUrl(imageUrl);
  }, []);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*', // Accept only image files
    maxSize: 10485760, // Maximum file size (in bytes), e.g., 10MB
    multiple: false, // Allow only single file upload
  });
 
  return (
    
    <div className='body'>
 
     
          <div className={styles.div}>
            <div className={styles.div2}>
              <div className={styles.div3}>
                <div className={styles.column}>
                  <div className={styles.div4}>
                    <div className={styles.div5}>YOUR ACCOUNT</div>
                    <div className={styles.div6}>
                      <div className={styles.div7}>
                        <div className={styles.div8}   onClick={handleToggleEdit}>
                          <div className={styles.div9}>user-name</div>
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a97cca9b07ea7a9585c1b060a8c57071f419784a1602003f092919a09e6e3e14?apiKey=de722ffef7e043389cb3e537e0a30338&"
                            className="img"
                          />
                        </div>
                        <div className="user-info">
                        {user ? (
                          <React.Fragment>
                            <h3 className={`username ${isEditable ? styles.editable : ''}`} contentEditable={isEditable} style={{
                            
                              borderBottom: isEditable ? '1px dashed #000' : 'none',
                            }}>
                              {user.displayName.split(' ')[0]}
                            </h3>
                          </React.Fragment>
                        ) : (
                          <p>Loading...</p>
                        )}
                        </div>
                      </div>
                      <div >
                 
                        <div className={styles.div9}>Full name</div>
                        {user ? (
                          <React.Fragment>
                          <h3>
        {user.displayName}
      </h3>
                          </React.Fragment>
                        ) : (
                          <p>Loading...</p>
                        )}
                     
                      </div>
                    </div>
                    <div className={styles.div6}>
                 
                    
                      <div className={styles.div7}>
                        <div className={styles.div8} onClick={triggerResetEmail}>
                          <div className={styles.div9}   >password</div>
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a97cca9b07ea7a9585c1b060a8c57071f419784a1602003f092919a09e6e3e14?apiKey=de722ffef7e043389cb3e537e0a30338&"
                            className="img"
                          />
                        </div>
                        <h3>**********</h3>
                      </div>
                 
              
                    </div>
                    
                    <div className={styles.div6}>
                    <div className={styles.div7}>
                      <div className={styles.div8}>
                        <div className={styles.div9}>Email</div>
                      
                      </div>
                      {user ? (
                        <React.Fragment>
                        <h3>{user.email}</h3>
                        </React.Fragment>
                      ) : (
                        <p>Loading...</p>
                      )}
                
                    </div>
               
                  </div>
     
                    <div className={styles}>
                      <div className={styles.box}>
                        <div className={styles.column2}>
                     
                        {uploadedImage ? (
                          <img src={uploadedImage} alt="Uploaded" className={styles.img2} />
                        ) : (
                          <img
                            loading="lazy"
                            srcSet="https://images.unsplash.com/photo-1605979399824-542335ee35d5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            className={styles.img2}
                          />
                        )}
                        </div>
                          <div className={styles.column3}>
                          <div handleImageUpload={handleImageUpload} />
                          <div className={styles.div2}>
                          <div {...getRootProps()} >
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3fe9e108ca0288b9630020840b2a273568253b320805ffa5c5e0db3bc29aa4?apiKey=de722ffef7e043389cb3e537e0a30338&"
                              className={styles.img3}
                            />
                            
                            <input {...getInputProps()} />
                            <p>Click to upload new user image</p>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div className={styles.column4}>
                  <div className={styles.div2}>
             
                    <div className={styles.div2}>
                      <div className={styles.div2}>
                        <div className={styles.column5}>
                     
                        <h2 className="dashboard-title">Statistics</h2>
                        <div className="statistics-container">
                        <div className="row">
                          {statistics.map((stat, index) => (
                           <StatisticCard key={index} {...stat} />
                          
                          ))}
                          </div>
                        </div>
                        <h3 className="dashboard-section-title">Achievements</h3>
                        <p className="coming-soon">Coming soon ...</p>
                       
                        </div>
                        
       
      <style jsx>{`
      .user-info {
        display: flex;
        flex-direction: column;
      }
      
      .username {
        cursor: pointer;
       
      }
      
      .username:hover {
        background-color: #f0f0f0; /* Change background color on hover to indicate editability */
      }
      .statistics-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 20px;
      }
      
      @media (max-width: 768px) {
        .statistics-container {
          flex-direction: column;
          align-items: center;
        }
        .statistics-container .row {
          display: flex;
          flex-wrap: wrap;
         
          gap: 20px;
        }
        .statistic-card {
          margin-top:1rem;
          width: 100%; 
          margin-left:0!important;
        }
        .coming-soon{
          margin-bottom:4rem;
        }
      }
      
        .dashboard {
          display: flex;
          flex-direction: column;
        }
        .dashboard-title {
          font-size: 45px;
          font-weight: 400;
          line-height: 116%;
          font-family: Comfortaa, -apple-system, Roboto, Helvetica, sans-serif;
          text-align:left;
        }
        
        .statistic-card {
          border-radius: 11px;
          box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.2);
          background-color: #d8e2ff;
          display: flex;
          gap: 15px;
          padding: 9px 35px;
          margin-bottom: 2rem;
          margin-left:20px;
          width: calc(50% - 20px); /* Adjust card width for mobile devices */
          max-width: 300px; /* Set max-width for better responsiveness */
        }
        .statistic-image {
          width: 24px;
          margin: auto 0;
        }
        .statistic-content {
          display: flex;
          flex-direction: column;
        }
        .statistic-value {
          font-size: 28px;
          font-weight: 400;
          line-height: 129%;
          font-family: Roboto, -apple-system, Roboto, Helvetica, sans-serif;
        }
        .statistic-description {
          font-size: 11px;
          font-weight: 500;
          line-height: 145%;
          color: #727272;
        }
        .dashboard-section-title {
          margin-top: 81px;
          font-size: 45px;
          font-weight: 400;
        }
        .coming-soon {
          margin-top: 36px;
          font-size: 16px;
          font-weight: 500;
          
        }
      `}</style>
                     
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
     

    
    
    </div>
  );
}

export default Userpanel;




