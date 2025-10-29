// frontend/src/pages/admin/AdminPanel.jsx
import React, { useState } from 'react';
import DashboardSidebarUI from './DashboardSidebarUI';
import SingleSubcategoryManager from './SingleSubcategoryManager';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="admin-dashboard">
      <DashboardSidebarUI isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      <div className={`main-content ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
        <header className="dashboard-header">
          <button
            className="toggle-sidebar-btn"
            onClick={() => setIsSidebarExpanded(prev => !prev)}
          >
            ☰
          </button>
          <h1>Admin Dashboard</h1>
        </header>

        <div className="dashboard-body">
          <SingleSubcategoryManager />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


