// src/apps/todos/layout/TodoLayout.jsx
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import { Outlet, Link } from "react-router-dom";
import TodoSidebar from "./TodoSidebar";
import TodoFloatingActions from "./TodoFloatingActions";
import "./TodoLayout.css";
import TodoHeader from "./TodoHeader";

const TodoLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    JSON.parse(localStorage.getItem("sidebarExpanded")) ?? true
  );
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isSidebarExpanded);
  }, [isSidebarExpanded]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div className="todo-layout">
      
      {/*<TodoSidebar
        isExpanded={isSidebarExpanded}
        toggleExpand={() => setIsSidebarExpanded((prev) => !prev)}
      />*/}

      <div className="main-area">
        {/* Header  
        <div   >
          <AppBar position="sticky" elevation={1} sx={{ background: "#1976d2" }} 
          >
          <Toolbar className="toolbar">
            <IconButton color="inherit" edge="start" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              🧠 SmartTodo
            </Typography>
            <div>
              <IconButton size="large" color="inherit" onClick={handleMenu}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        </div>
       */}

       <TodoHeader />

        {/* Main Content */}
        <div className="main-content">
          <Outlet /> {/* Renders active route */}
        </div>

        <TodoFloatingActions />
      </div>
    </div>
  );
};

export default TodoLayout;