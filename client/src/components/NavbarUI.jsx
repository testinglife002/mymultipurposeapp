// src/components/home/NavbarUI.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid3x3,
  User,
  LogOut,
  UserCircle,
  Search,
  ChevronDown,
} from "lucide-react";
import "./NavbarUI.css";

const NavbarUI = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const navbarRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState({
    myapps: false,
    user: false,
  });

  // ✅ Use correct localStorage key "user"
  const currentUser = user || JSON.parse(localStorage.getItem("user")) || null;

  const toggleDropdown = (menu) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const closeAll = () => setDropdownOpen({ myapps: false, user: false });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbarUI-container" ref={navbarRef}>
      <div className="navbarUI-brand">
        <Link to="/">MyWebApp</Link>
      </div>

      <ul className="navbarUI-links">
        <li className="navbarUI-item ">
          <Link to="/" className="navbarUI-link">
            Home
          </Link>
        </li>

        {/* MyApps */}
        <li className="navbarUI-item navbarUI-dropdown">
          <button
            className={`navbarUI-link ${dropdownOpen.myapps ? "active" : ""}`}
            onClick={() => toggleDropdown("myapps")}
          >
            <Grid3x3 size={16} /> MyApps
            <ChevronDown
              size={16}
              className={`navbarUI-chevron ${dropdownOpen.myapps ? "rotate" : ""}`}
            />
          </button>
          <ul
            className={`navbarUI-dropdownMenu ${
              dropdownOpen.myapps ? "show" : ""
            }`}
          >
            <li>
              <Link className="navbarUI-dropdownItem" to="/task-manager">
                Task Manager
              </Link>
            </li>
            <li>
              <Link className="navbarUI-dropdownItem" to="/notes">
                Notes App
              </Link>
            </li>
            <li>
              <Link className="navbarUI-dropdownItem" to="/designs">
                Design Studio
              </Link>
            </li>
          </ul>
        </li>

        <li className="navbarUI-item">
          <Link className="navbarUI-link" to="/about">
            About
          </Link>
        </li>
        <li className="navbarUI-item">
          <Link className="navbarUI-link" to="/contact">
            Contact
          </Link>
        </li>
      </ul>

      {/* Search */}
      <form className="navbarUI-searchForm">
        <input type="text" placeholder="Search..." />
        <button type="submit">
          <Search size={16} />
        </button>
      </form>

      {/* ✅ User Menu */}
      <div className="navbarUI-userMenu">
        <div className="navbarUI-dropdown">
          <button
            className={`navbarUI-userBtn ${dropdownOpen.user ? "active" : ""}`}
            onClick={() => toggleDropdown("user")}
          >
            <UserCircle size={16} />{" "}
            {currentUser ? currentUser.username : "Guest"}
            <ChevronDown
              size={16}
              className={`navbarUI-chevron ${dropdownOpen.user ? "rotate" : ""}`}
            />
          </button>

          <ul
            className={`navbarUI-dropdownMenu ${
              dropdownOpen.user ? "show" : ""
            } navbarUI-right`}
          >
            {currentUser ? (
            <>
                <li>
                <Link to="/profile" className="navbarUI-dropdownItem">
                    <User size={14} /> 👤 {currentUser.username}
                </Link>
                </li>
                <li>
                <button className="navbarUI-dropdownItem" onClick={handleLogoutClick}>
                    <LogOut size={14} /> Logout
                </button>
                </li>
            </>
            ) : (
            <>
                <li>
                <Link to="/login" className="navbarUI-dropdownItem">
                    Login
                </Link>
                </li>
                <li>
                <Link to="/register" className="navbarUI-dropdownItem">
                    Register
                </Link>
                </li>
            </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUI;


