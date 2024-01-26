import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getAuth, signOut } from 'firebase/auth';

function Userpanel() {
    
const location = useLocation();
const navigate = useNavigate();
// const userData = location.state && location.state.userData;
console.log('Location state:', location.state)
const userData = JSON.parse(localStorage.getItem('userData'));
console.log('the data is',userData);
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
      <p>User Name: {userData.displayName}</p>
      <p>Email: {userData.email}</p>
      <img src={userData.photoURL} alt="Profile" />
   
      <button className='btn btn-dark' onClick={handleLogout}>Logout</button>
      {/* Rest of your Userpanel component */}
    </div>
  );
}

export default Userpanel;
