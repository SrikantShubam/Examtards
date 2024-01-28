import React, { useState, useRef, useEffect } from 'react';
import mainlogo from '../../assets/images/favicon.ico';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth , signOut } from 'firebase/auth';

import { useLocation, useNavigate } from 'react-router-dom';

import "./navbar.css";

function Navbar(props) {
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userImageRef = useRef(null);

  useEffect(() => {
    if (userImageRef.current) {
      // Initialize Bootstrap dropdown when the component mounts
      const dropdown = new window.bootstrap.Dropdown(userImageRef.current, {
        autoClose: 'outside',
        // Add any other options you need
      });

      // Cleanup when the component unmounts
      return () => {
        dropdown.dispose();
      };
    }
  }, [user]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


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
    <>


    <nav className="navbar navbar-light ">
    <div className="container-fluid">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
        aria-label="Toggle navigation"
      >
   
        <i className="fa-solid fa-bars"></i>
      </button>

      <Link to="/" className="navbar-brand">
        <div className="d-flex align-items-center">
          <img src={mainlogo} alt="Main Logo" className="logo-image" />
          <div className="title">Exam Tards</div>
        </div>
      </Link>

      <div className="nav-item dropdown">
        {user && (
          <div className="profile-image-container" onClick={handleDropdownToggle}>
          <img
          src={user.photoURL}
          alt="User"
          className="profile-image"
        />
          </div>
        )}

        {!user && (
          <Link to="/login" className="nav-link login-link">
            Login
          </Link>
        )}

        {user && (
          <div className={`dropdown-menu text-center ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="userDropdownToggle">
            <li onClick={handleLogout} >Logout</li>
            <Link to='/user-panel'><li>Dashboard</li></Link>
            <li>Action</li>
          </div>
        )}
      </div>
 
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
            ExamTards
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            {props.links.map((link, index) => (
              <li className="nav-item" key={index}>
                <Link to={link.url} className={`nav-link ${link.className || ''}`}>
                  {link.logo && <img src={link.logo} alt="Logo" />}
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </nav>
  </>
  );
}

export default Navbar;
