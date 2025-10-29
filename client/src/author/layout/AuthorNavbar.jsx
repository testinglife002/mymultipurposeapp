// src/author/components/AuthorNavbar.jsx
import React from "react";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "../../api/newRequest";
import "./AuthorNavbar.css";

const AuthorNavbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.warn("Logout API failed:", err.message);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className='author-navbar'>
      <div className="author-navbar-left">
        <button className="author-hamburger-btn">
          <FaBars size={20} />
        </button>
        <span className="author-navbar-brand">Gordius Author</span>
      </div>

      <div className="author-navbar-right">
        {user ? (
          <>
            <FaUserCircle size={20} className="author-user-icon" />
            <span className="author-user-name">{user.username || user.displayName}</span>
            <button className="author-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <span className="author-user-name">Guest</span>
            <button className="author-login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default AuthorNavbar;

