// components/appmaterial/SidebarAlt.jsx
import React from "react";
import "./SidebarAlt.css";

const SidebarAlt = ({ isOpen, selectedTab, setSelectedTab }) => {
  return (
    <div className={`appmat-sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button className="toggle-btn" onClick={() => setSelectedTab("")}>
        ☰
      </button>

      <ul className="sidebar-menu">
        <li
          className={selectedTab === "dashboard" ? "active" : ""}
          onClick={() => setSelectedTab("dashboard")}
        >
          Dashboard
          <ul className="submenu">
            <li>Overview</li>
            <li>Analytics</li>
            <li>Reports</li>
          </ul>
        </li>

        <li
          className={selectedTab === "projects" ? "active" : ""}
          onClick={() => setSelectedTab("projects")}
        >
          Projects
          <ul className="submenu">
            <li>Project A</li>
            <li>Project B</li>
            <li>Project C</li>
          </ul>
        </li>

        <li
          className={selectedTab === "settings" ? "active" : ""}
          onClick={() => setSelectedTab("settings")}
        >
          Settings
          <ul className="submenu">
            <li>Profile</li>
            <li>Preferences</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default SidebarAlt;
