import React,{useEffect,useState} from 'react'
import "./SignUp.css";
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate

import {auth,provider} from './config';


import { signInWithPopup,onAuthStateChanged,createUserWithEmailAndPassword } from 'firebase/auth';
function SignUp() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null);
  const handleEmailLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      await createUserWithEmailAndPassword(auth, email, password);
      console.log("user created!");
      navigate('/user-panel');
    } catch (error) {
      console.error('Error creating user with email/password:', error.message);
      // Handle error, e.g., show an error message to the user
    }
  };
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider).then((data) => {
  
      navigate('/user-panel');
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      setUser(user);
      // If the user is logged in, redirect to Userpanel
      if (user) {
      
      

        navigate('/user-panel');
        ;
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  
  return (
    <>
    <div className="body">
    <div className="main-container">
    <div className="inside-main-container">
      <div className="inside-main-container-2">
        <div className="column-1">
          <img
            loading="lazy"
            srcSet="https://images.unsplash.com/photo-1600195077077-7c815f540a3d?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="cover-img" alt="Login "
          />
        </div>
        <div className="column-2">
          <div className="main-text-content">
            <div className="t-5">
            SignUp to ExamTards.
              <br />
           And start up your exam journey!
            </div>
            <div className="t-6">
           Already have an account ? <Link to='/login'>Login Now</Link>
            </div>
            <form id="login" onSubmit={handleEmailLogin}>
            <div className="">
              <label htmlFor="email" className="t-7">Email</label>
              <input type="email" id="email" className="div-8" />
            </div>
          
            <div className="form-group">
              <label htmlFor="password" className="t-7">Password</label>
              <input type="password" id="password" className="div-8" />
            </div>
          
            <div className="form-group">
              <Link to="" className="div-11">Forgot Password?</Link>
            </div>
          
            <button type="submit"   className="sign-in-btn mt-5 d-flex flex-row justify-content-center align-items-center">
              <h6 className="mb-0 ml-2">Sign in</h6>
            </button>
          </form>
          
          <div>
       
         
            <button onClick={handleGoogleLogin} className="sign-in-btn mt-5 d-flex flex-row justify-content-center align-items-center">
              <img
                alt='login now'
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a48a278fb47efc62f61c941d3cbb6457594925619df61568b3ff3a22fc527367?"
                className="img-fluid"
              />
              <h6 className="mb-0 ml-2">Sign in with Google</h6>
            </button>
    
       
        </div>
        
          
          </div>
        </div>
      </div>
    </div>
  </div>
  
    </div>
     
    </>
  )
}

export default SignUp
