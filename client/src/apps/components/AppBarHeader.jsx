// components/appmaterial/AppBarHeader.jsx
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { logoutRequest } from "../../api/newRequest";
import "./AppBarHeader.css";
import NotificationBell from "./NotificationBell";

export default function AppBarHeader({ user, mode, setMode, openSettings, openNotifications, toggleSidebar }) {
  const [navOpen, setNavOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.warn("Logout API failed:", e.message);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="app-mat-header">
      <div className="app-mat-header-left">
        <button className="app-mat-header-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1 className="app-mat-header-title">My Dashboard</h1>
      </div>

      <div className="app-mat-header-right">
        <button className="app-mat-header-btn" onClick={() => setNavOpen(!navOpen)}>Navigation ▾</button>
        {navOpen && (
          <ul className="app-mat-header-dropdown">
            <li onClick={() => setNavOpen(false)}>Dashboard</li>
            <li onClick={() => setNavOpen(false)}>Reports</li>
            <li onClick={() => setNavOpen(false)}>Analytics</li>
          </ul>
        )}

        <NotificationBell />
        <button className="app-mat-header-icon" onClick={openNotifications}><NotificationsIcon /></button>
        <button className="app-mat-header-icon" onClick={openSettings}><SettingsIcon /></button>
        <button className="app-mat-header-icon" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </button>

        <div className="app-mat-header-avatar-wrapper">
          {user ? (
            <>
              <Avatar onClick={() => setUserOpen(!userOpen)} />
              {userOpen && (
                <ul className="app-mat-header-dropdown app-mat-header-dropdown-right">
                  <li className="dropdown-username">👋 {user.username}</li>
                  <li onClick={() => { setUserOpen(false); navigate("/profile"); }}>Profile</li>
                  <li onClick={() => { setUserOpen(false); handleLogout(); }}>Logout</li>
                </ul>
              )}
            </>
          ) : (
            <div className="login-register">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

