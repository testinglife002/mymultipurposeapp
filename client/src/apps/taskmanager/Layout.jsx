// apps/taskmanager/Layout.jsx
// apps/taskmanager/Layout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TaskSidebar from "./components/TaskSidebar";
import TaskHeader from "./components/TaskHeader";
import "./Layout.css";

export default function Layout({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  if (!user) {
    // return <Navigate to="/log-in" state={{ from: location }} replace />;
  }

  return (
    <div className="task-layout">
      
   
      <div className="task-main">
        <TaskHeader
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="task-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

