// admin/layout/AdminLayout.jsx
// src/admin/layout/AdminLayout.jsx
// src/admin/layout/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminDashboardNavbar from "./AdminDashboardNavbar";

const AdminLayout = ({  user }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  const sidebarWidth = isSidebarExpanded ? 220 : 60;

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <AdminHeader toggleSidebar={toggleSidebar} user={user} />

      {/* Sidebar */}
      <AdminSidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content */}
      <div
        className="admin-main-content"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          user={user}
          isSidebarExpanded={isSidebarExpanded}
        />

        {/*<AdminDashboardNavbar isSidebarExpanded={isSidebarExpanded} />*/}

        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
