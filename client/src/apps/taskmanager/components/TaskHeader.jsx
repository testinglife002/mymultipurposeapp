// /apps/taskmanager/components/TaskHeader.jsx
import React from "react";
import { Bell, Menu } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import "./TaskHeader.css";

export default function TaskHeader({ user, onToggleSidebar }) {
  return (
    <header className="header-container"  >
      <div className="header-left">
        <button className="header-menu-btn" onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>
        <h1 className="header-title">Task Dashboard</h1>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="header-user">
          <FaUserCircle className="user-avatar" />
          <span className="user-name">{user?.username || "Guest"}</span>
        </div>
      </div>
    </header>
  );
}
