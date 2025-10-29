// components/appmaterial/Header.jsx
import React from 'react';
import './Header.css';

const Header = ({ darkMode, setDarkMode }) => {
  const toggleMode = () => setDarkMode(!darkMode);

  return (
    <header className={`app-mat-header-navbar ${darkMode ? 'app-mat-dark' : ''}`}>
      <div className="app-mat-header-navbar-left">
        <h2 className="app-mat-header-brand">🧩 MyMaterial</h2>
      </div>

      <form className="app-mat-header-search">
        <input type="search" placeholder="Search..." className="app-mat-header-search-input" />
        <button type="submit" className="app-mat-header-search-btn">Search</button>
      </form>

      <div className="app-mat-header-actions">
        <button className="app-mat-header-btn-mode" onClick={toggleMode}>
          {darkMode ? '🌞' : '🌙'}
        </button>

        <div className="app-mat-header-profile">
          <button className="app-mat-header-btn-profile">👤 Profile ▾</button>
          <ul className="app-mat-header-profile-dropdown">
            <li>Dashboard</li>
            <li>Settings</li>
            <li className="app-mat-divider"></li>
            <li>Logout</li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header;
