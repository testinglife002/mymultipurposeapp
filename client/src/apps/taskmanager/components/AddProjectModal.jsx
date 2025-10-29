// AddProjectModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import newRequest from "../../../api/newRequest";
import "./AddProjectModal.css";

const AddProjectModal = ({ show, handleClose, onAdd }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const optionId = null;
      const res = await newRequest.post("/projects", { name, optionId });
      onAdd(res.data);
      alert("Project created!");
      setName("");
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Project</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProjectModal;
