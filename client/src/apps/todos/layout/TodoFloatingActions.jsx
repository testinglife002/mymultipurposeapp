// src/layout/TodoFloatingActions.jsx
import React, { useState } from "react";
import { Fab, Menu, MenuItem } from "@mui/material";
import { Plus, FileText, Tag, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TodoFloatingActions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div style={{ position: "fixed", bottom: 30, right: 30 }}>
      <Fab color="primary" onClick={handleClick}>
        <Plus />
      </Fab>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => navigate("/apps/todo/add-todos")}>
          <ClipboardList size={18} className="me-2" /> Add Todo
        </MenuItem>
        <MenuItem onClick={() => navigate("/add-note")}>
          <FileText size={18} className="me-2" /> Add Note
        </MenuItem>
        <MenuItem onClick={() => navigate("/add-tag")}>
          <Tag size={18} className="me-2" /> Add Tag
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TodoFloatingActions;