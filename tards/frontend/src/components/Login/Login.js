import React,{useEffect,useState} from 'react'
import "./Login.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import {auth,provider} from './config';


import { signInWithPopup,onAuthStateChanged } from 'firebase/auth';
function Login() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null);

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      const userData = {
        displayName: data.user.displayName,
        email: data.user.email,
        photoURL: data.user.photoURL, // Profile image URL
      };
      setUser(data.user);
      localStorage.setItem("email", data.user.email);

      // Redirect to Userpanel after successful sign-in
      navigate('/user-panel');
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(auth)
      setUser(user);
      // If the user is logged in, redirect to Userpanel
      if (user) {
        const userData = {
          displayName:user.displayName,
          email: user.email,
          photoURL: user.photoURL, // Profile image URL
        };
        // setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log(userData)
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
              Welcome to Examtards,
              <br />
              Log In to Continue.
            </div>
            <div className="t-6">
              Don’t have an account ? Create an account it takes less than a
              minute
            </div>
            <form id="login">
            <div className="">
              <label htmlFor="email" className="t-7">Email</label>
              <input type="email" id="email" className="div-8" />
            </div>
          
            <div className="form-group">
              <label htmlFor="password" className="t-7">Password</label>
              <input type="password" id="password" className="div-8" />
            </div>
          
            <div className="form-group">
              <a href="#" className="div-11">Forgot Password?</a>
            </div>
          
            <button type="submit" className="sign-in-btn mt-5 d-flex flex-row justify-content-center align-items-center">
              <h6 className="mb-0 ml-2">Sign in</h6>
            </button>
          </form>
          
          <div>
       
         
            <button onClick={handleClick} className="sign-in-btn mt-5 d-flex flex-row justify-content-center align-items-center">
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

export default Login
