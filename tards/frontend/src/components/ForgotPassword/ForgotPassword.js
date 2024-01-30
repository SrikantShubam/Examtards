import React,{useEffect,useState} from 'react'

import { Link ,useNavigate} from 'react-router-dom'; // Import useNavigate
import './ForgotPassword.css';
import { getAuth, sendPasswordResetEmail ,signInWithPopup,onAuthStateChanged} from "firebase/auth";
import {auth,provider} from '../SignUp/config';
function ForgotPassword() {
  
  const auth = getAuth();
  const navigate = useNavigate(); 
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider).then((data) => {
  
      navigate('/user-panel');
    });
  };
  const [email, setEmail] = useState('')


  const triggerResetEmail = async (event) => {
    event.preventDefault();
    console.log("the email is ..",email)
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent")
  }
  return (
    <div>
    <div className="body">
    <div className="main-container">
    <div className="inside-main-container">
      <div className="inside-main-container-2">
      <div className="column-2">
      <div className="main-text-content">
        <h1 >
      Forgot Password?
        </h1>
        <h3>
        Enter your email id you used while signing up ! 
     </h3>
        <form id="login" >
        <div className="">
          <label htmlFor="email" className="t-7">Email</label>
          <input type="email" id="email" className="div-8" placeholder='Enter your email here'value={email}
          onChange={(e) => setEmail(e.target.value)} />
        </div>
      
      
      
      
      
        <button type="submit"  onClick={triggerResetEmail} className="sign-in-btn mt-5 d-flex flex-row justify-content-center align-items-center">
          <h6 className="mb-0 ml-2">Send password reset</h6>
        </button>
      </form>
      
      <div>
   
     <div className="text-center mt-5"> <i>OR</i></div>
        <button  onClick={handleGoogleLogin} className="sign-in-btn mt-5 d-flex flex-row justify-content-center align-items-center">
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
        <div className="fg-column-1">
         <h6 className='py-4 '>This is Doug.
         He also forgets his password but we got him.</h6>
        </div>
      
      </div>
    </div>
  </div>
  
    </div>
    </div>
  )
}

export default ForgotPassword
