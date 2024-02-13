import React,{useEffect,useState} from 'react'
import "./Login.css";
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate

import {auth,provider} from '../SignUp/config';


import { signInWithPopup,onAuthStateChanged,signInWithEmailAndPassword  } from 'firebase/auth';
function Login() {
  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState('');

  const [user, setUser] = useState(null);
  const handleEmailLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      await signInWithEmailAndPassword (auth, email, password);
      console.log("user created!");
      navigate('/user-panel');
    } catch (error) {
      console.error('Error', error.message);
      setErrorMessage('Invalid email or password. Please try again.');

      // Handle error, e.g., show an error message to the user
    }
  };
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider).then((data) => {
  
      navigate('/dashboard');
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      setUser(user);
      // If the user is logged in, redirect to Userpanel
      if (user) {
      
      

        navigate('/dashboard');
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
            srcSet="https://images.unsplash.com/photo-1567168539593-59673ababaae?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
           minute.<Link to="/sign-up">Sign Up for free</Link>
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
              <Link to="/forgot-password" className="div-11">Forgot Password?</Link>
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
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}
          
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
