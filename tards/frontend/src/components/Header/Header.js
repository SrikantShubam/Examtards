import React from 'react';
import "./header.css";
import Navbar from '../Navbar/Navbar'

 const navbarLinks = [
    
    { text: 'Compare Syllabus', url: '/about'  },
    { text: 'Login', url: '/contact'},
  ];
const Header = () => {
  return (
    <header>

      <Navbar links={navbarLinks}/>
    </header>
  )
}

export default Header;