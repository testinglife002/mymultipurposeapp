import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Grid,
  FileText,
  Palette,
  FolderKanban,
  Home,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { logoutRequest } from "../../api/newRequest";
import Ticker from "./Ticker";
import "./Header.css";

const Header = ({ user, setUser }) => {
  const location = useLocation();
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const noHeaderPaths = ["/login", "/register", "/verify-email"];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  // Scroll control
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

  // Click outside closes dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id) =>
    setDropdownOpen(dropdownOpen === id ? null : id);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.warn(e.message);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
  };

  if (!showHeader) return null;

  const renderDropdown = (id, icon, label, links) => {
    const isActive = links.some((link) => link.to === location.pathname);
    return (
      <div
        className={`dropdown ${isActive ? "active-dropdown" : ""}`}
        onMouseEnter={() => setDropdownOpen(id)}
        onMouseLeave={() => setDropdownOpen(id)}
      >
        <button
          className={`dropdown-toggle ${dropdownOpen === id ? "active" : ""}`}
          onClick={() => toggleDropdown(id)}
        >
          {icon} {label} <ChevronDown size={12} className="dropdown-arrow" />
        </button>
        {dropdownOpen === id && (
          <ul
            className="dropdown-menu"
            onMouseEnter={() => setDropdownOpen(id)}
            onMouseLeave={() => setDropdownOpen(id)}
          >
            {links.map((link, idx) => (
              <li key={idx} className={link.to === location.pathname ? "active-link" : ""}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <header className={`header-alt ${scrolled ? "shrink" : ""}`} ref={navRef}>
      <div className="header-top">
        <div className="logo">
          <Link to="/">GordiusApp</Link>
        </div>

        <nav className={`nav-tabs ${tickerVisible ? "show" : "hide"}`}>
          {renderDropdown("home", <Home size={16} />, "Home", [
            { to: "/", label: "Main Home" },
            { to: "/gordius", label: "Gordius Home" },
            { to: "/task-manager", label: "Task Manager" },
          ])}

          {user && (
            <>

              {renderDropdown("apps", <Grid size={16} />, "MyApps", [
                { to: "/apps/notesapp", label: "Notes & Docs" },
                { to: "/apps/todo/inbox", label: "Todos & Planner" },
                { to: "/apps/task-manager/tasks", label: "Task Manager" },
                { to: "/apps/trello", label: "Trello Board" },
              ])}

              {renderDropdown("templates", <FileText size={16} />, "Templates", [
                { to: "/create-banner-new", label: "Create Banner New" },
                { to: "/banners", label: "Banners" },
                { to: "/banner-maker", label: "Banner Maker" },
                { to: "/banner-templates", label: "Banner Templates" },
                { to: "/text-editor", label: "Text Editor" },
              ])}

              {renderDropdown("designs", <Palette size={16} />, "Designs", [
                { to: "/create-template", label: "Create Template" },
                { to: "/create-email-template", label: "Email Template Editor" },
                { to: "/send-newsletter", label: "Send Newsletter" },
                { to: "/email-templates", label: "Email Templates" },
                { to: "/designs/canva-home", label: "Canva" },
                
              ])}

              {renderDropdown(
                "communication",
                <MessageCircle size={16} />,
                "Communication",
                [
                  { to: "/whatsapp", label: "WhatsApp" },
                  { to: "/whatsapp/sender", label: "WhatsApp Sender" },
                  { to: "/whatsapp-sender", label: "WhatsApp Message Sender" },
                ]
              )}
            </>
          )}

          {/* Blogs Dropdown with Role-Based Links */}
          {renderDropdown(
            "blogs",
            <FileText size={16} />,
            "Blogs",
            user
              ? user.role === "admin"
                ? [
                    { to: "/admin/dashboard/add-post", label: "Add Post" },
                    { to: "/admin/dashboard/all-posts", label: "All Posts" },
                  ]
                : user.role === "author"
                ? [
                    { to: "/author/dashboard/add-post", label: "Add Post" },
                    { to: "/author/dashboard/all-posts", label: "All Posts" },
                  ]
                : [{ to: "/user/all-posts", label: "Posts List" }]
              : [{ to: "/user/all-posts", label: "Posts List" }]
          )}
        </nav>

        <div className={`header-buttons ${tickerVisible ? "show" : "hide"}`}>
          {user ? (
            <>
              <span className="username">👋 {user.username}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
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
      </div>

      {location.pathname === "/" && tickerVisible && <Ticker />}
    </header>
  );
};

export default Header;


/*
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Grid, FileText, Palette, FolderKanban, Home, ChevronRight, MessageCircle } from "lucide-react";
import { logoutRequest } from "../../api/newRequest";
import Ticker from "./Ticker";
import "./Header.css";

const Header = ({ user, setUser }) => {
  const location = useLocation();
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

  const noHeaderPaths = ["/login", "/register", "/verify-email"];
  const showHeader = !noHeaderPaths.includes(location.pathname);

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

  const handleLogout = async () => {
    try { await logoutRequest(); } catch (e) { console.warn(e.message); }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
  };

  if (!showHeader) return null;

  return (
    <header className={`header-alt ${scrolled ? "shrink" : ""}`} ref={navRef}>
      <div className="header-top">
        <div className="logo">
          <Link to="/">Gordius WebApp</Link>
        </div>

        <nav className={`nav-tabs ${tickerVisible ? "show" : "hide"}`}>
       
          <div className="dropdown">
            <button className="dropdown-toggle"><Home size={16} /> Home</button>
            <ul className="dropdown-menu">
              <li><Link to="/">Main Home</Link></li>
              <li><Link to="/gordius">Gordius Home</Link></li>
            </ul>
          </div>

          {user && (
            <>
            
              <div className="dropdown">
                <button className="dropdown-toggle"><FolderKanban size={16} /> Projects</button>
                <ul className="dropdown-menu">
                  <li><Link to="/task-manager">Task Manager</Link></li>
                  <li><Link to="/project-manager">Project Manager</Link></li>
                  <li><Link to="/channel-manager">Channel Manager</Link></li>
                  <li><Link to="/author/project-manager">Author Projects</Link></li>
                </ul>
              </div>

       
              <div className="dropdown">
                <button className="dropdown-toggle"><Grid size={16} /> MyApps</button>
                <ul className="dropdown-menu">
          
                  <li className="submenu">
                    <button>Notes & Docs <ChevronRight size={14} /></button>
                    <ul className="sub-menu">
                      <li><Link to="/apps/notesapp">Notes App</Link></li>
                    </ul>
                  </li>
                 
                  <li className="submenu">
                    <button>Todos & Planner <ChevronRight size={14} /></button>
                    <ul className="sub-menu">
                      <li><Link to="/apps/todo/inbox">Inbox</Link></li>
                      <li><Link to="/apps/todo/today">Today</Link></li>
                      <li><Link to="/apps/todo/week">This Week</Link></li>
                      <li><Link to="/apps/todo/add-todos">Add Todo</Link></li>
                    </ul>
                  </li>
          
                  <li className="submenu">
                    <button>Task Manager <ChevronRight size={14} /></button>
                    <ul className="sub-menu">
                      <li><Link to="/apps/task-manager/tasks">Tasks</Link></li>
                      <li><Link to="/apps/task-manager/trashed">Trashed</Link></li>
                    </ul>
                  </li>
                 
                  <li className="submenu">
                    <button>Trello Board <ChevronRight size={14} /></button>
                    <ul className="sub-menu">
                      <li><Link to="/apps/trello">Trello Dashboard</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>

            
              <div className="dropdown">
                <button className="dropdown-toggle"><FileText size={16} /> Templates</button>
                <ul className="dropdown-menu">
                  <li><Link to="/banner-main">Banner Main</Link></li>
                  <li><Link to="/create-banner">Create Banner</Link></li>
                  <li><Link to="/create-banner-new">Create Banner New</Link></li>
                  <li><Link to="/create-banner-alt">Create Banner Alt</Link></li>
                  <li><Link to="/create-banner-ad">Create Banner Advanced</Link></li>
                  <li><Link to="/banner-maker">Banner Maker</Link></li>
                  <li><Link to="/banner-templates">Banner Templates</Link></li>
                  <li><Link to="/text-editor">Text Editor</Link></li>
                </ul>
              </div>

             
              <div className="dropdown">
                <button className="dropdown-toggle"><Palette size={16} /> Designs</button>
                <ul className="dropdown-menu">
                  <li><Link to="/create-template">Create Template</Link></li>
                  <li><Link to="/create-email-template">Email Template Editor</Link></li>
                  <li><Link to="/send-newsletter">Send Newsletter</Link></li>
                  <li><Link to="/email-templates">Email Templates</Link></li>
                </ul>
              </div>

              
              <div className="dropdown">
                <button className="dropdown-toggle"><MessageCircle size={16} /> Communication</button>
                <ul className="dropdown-menu">
                  <li><Link to="/whatsapp">WhatsApp</Link></li>
                  <li><Link to="/whatsapp/sender">WhatsApp Sender</Link></li>
                  <li><Link to="/whatsapp-sender">WhatsApp Message Sender</Link></li>
                </ul>
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

      {location.pathname === "/" && tickerVisible && <Ticker />}
    </header>
  );
};

export default Header;
*/

