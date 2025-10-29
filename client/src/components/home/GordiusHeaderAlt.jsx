// src/components/ui/GordiusHeaderAlt.jsx
// 5️⃣ HeaderUIOne.jsx (dropdown click + outside close)
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Grid, FileText, Palette } from "lucide-react";
import { logoutRequest } from "../../api/newRequest";
import "./GordiusHeaderAlt.css";

const GordiusHeaderAlt = ({ user, setUser }) => {
  const tickerRef = useRef(null);
  const navRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Duplicate ticker content for infinite scroll
  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.innerHTML += tickerRef.current.innerHTML;
    }
  }, []);

  // Scroll shrink + ticker hide
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      setTickerVisible(current < lastScrollTop || current < 100);
      setLastScrollTop(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id) => setDropdownOpen(dropdownOpen === id ? null : id);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.warn("Logout API failed:", e.message);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div style={{ marginTop: "9.5%" }}>
      <header className={`header-alt ${scrolled ? "shrink" : ""}`} ref={navRef}>
        <div className="header-top">
          <div className="logo">
            <Link to="/">Gordius WebApp</Link>
          </div>

          <nav className={`nav-tabs ${tickerVisible ? "show" : "hide"}`}>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>

            {user && (
              <>
                {/* MyApps Dropdown */}
                <div className="dropdown">
                  <button
                    className={`dropdown-toggle ${dropdownOpen === "apps" ? "active" : ""}`}
                    onClick={() => toggleDropdown("apps")}
                  >
                    <Grid size={16} /> MyApps
                  </button>
                  {dropdownOpen === "apps" && (
                    <ul className="dropdown-menu">
                      <li><Link>Select App</Link></li>
                      <li><Link to="/todo">ToDo List</Link></li>
                      <li><Link to="/task-manager">Task Manager</Link></li>
                      <li><Link to="/trello">Trello</Link></li>
                    </ul>
                  )}
                </div>

                {/* Templates Dropdown */}
                <div className="dropdown">
                  <button
                    className={`dropdown-toggle ${dropdownOpen === "templates" ? "active" : ""}`}
                    onClick={() => toggleDropdown("templates")}
                  >
                    <FileText size={16} /> Templates
                  </button>
                  {dropdownOpen === "templates" && (
                    <ul className="dropdown-menu">
                      <li><Link>Select Template</Link></li>
                      <li><Link to="/templates">All Templates</Link></li>
                      <li><Link to="/templates/business">Business Templates</Link></li>
                      <li><Link to="/templates/social">Social Media Templates</Link></li>
                      <li><Link to="/templates/portfolio">Portfolio Templates</Link></li>
                    </ul>
                  )}
                </div>

                {/* Designs Dropdown */}
                <div className="dropdown">
                  <button
                    className={`dropdown-toggle ${dropdownOpen === "designs" ? "active" : ""}`}
                    onClick={() => toggleDropdown("designs")}
                  >
                    <Palette size={16} /> Designs
                  </button>
                  {dropdownOpen === "designs" && (
                    <ul className="dropdown-menu">
                      <li><Link>Select Design</Link></li>
                      <li><Link to="/designs">All Designs</Link></li>
                      <li><Link to="/designs/canva-clone">Canva Clone</Link></li>
                      <li><Link to="/designs/editor">Image Editor</Link></li>
                      <li><Link to="/designs/gallery">Design Gallery</Link></li>
                    </ul>
                  )}
                </div>
              </>
            )}

            <Link to="/blogs">Blogs</Link>
          </nav>

          <div className={`header-buttons ${tickerVisible ? "show" : "hide"}`}>
            {user ? (
              <>
                <span className="username">👋 {user.username}</span>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>

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
    </div>
  );
};

export default GordiusHeaderAlt;


