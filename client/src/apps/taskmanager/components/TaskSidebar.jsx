// apps/taskmanager/components/TaskSidebar.jsx
// apps/taskmanager/components/TaskSidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { LayoutGrid } from "lucide-react";
import "./TaskSidebar.css";

const linkData = [
  { label: "Dashboard", link: "/apps/task-manager/dashboard", icon: <MdDashboard /> },
  { label: "Tasks", link: "/apps/task-manager/tasks", icon: <FaTasks /> },
  { label: "Completed", link: "/apps/task-manager/completed", icon: <MdTaskAlt /> },
  { label: "In Progress", link: "/apps/task-manager/in-progress", icon: <MdOutlinePendingActions /> },
  { label: "To Do", link: "/apps/task-manager/todo", icon: <MdOutlinePendingActions /> },
  { label: "Team", link: "/apps/task-manager/team", icon: <FaUsers /> },
  { label: "Trash", link: "/apps/task-manager/trashed", icon: <FaTrashAlt /> },
];

export default function TaskSidebar({ expanded: isExpanded, toggleExpand }) {
  const [isHovered, setIsHovered] = useState(false);
  const expanded = isExpanded || isHovered;
  const location = useLocation();


   const sidebarLinks = linkData;

  return (
    <aside
      className={`task-sidebar ${expanded ? "open" : "collapsed"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => !isExpanded && setIsHovered(false)}
    >
      <div style={{ backgroundColor: "#2196f3", marginTop: "-5%" }}>
        <div className="task-sidebar-inner">
          {/* Toggle Button */}
          <div className="task-sidebar-header">
            <button
              className="task-toggle-btn"
              onClick={toggleExpand}
              title="Toggle Sidebar"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="task-sidebar-nav">
            {sidebarLinks.map((el) => {
              const isActive = location.pathname === el.link;
              return (
                <Link
                  to={el.link}
                  key={el.label}
                  className={`task-nav-item ${isActive ? "active" : ""}`}
                >
                  {el.icon}
                  {expanded && <span>{el.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer Tabs (like Quick Actions) */}
          <div className="task-sidebar-tabs">
            {expanded ? (
              <>
                <div className="task-tabs-header">Quick Actions</div>
                <div className="task-tabs">
                  <button className="task-tab active">🏠 Overview</button>
                  <button className="task-tab">📋 New Task</button>
                  <button className="task-tab">⚙ Settings</button>
                </div>
              </>
            ) : (
              <div className="task-sidebar-icons">
                <button title="Overview">🏠</button>
                <button title="New Task">📋</button>
                <button title="Settings">⚙</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

