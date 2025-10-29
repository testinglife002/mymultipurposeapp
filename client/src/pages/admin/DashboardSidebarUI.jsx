// frontend/src/pages/admin/DashboardSidebarUI.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Home, Settings, FileText, Layers, Menu } from 'lucide-react';
import './DashboardSidebarUI.css';

const menuStructure = [
  { key: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: <Home size={18} />, sub: [
    { name: 'Main Panel', path: '/dashboard/main' },
    { name: 'Stats Panel', path: '/dashboard/stats' },
  ]},
  { key: 'categories', name: 'Category', path: '/dashboard/categories', icon: <Layers size={18} />, sub: [
    { name: 'All Category', path: '/dashboard/all-category' },
    { name: 'Add Category', path: '/dashboard/add-category' },
  ]},
  { key: 'posts', name: 'Posts', path: '/dashboard/posts', icon: <FileText size={18} />, sub: [
    { name: 'All Posts', path: '/dashboard/all-posts' },
    { name: 'Add Post', path: '/dashboard/add-post' },
  ]},
  { key: 'settings', name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} />, sub: [
    { name: 'Profile', path: '/dashboard/profile' },
    { name: 'Security', path: '/dashboard/security' },
  ]}
];

const DashboardSidebarUI = ({ isExpanded, setIsExpanded }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isExpanded && <h2>Admin</h2>}
        <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
          <Menu size={20} />
        </button>
      </div>

      <nav className="menu">
        {menuStructure.map(menu => (
          <div key={menu.key} className="menu-item">
            <div
              className={`menu-title ${isActive(menu.path) ? 'active' : ''}`}
              onClick={() => menu.sub ? toggleMenu(menu.key) : null}
            >
              <span className="menu-icon">{menu.icon}</span>
              {isExpanded && <span>{menu.name}</span>}
              {menu.sub && isExpanded && (
                <span className="menu-arrow">
                  {openMenus[menu.key] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                </span>
              )}
            </div>
            {menu.sub && (
              <div className={`submenu ${openMenus[menu.key] ? 'open' : ''}`}>
                {menu.sub.map(sub => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive: active }) => `submenu-item ${active ? 'active' : ''}`}
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebarUI;