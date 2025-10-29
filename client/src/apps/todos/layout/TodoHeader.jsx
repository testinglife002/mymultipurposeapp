// src/apps/todos/layout/TodoHeader.jsx
import React, { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import "./TodoHeader.css";

export default function TodoHeader({ user, onToggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header-container">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>
        <h1 className="header-title">🧠 SmartTodo</h1>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" title="Notifications" onClick={() => setMenuOpen(!menuOpen)}>
          <Bell size={20} />
        </button>

        <div className="header-user" onClick={() => setMenuOpen(!menuOpen)}>
          <FaUserCircle className="user-avatar" />
          <span className="user-name">{user?.username || "Guest"}</span>
        </div>

        {menuOpen && (
          <div className="header-menu-dropdown">
            <button className="header-menu-item">Settings</button>
            <button className="header-menu-item">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
