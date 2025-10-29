// src/author/layout/AuthorDashboardLayout.jsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, Menu, User, Layers, BookOpen } from "lucide-react";
import SidebarTabs from "../components/SidebarTabs";
import AuthorNavbar from "./AuthorNavbar";
import "./AuthorDashboardLayout.css";

const AuthorDashboardLayout = ({ user }) => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  const [avatarDropdown, setAvatarDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="author-dashboard-layout">

      {/* Navbar 
      <AuthorNavbar user={user}  />
      */}

      {/* Sidebar */}
      <aside className={`author-main-sidebar ${sidebarOpen ? "open" : "collapsed"}`} style={{marginTop:'2%'}} >
        <div className="author-sidebar-header">
          {sidebarOpen && <h3 className="author-sidebar-title">Dashboard</h3>}
          <button className="author-sidebar-toggle-btn" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
        </div>

        {/* User Avatar */}
        <div
          className={`author-sidebar-avatar ${sidebarOpen ? "expanded" : "collapsed"}`}
          onClick={() => setAvatarDropdown(!avatarDropdown)}
        >
          <img src="https://i.pravatar.cc/50" alt="User Avatar" />
          {sidebarOpen && <span className="username">{user?.username || "John Doe"}</span>}
          {sidebarOpen && <ChevronDown size={14} />}
        </div>

        {avatarDropdown && sidebarOpen && (
          <div className="author-avatar-dropdown">
            <Link to="/dashboard/profile">Profile</Link>
            <Link to="/dashboard/settings">Settings</Link>
            <Link to="/logout">Logout</Link>
          </div>
        )}

        {/* Sidebar Links */}
        <ul className="author-sidebar-links">
          <li>
            <Link to="/dashboard/profile">
              <span className="link-icon">
                <User size={18} />
              </span>
              {sidebarOpen && <span className="link-text">Home</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings">
              <span className="link-icon">
                <Layers size={18} />
              </span>
              {sidebarOpen && <span className="link-text">Settings</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/analytics">
              <span className="link-icon">
                <BookOpen size={18} />
              </span>
              {sidebarOpen && <span className="link-text">Analytics</span>}
            </Link>
          </li>
        </ul>

        {/* Sidebar Tabs */}
        <SidebarTabs currentPath={currentPath} />
      </aside>

      {/* Main Content */}
      <div className="author-dashboard-right">
        <main className="author-dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthorDashboardLayout;



