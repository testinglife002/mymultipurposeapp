// components/appmaterial/SubSidebar.jsx
// SubSidebar.css
// components/appmaterial/SubSidebar.jsx
// components/appmaterial/SubSidebar.jsx
// components/appmaterial/SubSidebar.jsx
import React, { useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { useLocation } from "react-router-dom";
import TodoSidebar from "../todos/layout/TodoSidebar"; // ✅ import your TodoSidebar
import "./SubSidebar.css";

export default function SubSidebar({
  isSidebarOpen,
  selectedTab,
  selectedSubTab,
  setSelectedSubTab,
}) {
  const location = useLocation();
  const isTodoApp = location.pathname.startsWith("/apps/todo"); // ✅ detect todo app route

  const subMenuMap = {
    dashboard: [
      { key: "overview", label: "Overview" },
      { key: "stats", label: "Statistics" },
      { key: "activity", label: "Activity Log" },
    ],
    app1: [
      { key: "app1-home", label: "Home" },
      { key: "app1-settings", label: "Settings" },
    ],
    app2: [
      { key: "app2-dashboard", label: "Dashboard" },
      { key: "app2-reports", label: "Reports" },
    ],
    settings: [
      { key: "profile", label: "Profile" },
      { key: "preferences", label: "Preferences" },
      { key: "security", label: "Security" },
    ],
  };

  const subMenuItems = subMenuMap[selectedTab] || [];

  const [isHovered, setIsHovered] = useState(false);
  const [rbKey, setRbKey] = useState("home");

  // Expand if main sidebar is open OR hovered
  const expanded = isSidebarOpen || isHovered;

  return (
    <aside
      className={`app-mat-subsidebar ${expanded ? "open" : "collapsed"}`}
      onMouseEnter={() => !isSidebarOpen && setIsHovered(true)}
      onMouseLeave={() => !isSidebarOpen && setIsHovered(false)}
    >
      {/* ✅ If Todo app is active, render TodoSidebar contents INSIDE SubSidebar */}
      {isTodoApp ? (
        <TodoSidebar
          isExpanded={expanded}
          toggleExpand={() => {}}
        />
      ) : (
        <>
          <ul className="app-mat-subsidebar-list">
            {subMenuItems.map((item) => (
              <li
                key={item.key}
                className={`app-mat-subsidebar-item ${
                  selectedSubTab === item.key ? "active" : ""
                }`}
                onClick={() => setSelectedSubTab(item.key)}
              >
                <MdChevronRight className="subsidebar-icon" />
                {expanded && (
                  <span className="subsidebar-label">{item.label}</span>
                )}
              </li>
            ))}
          </ul>

          {/* Default Tabs */}
          <div className="app-mat-subsidebar-tabs">
            {expanded ? (
              <>
                <div className="app-mat-tabs-header">App Sections</div>
                <div className="app-mat-tabs">
                  <button
                    className={`app-mat-tab ${
                      rbKey === "home" ? "active" : ""
                    }`}
                    onClick={() => setRbKey("home")}
                  >
                    🏠 Home
                  </button>
                  <button
                    className={`app-mat-tab ${
                      rbKey === "profile" ? "active" : ""
                    }`}
                    onClick={() => setRbKey("profile")}
                  >
                    👤 Profile
                  </button>
                  <button className="app-mat-tab disabled">⚙ Settings</button>
                </div>
                <div className="app-mat-tab-content">
                  {rbKey === "home" && <div>Sidebar tab content for Home</div>}
                  {rbKey === "profile" && (
                    <div>Sidebar tab content for Profile</div>
                  )}
                </div>
              </>
            ) : (
              <div className="app-mat-subsidebar-icons">
                <button title="Home">🏠</button>
                <button title="Profile">👤</button>
                <button title="Settings" disabled>
                  ⚙
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}








/*
import React, { useState } from "react";
import { MdChevronRight } from "react-icons/md";
import "./SubSidebar.css";

export default function SubSidebar({
  isSidebarOpen,
  selectedTab,
  selectedSubTab,
  setSelectedSubTab,
}) {
  // Define submenu items per main tab
  const subMenuMap = {
    dashboard: [
      { key: "overview", label: "Overview" },
      { key: "stats", label: "Statistics" },
      { key: "activity", label: "Activity Log" },
    ],
    app1: [
      { key: "app1-home", label: "Home" },
      { key: "app1-settings", label: "Settings" },
    ],
    app2: [
      { key: "app2-dashboard", label: "Dashboard" },
      { key: "app2-reports", label: "Reports" },
    ],
    settings: [
      { key: "profile", label: "Profile" },
      { key: "preferences", label: "Preferences" },
      { key: "security", label: "Security" },
    ],
  };

  const subMenuItems = subMenuMap[selectedTab] || [];

  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [rbKey, setRbKey] = useState('home');

  return (
    <aside className={`app-mat-subsidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
      <ul className="app-mat-subsidebar-list">
        {subMenuItems.map((item) => (
          <li
            key={item.key}
            className={`app-mat-subsidebar-item ${
              selectedSubTab === item.key ? "active" : ""
            }`}
            onClick={() => setSelectedSubTab(item.key)}
          >
            <MdChevronRight className="subsidebar-icon" />
            {isSidebarOpen && <span className="subsidebar-label">{item.label}</span>}
          </li>
        ))}
      </ul>

      <div className="app-mat-subsidebar-tabs">
        {isSidebarOpen ? (
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
          <div className="app-mat-subsidebar-icons">
            <button title="Home">🏠</button>
            <button title="Profile">👤</button>
            <button title="Settings" disabled>⚙</button>
          </div>
        )}
      </div>

    </aside>
  );
}
*/

/*
import React from "react";
import { MdChevronRight } from "react-icons/md";
import "./SubSidebar.css";

export default function SubSidebar({
  isSidebarOpen,
  selectedSubTab,
  setSelectedSubTab,
}) {
  // Example submenu items (you can load dynamically later)
  const subMenuItems = [
    { key: "overview", label: "Overview" },
    { key: "reports", label: "Reports" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <aside className={`app-mat-subsidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
      <ul className="app-mat-subsidebar-list">
        {subMenuItems.map((item) => (
          <li
            key={item.key}
            className={`app-mat-subsidebar-item ${
              selectedSubTab === item.key ? "active" : ""
            }`}
            onClick={() => setSelectedSubTab(item.key)}
          >
            <MdChevronRight className="subsidebar-icon" />
            {isSidebarOpen && <span className="subsidebar-label">{item.label}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}
*/

/*
import React, { useState } from 'react';
import './SubSidebar.css';

const SubSidebar = ({ isSidebarOpen, selectedSubTab, setSelectedSubTab }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [rbKey, setRbKey] = useState('home');

  const items = [
    { key: 'sub1', label: 'Sub Item 1' },
    { key: 'sub2', label: 'Sub Item 2' },
    { key: 'sub3', label: 'Sub Item 3' },
  ];

  return (
    <aside
      className={`app-mat-subsidebar`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: isHovered ? 250 : 50 }}
    >
      <ul className="app-mat-subsidebar-nav">
        <li className="app-mat-subsidebar-item app-mat-subdropdown">
          <div onClick={() => setOpenDropdown(!openDropdown)}>
            ⭐ Favorites {isHovered && (openDropdown ? '▴' : '▾')}
          </div>
          {openDropdown && (
            <ul className="app-mat-submenu">
              {items.map((item) => (
                <li
                  key={item.key}
                  className={`app-mat-subitem ${selectedSubTab === item.key ? 'active' : ''}`}
                  onClick={() => setSelectedSubTab(item.key)}
                >
                  ➕ {isSidebarOpen && item.label}
                </li>

              ))}
            </ul>
          )}
        </li>
      </ul>

      <div className="app-mat-subsidebar-tabs">
        {isSidebarOpen ? (
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
          <div className="app-mat-subsidebar-icons">
            <button title="Home">🏠</button>
            <button title="Profile">👤</button>
            <button title="Settings" disabled>⚙</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SubSidebar;
*/

