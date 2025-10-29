// Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import "./Sidebar.css";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";

const linkData = [
  { label: "Dashboard", link: "dashboard", icon: <MdDashboard /> },
  { label: "Tasks", link: "tasks", icon: <FaTasks /> },
  { label: "Completed", link: "completed/completed", icon: <MdTaskAlt /> },
  { label: "In Progress", link: "in-progress/in progress", icon: <MdOutlinePendingActions /> },
  { label: "To Do", link: "todo/todo", icon: <MdOutlinePendingActions /> },
  { label: "Team", link: "team", icon: <FaUsers /> },
  { label: "Trash", link: "trashed", icon: <FaTrashAlt /> },
];

const Sidebar = ({ user }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-icon">
          <MdOutlineAddTask />
        </div>
        <h4 className="sidebar-title">TaskMe</h4>
      </div>

      <div className="sidebar-links">
        {sidebarLinks.map((item) => (
          <Link
            key={item.label}
            to={`/${item.link}`}
            className={clsx(
              "sidebar-link",
              path === item.link.split("/")[0] && "active"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <button className="sidebar-settings">
        <MdSettings />
        <span>Settings</span>
      </button>
    </div>
  );
};

export default Sidebar;
