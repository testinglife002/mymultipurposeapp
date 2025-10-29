// src/admin/components/AdminHeader.jsx
// src/admin/components/AdminHeader.jsx
import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import './AdminHeader.css';
import { FiMenu } from 'react-icons/fi';

const AdminHeader = ({ toggleSidebar, user }) => {
  return (
    <header className="admin-header"  >
      <div className="admin-header-left">
        <button className="admin-sidebar-toggle-btn" onClick={toggleSidebar}>
          <FaBars size={18} />
        </button>
        
        {/*<button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>
          <FiMenu />
        </button>*/}

        <h1 className="admin-header-title">Gordius Dashboard</h1>
      </div>

      <div className="admin-header-right">
        <div className="admin-header-icon tooltip" data-tooltip="Notifications">
          <FaBell size={18} />
        </div>
        <div className="admin-header-user tooltip" data-tooltip={user ? user.displayName : 'Guest'}>
          <FaUserCircle size={20} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;






