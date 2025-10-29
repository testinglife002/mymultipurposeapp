// CanvaLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BsFolder, BsGrid1X2 } from "react-icons/bs";
import { LogOut, Settings } from "lucide-react";
import { logoutRequest } from "../../api/newRequest";
import "./CanvaLayout.css";

const CanvaLayout = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const create = (e) => {
    e.preventDefault();
    navigate("/designs/design/create", {
      state: { type: "create", width: 600, height: 480 },
      replace: true,
    });
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.warn("Logout API failed:", e.message);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="canva-layout-container" style={{ marginLeft: "-5%" }}>
      {/* Top Navbar */}
      <nav className="canva-layout-navbar">
        <div className="canva-layout-navbar-left" style={{ marginLeft: "5%" }}>
          <img
            src="https://static.canva.com/web/images/12487a1e0770d29351bd4ce4f87ec8fe.svg"
            alt="Logo"
            className="canva-layout-navbar-logo"
          />
        </div>

        <div className="canva-layout-navbar-right" style={{ marginRight: "5%" }}>
          {user && (
            <>
              <button onClick={create} className="canva-create-btn">
                Create a Design
              </button>

              <div className="canva-layout-profile-dropdown" ref={dropdownRef}>
                <img
                  src={user.profile || "https://via.placeholder.com/40"}
                  alt="profile"
                  className="canva-layout-profile-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="canva-layout-dropdown-menu">
                    <div className="canva-layout-dropdown-user">
                      <img
                        src={user.profile || "https://via.placeholder.com/40"}
                        alt="user"
                        className="canva-layout-dropdown-user-avatar"
                      />
                      <div>
                        <div className="canva-layout-dropdown-username">{user.username}</div>
                        <div className="canva-layout-dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="canva-layout-dropdown-divider"></div>
                    <button className="canva-layout-dropdown-item">
                      <Settings size={16} /> Settings
                    </button>
                    <button
                      className="canva-layout-dropdown-item"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="canva-layout-sidebar">
        {user && (
          <div className="canva-layout-sidebar-profile">
            <img
              src={user.profile || "https://via.placeholder.com/64"}
              alt="user"
              className="canva-layout-sidebar-avatar"
            />
            <span className="canva-layout-sidebar-username">{user.username}</span>
            <span className="canva-layout-sidebar-plan">Free</span>
          </div>
        )}

        <div className="canva-layout-sidebar-links">
          <Link
            to="/designs"
            className={`canva-layout-sidebar-link ${
              location.pathname === "/designs" ? "active" : ""
            }`}
          >
            <FaHome /> Home
          </Link>
          <Link
            to="/designs/projects"
            className={`canva-layout-sidebar-link ${
              location.pathname === "/designs/projects" ? "active" : ""
            }`}
          >
            <BsFolder /> Projects
          </Link>
          <Link
            to="/designs/templates"
            className={`canva-layout-sidebar-link ${
              location.pathname === "/designs/templates" ? "active" : ""
            }`}
          >
            <BsGrid1X2 /> Templates
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="canva-layout-content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default CanvaLayout;


