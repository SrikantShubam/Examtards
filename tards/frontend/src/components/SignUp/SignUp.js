import React,{useEffect,useState,useRef} from 'react'
import "./SignUp.css";
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate
import {auth,provider} from './config';
import * as EmailValidator from 'email-validator';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { signInWithPopup,onAuthStateChanged,createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
var passwordValidator = require('password-validator');



function SignUp() {
var schema = new passwordValidator();
schema.is()
.min(8)
.is()
.max(100)
.has()
.uppercase()                             
.has().lowercase()                              
.has().digits(1)                                
.has().not().spaces()                         
.is().not().oneOf(['Passw0rd', 'Password123']); 
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
  
    if (!EmailValidator.validate(email)) {
    
      setErrorMessage('Invalid email format. Please try again.');
    
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if(schema.validate(password)!==true){
      setErrorMessage('Please be sure that your password has minimum 8 characters,lowercase and uppercase and at least 1 digit and no spaces ');
    }
    try {
  
      console.log('yahan ho');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("user created!");
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      navigate('/user-panel');
    } catch (error) {
      setErrorMessage("The email you provided is already in use! Please go to forget password on login page or use another email");
     
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
   /*-------hcaptcha-------- */
   const [token, setToken] = useState(null);
   const captchaRef = useRef(null);
 
   const onLoad = () => {
     // Only load hCaptcha if the token is null (i.e., user has not interacted with it yet)
     if (!token==null) {
       captchaRef.current.execute();
     }
   };
   const onCaptchaVerify = (token) => {
     setToken(token);
     // If token is null, hCaptcha verification failed
     if (!token) {
       alert('Incorrect CAPTCHA. Please try again.');
     }
   };
   useEffect(() => {
 
     if (token)
       console.log(`hCaptcha Token: ${token}`);
 
   }, [token]);
  return (
  <>
 
<div className="body">
<div className="div">
  <div className="div-2">
    <div className="div-3">
      <div className="column">
        <div className="div-4">
        <form onSubmit={handleEmailLogin}>
          <div className="div-5">
            Sign Up
        
          </div>
          <div className="div-6">
            Enter your details to create an account to get started.
            Already have an account <Link to="/login">login here!</Link>
          </div>
          <div className="div-7">
           
            <div className="div-11">
            
              <label htmlFor="Name" className="t-7">Full Name</label>
              <input type="name" id="name" placeholder='Enter your full name' required value={name}
              onChange={(e) => setName(e.target.value)} className="div-13" />
             
            </div>
            <div className="div-11">
            
              <label htmlFor="email" className="t-7">Email</label>
              <input type="email" placeholder="enter your email here" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required className="div-13" />
             
            </div>
          </div>
          <div className="div-14">Password</div>
          <input type="password" id="pass1" placeholder="Enter your password" required value={password}
          onChange={(e) => setPassword(e.target.value)} className="div-13" />
          <div className="div-16">Confirm Password</div>
          <input type="password" required  value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        id="pass2" className="div-13" placeholder='Enter your password again'/>
        <div className="text-center mt-3">
        <HCaptcha
     sitekey="9de6c6f0-8f38-417b-9eac-0cdb3dc52f34"
     onLoad={onLoad}
  
     ref={captchaRef}
     onVerify={onCaptchaVerify}

   />
   </div>
          <button type="submit"   className="sign-in-btn mt-4 d-flex flex-row justify-content-center align-items-center">
              <h6 className="mb-0 ml-2">Sign up</h6>
            </button>
            </form>
            <div className="text-center my-3">OR</div>
            <button onClick={handleGoogleLogin} className="sign-in-btn mb-5  d-flex flex-row justify-content-center align-items-center">
            <img
              alt='login now'
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a48a278fb47efc62f61c941d3cbb6457594925619df61568b3ff3a22fc527367?"
              className="img-fluid"
            />
            <h6 className="mb-0 ml-2">Sign in with Google</h6>
          </button>
          {errorMessage && (
            <div className="alert alert-danger my-3" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
      <div className="column-2">
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/7b01e9dd4dbd860f69452711acb409ccfc4e2297c4d5c544f75df6c09a425e49?apiKey=de722ffef7e043389cb3e537e0a30338&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/7b01e9dd4dbd860f69452711acb409ccfc4e2297c4d5c544f75df6c09a425e49?apiKey=de722ffef7e043389cb3e537e0a30338&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/7b01e9dd4dbd860f69452711acb409ccfc4e2297c4d5c544f75df6c09a425e49?apiKey=de722ffef7e043389cb3e537e0a30338&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/7b01e9dd4dbd860f69452711acb409ccfc4e2297c4d5c544f75df6c09a425e49?apiKey=de722ffef7e043389cb3e537e0a30338&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/7b01e9dd4dbd860f69452711acb409ccfc4e2297c4d5c544f75df6c09a425e49?apiKey=de722ffef7e043389cb3e537e0a30338&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/7b01e9dd4dbd860f69452711acb409ccfc4e2297c4d5c544f75df6c09a425e49?apiKey=de722ffef7e043389cb3e537e0a30338&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/7b01e9dd4dbd860f69452711acb409ccfc4e2297c4d5c544f75df6c09a425e49?apiKey=de722ffef7e043389cb3e537e0a30338&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/7b01e9dd4dbd860f69452711acb409ccfc4e2297c4d5c544f75df6c09a425e49?apiKey=de722ffef7e043389cb3e537e0a30338&"
          className="img-2"
        />
      </div>
    </div>
  </div>
</div>
</div>
<style jsx>{`
  .div {
    justify-content: center;
    align-items: center;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 49px 60px;
  }
  .div-19{
    justify-content: center;
    color: var(--material-theme-black, #000);
    text-align: center;
    flex-grow: 1;
    white-space: nowrap;
    font: 400 22px/127% Roboto, -apple-system, Roboto, Helvetica,
      sans-serif;
  }
  .div-18:hover , .div-19:hover, .div-20:hover{
color:white;
background-color:black;
  }
  @media (max-width: 991px) {
    .div {
      padding: 0 20px;
    }
  }
  .div-2 {
    margin-top: 22px;
    width: 100%;
    max-width: 1043px;
  }
  @media (max-width: 991px) {
    .div-2 {
      max-width: 100%;
    }
  }
  .div-3 {
    gap: 20px;
    display: flex;
  }
  @media (max-width: 991px) {
    .div-3 {
      flex-direction: column;
      align-items: stretch;
      gap: 0px;
    }
  }
  .column {
    display: flex;
    flex-direction: column;
    line-height: normal;
    width: 46%;
    margin-left: 0px;
  }
  @media (max-width: 991px) {
    .column {
      width: 100%;
    }
  }
  .div-4 {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }
  @media (max-width: 991px) {
    .div-4 {
      max-width: 100%;
      margin-top: 40px;
    }
  }
  .div-5 {
    color: var(--material-theme-black, #000);
    font: 400 32px/40px Roboto, -apple-system, Roboto, Helvetica,
      sans-serif;
  }
  @media (max-width: 991px) {
    .div-5 {
      max-width: 100%;
    }
  }
  .div-6 {
    color: var(--material-theme-black, #000);
    margin-top: 26px;
    font: 600 16px/24px Roboto, -apple-system, Roboto, Helvetica,
      sans-serif;
  }
  @media (max-width: 991px) {
    .div-6 {
      max-width: 100%;
    }
  }
  .div-7 {
    display: flex;
    margin-top: 26px;
    justify-content: space-between;
    gap: 20px;
  }
  @media (max-width: 991px) {
    .div-7 {
      max-width: 100%;
      flex-wrap: wrap;
    }
  }
  .div-8 {
    display: flex;
    flex-grow: 1;
    flex-basis: 0%;
    flex-direction: column;
  }
  .div-9 {
    color: var(--material-theme-black, #000);
    font: 500 14px/143% Roboto, -apple-system, Roboto, Helvetica,
      sans-serif;
  }
  .div-10 {
    background-color: #d9d9d9;
    display: flex;
    margin-top: 26px;
    height: 50px;
    flex-direction: column;
  }
  .div-11 {
    display: flex;
    flex-grow: 1;
    flex-basis: 0%;
    flex-direction: column;
  }
  .div-12 {
    color: var(--material-theme-black, #000);
    font: 500 14px/143% Roboto, -apple-system, Roboto, Helvetica,
      sans-serif;
  }
  .div-13 {
    background-color: #D8E2FF;
    display: flex;
    margin-top: 5px;
    height: 50px;
    flex-direction: column;
    border:none;
    padding-left:10px;
    border-radius:10px;
    width:100%;
  }
  .div-14 {
    color: var(--material-theme-black, #000);
    margin-top: 26px;
    font: 500 14px/143% Roboto, -apple-system, Roboto, Helvetica,
      sans-serif;
  }
  @media (max-width: 991px) {
    .div-14 {
      max-width: 100%;
    }
  }
  .div-15 {
    background-color: #d9d9d9;
    display: flex;
    margin-top: 26px;
    height: 50px;
    flex-direction: column;
  }
  @media (max-width: 991px) {
    .div-15 {
      max-width: 100%;
    }
  }
  .div-16 {
    color: var(--material-theme-black, #000);
    margin-top: 26px;
    font: 500 14px/143% Roboto, -apple-system, Roboto, Helvetica,
      sans-serif;
  }
  @media (max-width: 991px) {
    .div-16 {
      max-width: 100%;
    }
  }
  .div-17 {
    background-color: #d9d9d9;
    display: flex;
    margin-top: 26px;
    height: 50px;
    flex-direction: column;
  }
  @media (max-width: 991px) {
    .div-17 {
      max-width: 100%;
    }
  }
  .div-18 {
    color: var(--material-theme-black, #000);
    white-space: nowrap;
    justify-content: center;
    text-align:center;
    align-items: center;
    border-radius: 4px;
    background-color: var(
      --material-theme-sys-light-primary-container,
      #d8e2ff
    );
    margin-top: 26px;
    padding: 10px 60px;
    font: 400 22px/127% Roboto, -apple-system, Roboto, Helvetica,
      sans-serif;
  }
  @media (max-width: 991px) {
    .div-18 {
      white-space: initial;
      max-width: 100%;
      padding: 0 20px;
    }
  }
  .div-19 {
    justify-content: space-between;
    border-radius: 4px;
    background-color: var(
      --material-theme-sys-light-primary-container,
      #d8e2ff
    );
    display: flex;
    margin-top: 26px;
    gap: 10px;
    padding: 10px 80px;
  }
  @media (max-width: 991px) {
    .div-19 {
      max-width: 100%;
      flex-wrap: wrap;
      padding: 0 20px;
    }
  }
  .img {
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center;
    width: 24px;
  }
  .div-20 {
 
  }
  @media (max-width: 991px) {
    .div-20 {
      white-space: initial;
    }
  }
  .column-2 {
    display: flex;
    flex-direction: column;
    line-height: normal;
    width: 54%;
    margin-left: 20px;
  }
  @media (max-width: 991px) {
    .column-2 {
      width: 100%;
      display:none;
    }
  }
  .img-2 {
    aspect-ratio: 0.72;
    object-fit: contain;
    object-position: center;
    width: 100%;
    flex-grow: 1;
  }
  @media (max-width: 991px) {
    .img-2 {
      max-width: 100%;
      margin-top: 40px;
    }
  }
`}</style>

    </>
  )
}

export default SignUp
