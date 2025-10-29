// src/author/layout/AuthorDashboardLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, Menu, User, Layers, BookOpen } from "lucide-react";

import SidebarTabs from "../components/SidebarTabs";
import "./AuthorDashboardLayout.css";

const AuthorDashboardLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  const secRef = useRef(null);
  const [scrollShadow, setScrollShadow] = useState(false);
  const [avatarDropdown, setAvatarDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleScroll = () => {
    if (secRef.current) setScrollShadow(secRef.current.scrollLeft > 0);
  };

  useEffect(() => {
    const node = secRef.current;
    if (node) node.addEventListener("scroll", handleScroll);
    return () => node && node.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="user-dashboard-layout">
      {/* Main Sidebar */}
      <aside className={`user-main-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="user-sidebar-header">
          {sidebarOpen && (
            <h3 className={`user-sidebar-title ${sidebarOpen ? "expanded" : "collapsed"}`}>
              Dashboard
            </h3>
          )}
          <button
            className="user-sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* User Avatar */}
        <div
          className={`user-sidebar-avatar ${sidebarOpen ? "expanded" : "collapsed"}`}
          onClick={() => setAvatarDropdown(!avatarDropdown)}
        >
          <img src="https://i.pravatar.cc/50" alt="User Avatar" />
          {sidebarOpen && <span className="username">John Doe</span>}
          {sidebarOpen && <ChevronDown size={14} />}
        </div>
        {avatarDropdown && sidebarOpen && (
          <div className="user-avatar-dropdown">
            <Link to="/dashboard/profile">Profile</Link>
            <Link to="/dashboard/settings">Settings</Link>
            <Link to="/logout">Logout</Link>
          </div>
        )}

        <ul className="sidebar-links">
          <li>
            <Link to="/dashboard/profile">
              <span className="link-icon"><User size={18} /></span>
              {sidebarOpen && <span className="link-text">Home</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings">
              <span className="link-icon"><Layers size={18} /></span>
              {sidebarOpen && <span className="link-text">Settings</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/analytics">
              <span className="link-icon"><BookOpen size={18} /></span>
              {sidebarOpen && <span className="link-text">Analytics</span>}
            </Link>
          </li>
        </ul>
      </aside>

      {/* Right Side: Secondary Tabs + Main Content */}
      <div className="user-dashboard-right">
        <div className="user-secondary-wrapper">
          <SidebarTabs ref={secRef} scrollShadow={scrollShadow} currentPath={currentPath} />
        </div>

        {/* Main Content */}
        <main className="user-dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthorDashboardLayout;
