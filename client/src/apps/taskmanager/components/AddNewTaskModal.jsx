// AddNewTaskModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import newRequest from "../../../api/newRequest";
import UserListAlt from "./UserListAlt";
import "./TaskModal.css";

const AddNewTaskModal = ({ show, handleClose, users = [], onTaskCreated }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    stage: "todo",
    date: "",
    priority: "normal",
    team: [],
    assets: [],
  });

  const [team, setTeam] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssetsChange = (e) => {
    const assetsArray = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setForm((prev) => ({ ...prev, assets: assetsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form, team };
      const res = await newRequest.post("/tasks/create", payload);

      if (onTaskCreated) onTaskCreated(res.data);

      setForm({
        title: "",
        stage: "todo",
        date: "",
        priority: "normal",
        team: [],
        assets: [],
      });
      setTeam([]);
      handleClose();
    } catch (error) {
      console.error("Error creating new task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      className="task-modal"
    >
      <DialogTitle>Add New Task</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
          />

          <div className="form-row">
            <FormControl fullWidth margin="dense">
              <InputLabel>Stage</InputLabel>
              <Select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                label="Stage"
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <TextField
            label="Due Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />

          {/* Assign Team Members */}
          <UserListAlt setTeam={setTeam} team={team} allUsers={users} />

          <TextField
            label="Assets (comma-separated URLs)"
            name="assets"
            fullWidth
            margin="dense"
            onChange={handleAssetsChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Add Task"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddNewTaskModal;
