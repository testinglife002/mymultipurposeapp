// src/components/home/GordiusHeader.jsx
// 5️⃣ GordiusHeader.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Grid, FileText, Palette, User } from "lucide-react";
import newRequest from "../../api/newRequest";
import "./GordiusHeader.css";

const GordiusHeader = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const tickerRef = useRef(null);
  const navRef = useRef(null);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll listener for shrink and ticker
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 50);
      setTickerVisible(currentScroll < lastScrollTop || currentScroll < 100);
      setLastScrollTop(currentScroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  // Infinite ticker duplication
  useEffect(() => {
    if (tickerRef.current) {
      const content = tickerRef.current.innerHTML;
      tickerRef.current.innerHTML += content;
    }
  }, []);

  return (
    <header
      className={`gordius-header ${scrolled ? "shrink" : ""}`}
      ref={navRef}
    >
      {/* Navbar + Logo + Dropdowns */}
      <div className="header-top">
        <div className={`logo ${scrolled ? "logo-shrink" : ""}`}>
          <Link to="/" className="brand-text">
            Gordius WebApp
          </Link>
        </div>

        <ul className={`nav-links ${tickerVisible ? "show" : "hide"}`}>
          <li><Link to="/">Home</Link></li>

          <li className="dropdown"
              onMouseEnter={() => setDropdownOpen("apps")}
              onMouseLeave={() => setDropdownOpen(null)}
          >
            <button onClick={() => toggleDropdown("apps")}><Grid size={16} /> MyApps</button>
            {dropdownOpen === "apps" && (
              <ul className="dropdown-menu">
                <li><Link to="/todo">ToDo List</Link></li>
                <li><Link to="/task-manager">Task Manager</Link></li>
                <li><Link to="/trello">Trello</Link></li>
              </ul>
            )}
          </li>

          <li className="dropdown"
              onMouseEnter={() => setDropdownOpen("notes")}
              onMouseLeave={() => setDropdownOpen(null)}
          >
            <button onClick={() => toggleDropdown("notes")}><FileText size={16} /> MyNotes</button>
            {dropdownOpen === "notes" && (
              <ul className="dropdown-menu">
                <li><Link to="/notes">Notes App</Link></li>
                <li><Link to="/rich-text">Rich Text Editor</Link></li>
                <li><Link to="/docs">Docs</Link></li>
              </ul>
            )}
          </li>

          <li className="dropdown"
              onMouseEnter={() => setDropdownOpen("designs")}
              onMouseLeave={() => setDropdownOpen(null)}
          >
            <button onClick={() => toggleDropdown("designs")}><Palette size={16} /> MyDesigns</button>
            {dropdownOpen === "designs" && (
              <ul className="dropdown-menu">
                <li><Link to="/designs">Design Studio</Link></li>
                <li><Link to="/canva-clone">Canva Clone</Link></li>
                <li><Link to="/image-editor">Image Editor</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>

        <div className="nav-actions">
          {currentUser ? (
            <div className="user-dropdown"
                 onMouseEnter={() => setDropdownOpen("user")}
                 onMouseLeave={() => setDropdownOpen(null)}
            >
              <button onClick={() => toggleDropdown("user")}><User size={16} /> {currentUser.username}</button>
              {dropdownOpen === "user" && (
                <ul className="dropdown-menu right">
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/settings">Settings</Link></li>
                  <li><hr /></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Ticker */}
      {tickerVisible && (
        <div className="ticker-wrapper">
          <div className="ticker" ref={tickerRef}>
            <span>🚀 Welcome to Gordius WebApp</span>
            <span>🎨 Create Stunning Designs</span>
            <span>📄 Explore Free Templates</span>
            <span>📰 Read Latest Blogs</span>
            <span>🏆 Build Your Canva Clone</span>
            <span>⚡ Super Fast | Responsive | Modern UI</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default GordiusHeader;

