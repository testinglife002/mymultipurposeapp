// components/appmaterial/Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="app-mat-navbar">
      <ul className="app-mat-navbar-list">
        <li className="app-mat-navbar-item"><a href="#">Home</a></li>

        <li className="app-mat-navbar-item app-mat-navbar-dropdown" onClick={() => setOpen(!open)}>
          <a href="#">Features ▾</a>
          {open && (
            <ul className="app-mat-navbar-dropdown-menu">
              <li><a href="#">Feature 1</a></li>
              <li><a href="#">Feature 2</a></li>
            </ul>
          )}
        </li>

        <li className="app-mat-navbar-item"><a href="#">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
