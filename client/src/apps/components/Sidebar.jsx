// components/appmaterial/Sidebar.jsx
// Sidebar.css
// components/appmaterial/Sidebar.jsx

/*
import React, { useState } from "react";
import {
  MdDashboard,
  MdApps,
  MdSettings,
  MdExpandLess,
  MdExpandMore,
} from "react-icons/md";
import "./Sidebar.css";

export default function Sidebar({
  isOpen,
  toggleSidebar,
  selectedTab,
  setSelectedTab,
}) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <aside className={`app-mat-sidebar ${isOpen ? "open" : "collapsed"}`}>
      <ul className="app-mat-sidebar-list">
   
        <li
          className={`app-mat-sidebar-item ${
            selectedTab === "dashboard" ? "active" : ""
          }`}
          onClick={() => setSelectedTab("dashboard")}
        >
          <MdDashboard className="sidebar-icon" />
          {isOpen && <span className="sidebar-label">Dashboard</span>}
        </li>

    
        <li
          className={`app-mat-sidebar-item ${
            selectedTab.startsWith("app") ? "active" : ""
          }`}
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          <MdApps className="sidebar-icon" />
          {isOpen && (
            <span className="sidebar-label">
              Apps {openDropdown ? <MdExpandLess /> : <MdExpandMore />}
            </span>
          )}
        </li>
        {openDropdown && isOpen && (
          <ul className="app-mat-submenu">
            <li
              className={`app-mat-subitem ${
                selectedTab === "app1" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("app1")}
            >
              App One
            </li>
            <li
              className={`app-mat-subitem ${
                selectedTab === "app2" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("app2")}
            >
              App Two
            </li>
          </ul>
        )}

 =
        <li
          className={`app-mat-sidebar-item ${
            selectedTab === "settings" ? "active" : ""
          }`}
          onClick={() => setSelectedTab("settings")}
        >
          <MdSettings className="sidebar-icon" />
          {isOpen && <span className="sidebar-label">Settings</span>}
        </li>
      </ul>
    </aside>
  );
}
*/



import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, selectedTab, setSelectedTab }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [rbKey, setRbKey] = useState('home');

  return (
    <aside className={`app-mat-sidebar ${isOpen ? 'app-mat-sidebar-open' : 'app-mat-sidebar-collapsed'}`}>
      <div className="app-mat-sidebar-toggle">
        <button onClick={toggleSidebar}>☰</button>
      </div>

      <ul className="app-mat-sidebar-nav">
        <li
          className={`app-mat-sidebar-item ${selectedTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setSelectedTab('dashboard')}
        >
          🏠 {isOpen && "Dashboard"}
        </li>


        <li className="app-mat-sidebar-item app-mat-dropdown">
          <div onClick={() => setOpenDropdown(!openDropdown)}>
            📦 { isOpen && "Apps"} {isOpen && (openDropdown ? '▴' : '▾')}
          </div>
          {openDropdown && isOpen && (
            <ul className="app-mat-submenu">
              <li
                className={`app-mat-subitem ${selectedTab === 'app1' ? 'active' : ''}`}
                onClick={() => setSelectedTab('app1')}
              >
                App One
              </li>
              <li
                className={`app-mat-subitem ${selectedTab === 'app2' ? 'active' : ''}`}
                onClick={() => setSelectedTab('app2')}
              >
                App Two
              </li>
            </ul>
          )}

        </li>

        <li
          className={`app-mat-sidebar-item ${selectedTab === 'settings' ? 'active' : ''}`}
          onClick={() => setSelectedTab('settings')}
        >
          ⚙ Settings
        </li>
      </ul>

      {<div className="app-mat-sidebar-tabs">
        {isOpen ? (
          <>
            <div className="app-mat-tabs-header">App Sections</div>
            <div className="app-mat-tabs">
              <button className={`app-mat-tab ${rbKey === 'home' ? 'active' : ''}`} onClick={() => setRbKey('home')}>🏠 Home</button>
              <button className={`app-mat-tab ${rbKey === 'profile' ? 'active' : ''}`} onClick={() => setRbKey('profile')}>👤 Profile</button>
              <button className="app-mat-tab disabled">⚙ Settings</button>
            </div>
            <div className="app-mat-tab-content">
              {rbKey === 'home' && <div>Sidebar tab content for Home</div>}
              {rbKey === 'profile' && <div>Sidebar tab content for Profile</div>}
            </div>
          </>
        ) : (
          <div className="app-mat-sidebar-icons">
            <button title="Home">🏠</button>
            <button title="Profile">👤</button>
            <button title="Settings" disabled>⚙</button>
          </div>
        )}
      </div>}
    </aside>
  )
}

export default Sidebar;


