// components/appmaterial/AppBarHeaderAlt.jsx
import React, { useState } from 'react';
// AppBarHeaderAlt
import './AppBarHeaderAlt.css';
import { FaBars } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';

export default function AppBarHeaderAlt({ mode, setMode, openSettings, openNotifications, toggleSidebar }) {
  const [navOpen, setNavOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="app-mat-header">
      <div className="app-mat-header-left">
        <button className="app-mat-hamburger" onClick={toggleSidebar}><FaBars /></button>
        <span className="app-mat-header-title">My Dashboard</span>
      </div>

      <div className="app-mat-header-right">
        <div className="app-mat-nav-dropdown">
          <button onClick={() => setNavOpen(!navOpen)}>Navigation ▾</button>
          {navOpen && (
            <ul className="app-mat-dropdown">
              <li onClick={() => setNavOpen(false)}>Dashboard</li>
              <li onClick={() => setNavOpen(false)}>Reports</li>
              <li onClick={() => setNavOpen(false)}>Analytics</li>
            </ul>
          )}
        </div>

        <button className="app-mat-icon-btn" onClick={openNotifications}>🔔</button>
        <button className="app-mat-icon-btn" onClick={openSettings}>⚙️</button>

        <button
          className="app-mat-icon-btn"
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        >
          {mode === 'light' ? <BsMoon /> : <BsSun />}
        </button>

        <div className="app-mat-user-dropdown">
          <button onClick={() => setUserOpen(!userOpen)}>👤 ▾</button>
          {userOpen && (
            <ul className="app-mat-dropdown">
              <li onClick={() => setUserOpen(false)}>Profile</li>
              <li onClick={() => setUserOpen(false)}>Logout</li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
