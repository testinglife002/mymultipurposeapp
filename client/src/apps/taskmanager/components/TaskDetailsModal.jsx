import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Divider,
  Box,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { AiFillFilePdf } from "react-icons/ai";
import { BiImages } from "react-icons/bi";
import { MdClose, MdContentCopy } from "react-icons/md";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import newRequest from "../../../api/newRequest";
import "./TaskDetailsModal.css";
import SubTaskModal from "./SubTaskModal";

dayjs.extend(relativeTime);

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const TaskDetailsModal = ({ show, onHide, task, onUpdate, users = [], projects = [] }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    stage: LISTS[0],
    priority: PRIORITY[2],
    date: "",
    start: "",
    team: [],
    assets: [],
  });
  const [loading, setLoading] = useState(false);
  const [timerText, setTimerText] = useState("");

  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const [subTasks, setSubTasks] = useState([]);

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        projectId: task.projectId || "",
        stage: task.stage?.toUpperCase() || LISTS[0],
        priority: task.priority?.toUpperCase() || PRIORITY[2],
        date: task.date ? dayjs(task.date).format("YYYY-MM-DD") : "",
        start: task.start ? dayjs(task.start).format("YYYY-MM-DDTHH:mm") : "",
        team: task.team?.map((u) => u._id) || [],
        assets: task.assets || [],
      });
      setSubTasks(task.subTasks || []);
      updateTimer();
    }
  }, [task]);

  useEffect(() => {
    if (!task) return;
    const interval = setInterval(updateTimer, 30000);
    return () => clearInterval(interval);
  }, [task]);

  const updateTimer = () => {
    if (!task) return;
    const now = dayjs();
    const start = task.start ? dayjs(task.start) : null;
    const due = task.date ? dayjs(task.date) : null;

    let text = "";
    if (start && start.isAfter(now)) text = `🕒 Starts ${now.to(start)}`;
    else if (due && due.isAfter(now)) text = `⏳ Due ${now.to(due)}`;
    else if (due && due.isBefore(now)) text = `⚠️ Overdue by ${due.to(now)}`;
    setTimerText(text);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, assets: [...prev.assets, ...files] }));
  };

  const handleRemoveFile = (index) => {
    setForm((prev) => {
      const updated = [...prev.assets];
      updated.splice(index, 1);
      return { ...prev, assets: updated };
    });
  };

  const handleUpdate = async () => {
    if (!task?._id) return;
    setLoading(true);
    try {
      const payload = { ...form };
      const res = await newRequest.put(`/tasks/update/${task._id}`, payload);
      if (res.data?.status) {
        onUpdate?.();
        onHide();
      }
    } catch (err) {
      console.error("❌ Update task error:", err);
      alert("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!task?._id) return;
    try {
      const res = await newRequest.post(`/tasks/duplicate/${task._id}`);
      if (res.data?.status) {
        alert("Task duplicated successfully!");
        onUpdate?.();
      }
    } catch (err) {
      console.error("❌ Duplicate task error:", err);
      alert("Failed to duplicate task.");
    }
  };

  const handleSubtaskAdded = (updatedSubtasks) => {
    setSubTasks(updatedSubtasks);
  }

  if (!task) return null;

  return (
    <Dialog
      open={show}
      onClose={onHide}
      fullWidth
      maxWidth="md"
      PaperProps={{ style: { borderRadius: 12, backgroundColor: "#f9fafb" } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Task Details</Typography>
        <Box>
            <IconButton onClick={handleDuplicate} title="Duplicate Task">
              <MdContentCopy />
            </IconButton>
            <IconButton onClick={onHide}>
              <MdClose />
            </IconButton>
          </Box>
      </DialogTitle>
      <Divider />

      <DialogContent dividers>
        {timerText && (
          <Typography
            sx={{
              mb: 2,
              fontWeight: 600,
              color: timerText.includes("Overdue") ? "error.main" : "text.secondary",
            }}
          >
            {timerText}
          </Typography>
        )}

        {/* Editable Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </Grid>

          

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Project"
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {projects.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6} md={4}>
            <TextField
              select
              fullWidth
              label="Stage"
              name="stage"
              value={form.stage}
              onChange={handleChange}
            >
              {LISTS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          

          <Grid item xs={6} md={4}>
            <TextField
              select
              fullWidth
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              {PRIORITY.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              type="datetime-local"
              fullWidth
              label="Start Time"
              name="start"
              value={form.start}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              type="date"
              fullWidth
              label="Due Date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </Grid>

         
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
      

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Assigned Team"
              name="team"
              SelectProps={{
                multiple: true,
                value: form.team,
                onChange: (e) => setForm((prev) => ({ ...prev, team: e.target.value })),
              }}
            >
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.username}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* File Upload */}
          <Grid item xs={12}>
            <label htmlFor="fileUpload" className="upload-label">
              <BiImages size={24} /> <span>Add Assets</span>
            </label>
            <input
              type="file"
              id="fileUpload"
              className="file-input"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.docx"
              multiple
            />
          </Grid>

          {/* Horizontal Scrollable Assets Carousel */}
          {/* inside the assets carousel section */}
          {form.assets.length > 0 && (
            <>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Assets:
              </Typography>
              <Box className="assets-carousel">
                {form.assets.map((a, i) => {
                  const isImage = a.type?.startsWith("image") || /\.(jpe?g|png|gif)$/i.test(a.name);
                  return (
                    <Box key={i} className="asset-thumb">
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(a)}
                          alt={a.name}
                          className="asset-img"
                        />
                      ) : (
                        <Box className="asset-icon">
                          <AiFillFilePdf size={28} color="#f87171" />
                          <Typography variant="caption" sx={{ mt: 0.5 }}>
                            {a.name}
                          </Typography>
                        </Box>
                      )}
                      <IconButton
                        size="small"
                        className="remove-btn"
                        onClick={() => handleRemoveFile(i)}
                      >
                        <MdClose fontSize={14} />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
            </Grid>

            {/* Subtasks */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1">Subtasks</Typography>
                <Button size="small" onClick={() => setSubtaskModalOpen(true)}>+ Add Subtask</Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {subTasks.map((st, idx) => (
                  <Chip key={idx} label={st.title} color="primary" variant="outlined" />
                ))}
              </Box>
            </Grid>
            </>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Recent Activities */}
        {task.activities?.length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Recent Activities:
            </Typography>
            {task.activities
              .slice(-5)
              .reverse()
              .map((a, i) => (
                <Typography key={i} variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                  {dayjs(a.date || task.updatedAt).format("MMM D, h:mm A")} — {a.activity}
                </Typography>
              ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onHide} variant="outlined" color="secondary">
          Close
        </Button>
        <Button onClick={handleUpdate} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={22} /> : "Save Changes"}
        </Button>
      </DialogActions>

      {/* SubTask Modal */}
      <SubTaskModal
        open={subtaskModalOpen}
        handleClose={() => setSubtaskModalOpen(false)}
        taskId={task?._id}
        onSubtaskAdded={handleSubtaskAdded}
      />

    </Dialog>
  );
};

export default TaskDetailsModal;
