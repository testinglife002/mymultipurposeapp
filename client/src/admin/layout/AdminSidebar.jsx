// src/admin/components/AdminSidebar.jsx
// src/admin/components/AdminSidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBriefcase,
  FiFolderPlus,
  FiList,
  FiGitBranch,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import "./AdminSidebar.css";

const AdminSidebar = ({ isExpanded, setIsExpanded }) => {
  const [openMenu, setOpenMenu] = useState({});
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const toggleMenu = (key) =>
    setOpenMenu((prev) => ({ ...prev, [key]: !prev[key] }));

  // ✅ Menu config directly tied to AdminRoutes
  const menuItems = [
    {
      label: "Dashboard",
      icon: <FiHome />,
      path: "/admin/dashboard", // direct link
    },
    {
      label: "Project Manager",
      icon: <FiBriefcase />,
      path: "/admin/dashboard/project-manager",
    },
    {
      label: "Channel Manager",
      icon: <FiBriefcase />,
      path: "/admin/dashboard/channel-manager",
    },
    {
      label: "Categories",
      icon: <FiFolderPlus />,
      submenu: [
        { label: "Add Category", path: "/admin/dashboard/add-category" },
        { label: "Add Category UI", path: "/admin/dashboard/add-category-ui" },
        { label: "Categories List", path: "/admin/dashboard/categories-list" },
        { label: "All Category", path: "/admin/dashboard/all-category" },
        { label: "Category Manager Alt", path: "/admin/dashboard/category-manager-alt" },
      ],
    },
    {
      label: "Settings",
      icon: <FiSettings />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <aside className={`admin-sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div
        className="admin-sidebar-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="logo">{isExpanded ? "Admin" : "A"}</span>
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="admin-sidebar-item">
            {/* Direct link (no submenu) */}
            {!item.submenu && (
              <Link
                to={item.path}
                className={`admin-sidebar-link ${
                  isActive(item.path) ? "active" : ""
                }`}
              >
                <span className="icon">{item.icon}</span>
                {isExpanded && <span className="label">{item.label}</span>}
                {!isExpanded && <div className="tooltip-float">{item.label}</div>}
              </Link>
            )}

            {/* Link with submenu */}
            {item.submenu && (
              <>
                <div
                  className={`admin-sidebar-link ${
                    openMenu[item.label] ? "open" : ""
                  }`}
                  onClick={() => toggleMenu(item.label)}
                >
                  <span className="icon">{item.icon}</span>
                  {isExpanded && <span className="label">{item.label}</span>}
                  {isExpanded && (
                    <FiChevronDown
                      className={`chevron ${
                        openMenu[item.label] ? "rotate" : ""
                      }`}
                    />
                  )}
                  {!isExpanded && (
                    <div className="tooltip-float">{item.label}</div>
                  )}
                </div>

                <div
                  className={`admin-submenu ${
                    openMenu[item.label] ? "open" : ""
                  }`}
                  style={{
                    maxHeight: openMenu[item.label]
                      ? `${item.submenu.length * 40}px`
                      : "0px",
                  }}
                >
                  {item.submenu.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.path}
                      className={`admin-submenu-item ${
                        isActive(sub.path) ? "active" : ""
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;




