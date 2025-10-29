// src/author/components/SidebarTabs.jsx
// src/author/components/SidebarTabs.jsx
// src/author/components/SidebarTabs.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Users,
  Heart,
  Star,
  Bell,
  BookOpen,
  FileText,
  MessageCircle,
  Layers,
  Briefcase,
} from "lucide-react";
import "./SidebarTabs.css"; // ✅ optional custom CSS

// ✅ Menu config mapped to AuthorRoutes.jsx
const menuItems = [
  { path: "/author/dashboard/profile", label: "User Profile", icon: <User size={16} /> },
  { path: "/author/dashboard/allCategories", label: "All Categories", icon: <Layers size={16} /> },
  { path: "/author/dashboard/myBlogs", label: "My Blogs", icon: <BookOpen size={16} /> },
  { path: "/author/dashboard/myPosts", label: "My Blog Posts", icon: <FileText size={16} /> },
  { path: "/author/dashboard/allPosts", label: "All Blog Posts", icon: <FileText size={16} /> },
  { path: "/author/dashboard/comments", label: "Comments", icon: <MessageCircle size={16} /> },
  { path: "/author/dashboard/likes", label: "My Likes", icon: <Heart size={16} /> },
  { path: "/author/dashboard/favorites", label: "Favorited", icon: <Star size={16} /> },
  { path: "/author/dashboard/subscriptions", label: "Subscriptions", icon: <Users size={16} /> },
  { path: "/author/dashboard/notifications", label: "Notifications", icon: <Bell size={16} /> },
  { path: "/author/dashboard/project-manager", label: "Project Manager", icon: <Briefcase size={16} /> },
];

const SidebarTabs = ({ isExpanded = true }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`author-sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <nav className="author-sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`author-sidebar-link ${isActive(item.path) ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            {isExpanded && <span className="label">{item.label}</span>}
            {!isExpanded && (
              <div className="tooltip-float">{item.label}</div>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarTabs;



