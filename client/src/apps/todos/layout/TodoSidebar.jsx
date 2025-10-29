// src/layout/TodoSidebar.jsx
import React, { useState } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { LayoutGrid, Calendar, Inbox, ListTodo, Tag } from "lucide-react";
 import "./TodoSidebar.css";
import { NavLink } from "react-router-dom";

export default function TodoSidebar({ isExpanded, toggleExpand }) {
  const [isHovered, setIsHovered] = useState(false);
  const expanded = isExpanded || isHovered;

  return (
    <aside
      className={`todo-sidebar ${expanded ? "open" : "collapsed"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => !isExpanded && setIsHovered(false)}
    >

    <div style={{ backgroundColor: '#2196f3', marginBottom:'10%'}} >

    {/*<div className="todo-sidebar-header">
        <Tooltip title={expanded   ? "Collapse" : "Expand"} placement="right">
          <IconButton onClick={toggleExpand} className="toggle-btn">
            <LayoutGrid size={20} />
          </IconButton>
        </Tooltip>
      </div>*/}

    <div className="todo-sidebar-inner">
      {/* Toggle Button */}
      <div className="todo-sidebar-header">
        <button className="todo-toggle-btn" onClick={toggleExpand} title="Toggle Sidebar">
          <LayoutGrid size={18} />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="todo-sidebar-nav">
        <NavLink to="/apps/todo/inbox" className="todo-nav-item">
          <Inbox size={18} />
          {expanded && <span>Inbox</span>}
        </NavLink>

        <NavLink to="/apps/todo/today" className="todo-nav-item">
          <Calendar size={18} />
          {expanded && <span>Today</span>}
        </NavLink>

        <NavLink to="/apps/todo/week" className="todo-nav-item">
          <Calendar size={18} />
          {expanded && <span>This Week</span>}
        </NavLink>

        <NavLink to="/apps/todo/calendar" className="todo-nav-item">
          <Calendar size={18} />
          {expanded && <span>Calendar</span>}
        </NavLink>

        <NavLink to="/apps/todo/all" className="todo-nav-item">
          <ListTodo size={18} />
          {expanded && <span>All Todos</span>}
        </NavLink>

        <NavLink to="/apps/todo/tags" className="todo-nav-item">
          <Tag size={18} />
          {expanded && <span>Tags</span>}
        </NavLink>
      </nav>

      {/* Example Tabs Section (like SubSidebar) */}
      <div className="todo-sidebar-tabs">
        {expanded ? (
          <>
            <div className="todo-tabs-header">Quick Actions</div>
            <div className="todo-tabs">
              <button className="todo-tab active">🏠 Overview</button>
              <button className="todo-tab">📋 New Task</button>
              <button className="todo-tab">⚙ Settings</button>
            </div>
          </>
        ) : (
          <div className="todo-sidebar-icons">
            <button title="Overview">🏠</button>
            <button title="New Task">📋</button>
            <button title="Settings">⚙</button>
          </div>
        )}
      </div>

    </div>
    </div>
    </aside>
  );
};

// export default TodoSidebar;
