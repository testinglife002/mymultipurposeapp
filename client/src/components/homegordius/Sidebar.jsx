// src/website/components/homegordius/Sidebar.jsx
import React from "react";
import { FiHome, FiBox, FiSettings } from "react-icons/fi";
import "./Sidebar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { name: "Home", icon: <FiHome /> },
    { name: "Posts", icon: <FiBox /> },
    { name: "Settings", icon: <FiSettings /> },
  ];

  return (
    <aside className={`gordius-sidebar ${isOpen ? "gordius-open" : "gordius-collapsed"}`}>
      <button className="gordius-toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "<" : ">"}
      </button>
      <ul className="gordius-menu">
        {menuItems.map((item, idx) => (
          <li key={idx} className="gordius-menu-item">
            <span className="gordius-icon">{item.icon}</span>
            {isOpen && <span className="gordius-label">{item.name}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}

