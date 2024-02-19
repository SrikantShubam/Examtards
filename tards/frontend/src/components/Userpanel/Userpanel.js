import React,{useEffect,useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import {auth,provider} from '../SignUp/config';
import styles from './Userpanel.module.css';
function Userpanel() {


const location = useLocation();
const navigate = useNavigate();
// const userData = location.state && location.state.userData;

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
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6fa47f0deb18bd06d0f4da7836062838019083e75ba0e03dd94e87e02cb33f29",
      imageAlt: "Total Points Icon",
      value: "202",
      description: "Total Points",
    },
    {
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/434244ec1ce6c5826ee44058e5c66ad58b4f844841718cb134d304748764621d",
      imageAlt: "Days Streak Icon",
      value: "202",
      description: "Days Streak",
    },
    {
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/60ae51fa0354a590c594997e332b4c7540f0d51c5ab0f7c8049d515e09341ea6",
      imageAlt: "Current Rank Icon",
      value: "202",
      description: "Current Rank",
    },
  ];
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
                        <div className={styles.div8}>
                          <div className={styles.div9}>user-name</div>
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a97cca9b07ea7a9585c1b060a8c57071f419784a1602003f092919a09e6e3e14?apiKey=de722ffef7e043389cb3e537e0a30338&"
                            className="img"
                          />
                        </div>
                        <h3>JOE SAYS WHAT</h3>
                      </div>
                      <div >
                        <div className={styles.div9}>Email</div>
                        <h3>joe@gmail.com</h3>
                      </div>
                    </div>
                    <div className={styles.div6}>
                      <div className={styles.div7}>
                        <div className={styles.div8}>
                          <div className={styles.div9}>full name</div>
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a97cca9b07ea7a9585c1b060a8c57071f419784a1602003f092919a09e6e3e14?apiKey=de722ffef7e043389cb3e537e0a30338&"
                            className="img"
                          />
                        </div>
                        <h3>JOE SAYS WHAT</h3>
                      </div>
                      <div >
                        <div className={styles.div9}>password</div>
                        <h3>joe@gmail.com</h3>
                      </div>
                    </div>
                    <div className={styles}>
                      <div className={styles.box}>
                        <div className={styles.column2}>
                          <img
                            loading="lazy"
                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2cc5200b49d0f467fe459a0947852305d7a4ff4abcb7cc3dba8874ccfee4dd16?apiKey=de722ffef7e043389cb3e537e0a30338&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2cc5200b49d0f467fe459a0947852305d7a4ff4abcb7cc3dba8874ccfee4dd16?apiKey=de722ffef7e043389cb3e537e0a30338&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2cc5200b49d0f467fe459a0947852305d7a4ff4abcb7cc3dba8874ccfee4dd16?apiKey=de722ffef7e043389cb3e537e0a30338&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2cc5200b49d0f467fe459a0947852305d7a4ff4abcb7cc3dba8874ccfee4dd16?apiKey=de722ffef7e043389cb3e537e0a30338&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2cc5200b49d0f467fe459a0947852305d7a4ff4abcb7cc3dba8874ccfee4dd16?apiKey=de722ffef7e043389cb3e537e0a30338&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2cc5200b49d0f467fe459a0947852305d7a4ff4abcb7cc3dba8874ccfee4dd16?apiKey=de722ffef7e043389cb3e537e0a30338&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2cc5200b49d0f467fe459a0947852305d7a4ff4abcb7cc3dba8874ccfee4dd16?apiKey=de722ffef7e043389cb3e537e0a30338&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2cc5200b49d0f467fe459a0947852305d7a4ff4abcb7cc3dba8874ccfee4dd16?apiKey=de722ffef7e043389cb3e537e0a30338&"
                            className={styles.img2}
                          />
                        </div>
                          <div className={styles.column3}>
                          <div className={styles.div2}>
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3fe9e108ca0288b9630020840b2a273568253b320805ffa5c5e0db3bc29aa4?apiKey=de722ffef7e043389cb3e537e0a30338&"
                              className={styles.img3}
                            />
                            <div className={styles.div2}>upload new user image</div>
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
                            <div className="col-md-6" key={index}>  <StatisticCard  {...stat} /></div>
                          
                          ))}
                          </div>
                        </div>
                        <h3 className="dashboard-section-title">Achievements</h3>
                        <p className="coming-soon">Coming soon ...</p>
                   
                      
                        </div>
                        
       
      <style jsx>{`
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
          margin-bottom:2rem;
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
                    <div className={styles.div4}>Achievements</div>
                    <div className={styles.div4}>Coming soon ...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
     

    
    
    </div>
  );
}

export default Userpanel;




