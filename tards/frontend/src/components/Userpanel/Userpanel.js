import React,{useEffect,useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import {auth,provider} from '../SignUp/config';
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
 

  return (
    <div className='body'>
      <h1>Welcome to Userpanel</h1>
      {user ? (
        <React.Fragment>
        <h4>{user.displayName}</h4>
          <h4>{user.email}</h4>
          
          <button className='btn btn-dark' onClick={handleLogout}>
            Logout
          </button>
        </React.Fragment>
      ) : (
        <p>Loading...</p>
      )}
      {/* Rest of your Userpanel component */}
    </div>
  );
}

export default Userpanel;
