// user/UserDashboardLayout.jsx
// src/user/UserDashboardLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  User, Users, Heart, Star, Bell, BookOpen, FileText,
  MessageCircle, Layers, ChevronDown, Menu, LogOut, LogIn, UserPlus
} from "lucide-react";
import { logoutRequest } from "../api/newRequest"; // same API call as in Header
import "./UserDashboardLayout.css";

// Components
import UserProfile from "./components/UserProfile";
import DisplayUserBlogs from "./components/DisplayUserBlogs";
import AllBlogPosts from "./components/AllBlogPosts";
import CommentsOnMyPosts from "./components/CommentsOnMyPosts";
import MyLikes from "./components/MyLikes";
import MyFavorites from "./components/MyFavorites";
import MySubscriptions from "./components/MySubscriptions";
import AllCategories from "./components/AllCategories";
import MyBlogs from "./components/MyBlogs";
import MyNotifications from "./components/MyNotifications";
import AllPostsList from "./pages/AllPostsList";
import ProjectManager from "./pages/ProjectManager";
import Post from "../admin/pages/Post";


const secondaryTabs = [
  { path: "profile", label: "User Profile", icon: <User size={16} /> },
  { path: "allCategories", label: "All Categories", icon: <Layers size={16} /> },
  { path: "myBlogs", label: "My Blogs", icon: <BookOpen size={16} /> },
  { path: "myPosts", label: "My Blog Posts", icon: <FileText size={16} /> },
  { path: "allPosts", label: "All Blog Posts", icon: <FileText size={16} /> },
  { path: "comments", label: "Comments", icon: <MessageCircle size={16} /> },
  { path: "likes", label: "My Likes", icon: <Heart size={16} /> },
  { path: "favorites", label: "Favorited", icon: <Star size={16} /> },
  { path: "subscriptions", label: "Subscriptions", icon: <Users size={16} /> },
  { path: "notifications", label: "Notifications", icon: <Bell size={16} /> },
];

const UserDashboardLayout = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const isActive = (path) => path === currentPath;

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.warn("Logout API failed:", e.message);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="user-dashboard-layout">
      {/* Sidebar */}
      <aside className={`user-main-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="user-sidebar-header">
          {sidebarOpen && <h3 className="user-sidebar-title">Dashboard</h3>}
          <button className="user-sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>

        {/* User Avatar / Auth Section */}
        <div
          className={`user-sidebar-avatar ${sidebarOpen ? "expanded" : "collapsed"}`}
          onClick={() => setAvatarDropdown(!avatarDropdown)}
        >
          {user ? (
            <>
              <img
                src={user.profilePic || "https://i.pravatar.cc/50"}
                alt="User Avatar"
              />
              {sidebarOpen && <span className="username">{user.username}</span>}
              {sidebarOpen && <ChevronDown size={14} />}
            </>
          ) : (
            <>
              <User size={28} />
              {sidebarOpen && <span className="username">Guest</span>}
            </>
          )}
        </div>

        {/* Dropdown for logged-in user */}
        {user && avatarDropdown && sidebarOpen && (
          <div className="user-avatar-dropdown">
            <Link to="/user/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}

        {/* Login/Register for non-logged-in users */}
        {!user && sidebarOpen && (
          <div className="user-auth-links">
            <Link to="/login" className="auth-link">
              <LogIn size={14} /> Login
            </Link>
            <Link to="/register" className="auth-link">
              <UserPlus size={14} /> Register
            </Link>
          </div>
        )}

        {/* Sidebar Links */}
        <ul className="sidebar-links">
          <li>
            <Link to="/user/profile">
              <span className="link-icon"><User size={18} /></span>
              {sidebarOpen && <span className="link-text">Profile</span>}
            </Link>
          </li>
          <li>
            <Link to="/user/myBlogs">
              <span className="link-icon"><BookOpen size={18} /></span>
              {sidebarOpen && <span className="link-text">My Blogs</span>}
            </Link>
          </li>
          <li>
            <Link to="/user/allPosts">
              <span className="link-icon"><FileText size={18} /></span>
              {sidebarOpen && <span className="link-text">All Posts</span>}
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Dashboard Area */}
      <div className="user-dashboard-right">
        <div className="user-secondary-wrapper">
          <nav ref={secRef} className={`user-secondary-sidebar ${scrollShadow ? "shadow" : ""}`}>
            {secondaryTabs.map(tab => (
              <Link
                key={tab.path}
                to={`/user/${tab.path}`}
                className={`user-secondary-tab ${isActive(tab.path) ? "active" : ""}`}
              >
                <span className="user-tab-icon">{tab.icon}</span>
                <span className="user-tab-label">{tab.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <main className="user-dashboard-content">
          <Routes>
            <Route path="" element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="allCategories" element={<AllCategories />} />
            <Route path="myBlogs" element={<MyBlogs />} />
            <Route path="myPosts" element={<DisplayUserBlogs />} />
            <Route path="allPosts" element={<AllBlogPosts />} />
            <Route path="comments" element={<CommentsOnMyPosts />} />
            <Route path="likes" element={<MyLikes />} />
            <Route path="favorites" element={<MyFavorites />} />
            <Route path="subscriptions" element={<MySubscriptions />} />
            <Route path="notifications" element={<MyNotifications />} />
            <Route path="all-posts" element={<AllPostsList user={user} />} />
            <Route path="post/:slug" element={<Post user={user} />} />
            <Route path="project-manager" element={user && <ProjectManager user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;



