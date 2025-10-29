// AddTaskModal.jsx
import React, { useState, useEffect } from "react";
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

const AddTaskModal = ({ show, handleClose, users = [] }) => {

  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    stage: "todo",
    date: "",
    priority: "normal",
    team: [],
    assets: [],
    projectId: "",
  });

  const teamUsers = users;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects/my-projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

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
      await newRequest.post("/tasks/create", payload);

      setForm({
        title: "",
        stage: "todo",
        date: "",
        priority: "normal",
        team: [],
        assets: [],
        projectId: "",
      });
      setTeam([]);
      handleClose();
    } catch (error) {
      console.error("Create Task Error:", error);
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
      <DialogTitle>Create / Add Task</DialogTitle>

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
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              label="Project"
              required
            >
              <MenuItem value="">-- Select Project --</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Assign Team Members */}
          <UserListAlt setTeam={setTeam} team={team} allUsers={teamUsers} />

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
            {loading ? <CircularProgress size={20} /> : "Create Task"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTaskModal;
