import React from 'react'
import mainlogo from './assets/images/mainlogo.png'
function Navbar(props) {
  return (


<nav className="navbar navbar-expand-lg navbar-light bg-light">

<button
  className="navbar-toggler"
  type="button"
  data-toggle="collapse"
  data-target="#navbarSupportedContent"
  aria-controls="navbarSupportedContent"
  aria-expanded="false"
  aria-label="Toggle navigation"
>
  <span className="navbar-toggler-icon"></span>
</button>

<div className="collapse navbar-collapse" id="navbarSupportedContent">
  <ul className="navbar-nav ml-auto">
    {props.links.map((link, index) => (
      <li className="nav-item" key={index}>
        <a className="nav-link" href={link.url}>
          <img
            src={link.image}
            alt={link.text}
            width="30"
            height="24"
            className="d-inline-block align-text-top mr-1"
          />
          {link.text}
        </a>
      </li>
    ))}
  </ul>
</div>
</nav>
  
  )
}

export default Navbar;