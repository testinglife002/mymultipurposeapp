// AppNavbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import "./AppNavbar.css";

const AppNavbar = ({ showAddProjectModal, showAddTaskModal }) => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="navbar-toolbar">
        <Typography variant="h6" className="navbar-brand">
          Task Manager
        </Typography>
        <div className="navbar-actions">
          <Button variant="outlined" size="small" onClick={showAddProjectModal}>
            + Add Project
          </Button>
          <Button variant="outlined" size="small" onClick={showAddTaskModal}>
            + Add Task
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
