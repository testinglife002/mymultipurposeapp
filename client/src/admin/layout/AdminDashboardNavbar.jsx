// src/admin/components/AdminDashboardNavbar.jsx
import React, { useState } from 'react';
import { FaHome, FaLink, FaChevronDown, FaChevronRight, FaSearch } from 'react-icons/fa';
import './AdminDashboardNavbar.css';

const AdminDashboardNavbar = ({ isSidebarExpanded }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav style={{marginRight:'3 0%', width:'80%'}} className={`admin-dashboard-topbar ${!isSidebarExpanded ? 'collapsed' : ''}`}>

      <div className="admin-dashboard-navbar-left"  >
        <span className="admin-dashboard-navbar-brand" >Gordius App</span>
      </div>

      <div className="admin-dashboard-navbar-center">
        <input type="text" placeholder="Search..." className="admin-dashboard-search-input"/>
        <button className="admin-dashboard-search-btn"><FaSearch /></button>
      </div>

      <div className="admin-dashboard-navbar-right">
        <div className="admin-dashboard-nav-link">Home</div>
        <div className="admin-dashboard-nav-link">Link</div>
        <div
          className="admin-dashboard-nav-link dropdown"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          Dropdown {isDropdownOpen ? <FaChevronDown /> : <FaChevronRight />}
          {isDropdownOpen && (
            <div className="admin-dashboard-dropdown-menu">
              <div className="admin-dashboard-dropdown-item">Action</div>
              <div className="admin-dashboard-dropdown-item">Another Action</div>
              <div className="admin-dashboard-dropdown-divider"></div>
              <div className="admin-dashboard-dropdown-item">Something else</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminDashboardNavbar;

