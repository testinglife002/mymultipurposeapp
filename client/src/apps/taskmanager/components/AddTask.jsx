import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button as MuiButton,
  Chip,
  IconButton,
} from "@mui/material";
import { BiImages } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import ModalWrapper from "./ModalWrapper";
import UserListAlt from "./UserListAlt";
import SelectList from "./SelectList";
import SubTaskModal from "./SubTaskModal";
import newRequest from "../../../api/newRequest";
import "./AddTask.css";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, users = [], refresh, fetchTasks }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    start: "",
    projectId: "",
  });
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Subtask modal
  const [subTaskModalOpen, setSubTaskModalOpen] = useState(false);
  const [subTasks, setSubTasks] = useState([]);

  // ✅ Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectAssets = (e) => {
    setAssets([...e.target.files]);
  };

  const handleSubTaskAdded = (subtask) => {
    setSubTasks((prev) => [...prev, subtask]);
  };

  const handleRemoveSubtask = (index) => {
    setSubTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description || "",
        projectId: formData.projectId || null,
        date: formData.date,
        start: formData.start,
        stage,
        priority,
        team,
      };

      const res = await newRequest.post("/tasks/create", payload);
      const newTask = res.data.task;

      // Add subtasks if any
      if (subTasks.length > 0) {
        await Promise.all(
          subTasks.map((subtask) =>
            newRequest.post(`/tasks/${newTask._id}/subtasks`, subtask)
          )
        );
      }

      if (refresh) refresh();
      if (fetchTasks) fetchTasks();
      setFormData({
        title: "",
        description: "",
        date: "",
        start: "",
        projectId: "",
      });
      setTeam([]);
      setStage(LISTS[0]);
      setPriority(PRIORITY[2]);
      setAssets([]);
      setSubTasks([]);
      setOpen(false);
    } catch (err) {
      console.error("❌ Error creating task:", err);
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen} title="Add / Create Task">
      <form onSubmit={submitHandler} className="addtask-form">
        <div className="form-body">
          {/* Title */}
          <TextField
            fullWidth
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-field"
          />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-field"
          />

          {/* Project */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              label="Project"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {projects.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Assigned Team */}
          <UserListAlt setTeam={setTeam} team={team} allUsers={users} />

          {/* Stage & Date */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start"
                name="start"
                InputLabelProps={{ shrink: true }}
                value={formData.start}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Priority & File Upload */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <SelectList
                label="Priority Level"
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label htmlFor="imgUpload" className="upload-label">
                <BiImages size={24} />
                <span>Add Assets</span>
              </label>
              <input
                type="file"
                id="imgUpload"
                className="file-input"
                onChange={handleSelectAssets}
                accept=".jpg,.png,.jpeg"
                multiple
              />
            </Grid>
          </Grid>
        </div>

        {/* Subtasks */}
        <div style={{ marginTop: "1rem" }}>
          <h4>Subtasks</h4>
          <Grid container spacing={1} alignItems="center">
            {subTasks.map((st, index) => (
              <Grid item key={index}>
                <Chip
                  label={`${st.title}${st.tag ? ` (${st.tag})` : ""}`}
                  onDelete={() => handleRemoveSubtask(index)}
                />
              </Grid>
            ))}
            <Grid item>
              <IconButton onClick={() => setSubTaskModalOpen(true)}>
                <IoMdAddCircleOutline />
              </IconButton>
            </Grid>
          </Grid>
        </div>

        {/* Buttons */}
        <div className="form-footer" style={{ marginTop: "1rem" }}>
          {uploading ? (
            <span className="uploading-text">Uploading assets...</span>
          ) : (
            <>
              <MuiButton type="submit" variant="contained" color="primary">
                Submit
              </MuiButton>
              <MuiButton
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </MuiButton>
            </>
          )}
        </div>
      </form>

      {/* Subtask Modal */}
      <SubTaskModal
        open={subTaskModalOpen}
        setOpen={setSubTaskModalOpen}
        onSubTaskAdded={handleSubTaskAdded}
      />
    </ModalWrapper>
  );
};

export default AddTask;
