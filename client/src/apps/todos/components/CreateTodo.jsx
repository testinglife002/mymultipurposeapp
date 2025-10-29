// CreateTodo.jsx
import React, { useState, useEffect, useRef } from "react";
import newRequest from "../../../api/newRequest";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
} from "@mui/material";
import { Plus, X, GripVertical } from "lucide-react";
import "./CreateTodo.css";

const CreateTodo = ({ user, onTodoCreated }) => {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showSubtodoModal, setShowSubtodoModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    start: "",
    end: "",
    projectId: "",
    recurrence: "none",
    status: "pending",
    priority: "medium",
    tags: [],
    color: "#000000",
    reminder: "",
    marked: false,
    completed: false,
    remindMe: "",
    comments: "",
    subtodos: [],
  });

  const [subtodo, setSubtodo] = useState({
    title: "",
    priority: "medium",
    completed: false,
  });

  // For drag & drop
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects");
        console.log("Projects response:", res.data);
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Fetch projects error:", err.response?.data || err);
      }
    };
    fetchProjects();
  }, []);

  console.log(projects)

  useEffect(() => {
    const fetchTagsFromTodos = async () => {
      try {
        const res = await newRequest.get("/todos/tags-only");
        setTagSuggestions(res.data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    fetchTagsFromTodos();
  }, []);

  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubtodoChange = (field, value) => {
    setSubtodo({ ...subtodo, [field]: value });
  };

  const handleAddSubtodo = () => {
    if (!subtodo.title.trim()) return alert("Subtodo title is required");
    setForm({ ...form, subtodos: [...form.subtodos, { ...subtodo }] });
    setSubtodo({ title: "", priority: "medium", completed: false });
    setShowSubtodoModal(false);
  };

  const handleRemoveSubtodo = (index) => {
    const subtodos = [...form.subtodos];
    subtodos.splice(index, 1);
    setForm({ ...form, subtodos });
  };

  const handleSubtodoInlineChange = (index, field, value) => {
    const subtodos = [...form.subtodos];
    subtodos[index] = { ...subtodos[index], [field]: value };
    setForm({ ...form, subtodos });
  };

  // Drag & drop handlers
  const handleDragStart = (index) => {
    dragItem.current = index;
  };
  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };
  const handleDragEnd = () => {
    const items = [...form.subtodos];
    const draggedItem = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItem);
    setForm({ ...form, subtodos: items });
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const completedCount = form.subtodos.filter((st) => st.completed).length;
  const totalCount = form.subtodos.length;
  const completedPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !user) {
      alert("Title   and User are required");
      return;
    }

    try {
      const res = await newRequest.post("/todos", {
        ...form,
        tags,
        userId: user?._id,
        completedPercent,
      });
      alert("Todo created!");
      onTodoCreated?.(res.data);

      // reset
      setForm({
        title: "",
        description: "",
        dueDate: "",
        start: "",
        end: "",
        projectId: "",
        recurrence: "none",
        status: "pending",
        priority: "medium",
        tags: [],
        color: "#000000",
        reminder: "",
        marked: false,
        completed: false,
        remindMe: "",
        comments: "",
        subtodos: [],
      });
      setTags([]);
      setTagInput("");
    } catch (err) {
      console.error("Error creating todo", err);
      alert(err?.response?.data?.error || "Failed to create todo");
    }
  };

  return (
    <div className="create-todo-container">
      <Typography variant="h5" gutterBottom>
        Create Todo
      </Typography>
      <form onSubmit={handleSubmit} className="todo-form">
        {/* Title */}
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="dense"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          multiline
          rows={2}
          value={form.description}
          onChange={handleChange}
        />

        {/* Dates */}
        <Box className="row-3col">
          <TextField
            type="datetime-local"
            label="Start"
            name="start"
            InputLabelProps={{ shrink: true }}
            value={form.start}
            onChange={handleChange}
          />
          <TextField
            type="datetime-local"
            label="End"
            name="end"
            InputLabelProps={{ shrink: true }}
            value={form.end}
            onChange={handleChange}
          />
          <TextField
            type="datetime-local"
            label="Due Date"
            name="dueDate"
            InputLabelProps={{ shrink: true }}
            value={form.dueDate}
            onChange={handleChange}
          />
        </Box>

        {/* Project */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Project</InputLabel>
          <Select
            name="projectId"
            value={form.projectId}
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

        {/* Priority / Recurrence / Status */}
        <Box className="row-3col">
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Recurrence</InputLabel>
            <Select
              name="recurrence"
              value={form.recurrence}
              onChange={handleChange}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="done">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Checkboxes */}
        <FormControlLabel
          control={
            <Checkbox
              checked={form.completed}
              onChange={handleChange}
              name="completed"
            />
          }
          label="Completed"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.marked}
              onChange={handleChange}
              name="marked"
            />
          }
          label="Mark as Important"
        />

        {/* Reminders */}
        <TextField
          type="datetime-local"
          label="Remind Me"
          name="remindMe"
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="dense"
          value={form.remindMe}
          onChange={handleChange}
        />

        <TextField
          type="datetime-local"
          label="Reminder (Date only)"
          name="reminder"
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="dense"
          value={form.reminder}
          onChange={handleChange}
        />

        {/* Comments */}
        <TextField
          label="Comments"
          name="comments"
          fullWidth
          margin="dense"
          multiline
          rows={2}
          value={form.comments}
          onChange={handleChange}
        />

        {/* Tags */}
        <Box className="tag-input">
          <TextField
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleTagAdd();
              }
            }}
          />
          <Button onClick={handleTagAdd} startIcon={<Plus />}>
            Add
          </Button>
        </Box>

        <Box className="tag-list">
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleTagRemove(tag)}
              className="tag-chip"
            />
          ))}
        </Box>

        {/* Color */}
        <Box className="color-picker">
          <label>Color Label</label>
          <input
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
        </Box>

        {/* Subtodos */}
        <Box className="subtodo-section">
          <Button
            variant="outlined"
            startIcon={<Plus />}
            onClick={() => setShowSubtodoModal(true)}
          >
            Add Subtodo
          </Button>

          {form.subtodos.length > 0 && (
            <>
              <Typography variant="body2" className="mt-2">
                Subtodos Completion: {completedPercent}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completedPercent}
                className="progress-bar"
              />

              <Table size="small" className="subtodo-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Drag</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Completed</TableCell>
                    <TableCell>Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.subtodos.map((st, i) => (
                    <TableRow
                      key={i}
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragEnter={() => handleDragEnter(i)}
                      onDragEnd={handleDragEnd}
                    >
                      <TableCell className="drag-cell">
                        <GripVertical />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={st.title}
                          onChange={(e) =>
                            handleSubtodoInlineChange(i, "title", e.target.value)
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={st.priority}
                          onChange={(e) =>
                            handleSubtodoInlineChange(i, "priority", e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={st.completed}
                          onChange={(e) =>
                            handleSubtodoInlineChange(i, "completed", e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveSubtodo(i)}
                        >
                          <X />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Box>

        <Button type="submit" variant="contained" color="success">
          Create Todo
        </Button>
      </form>

      {/* Subtodo Dialog */}
      <Dialog open={showSubtodoModal} onClose={() => setShowSubtodoModal(false)}>
        <DialogTitle>Add Subtodo</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={subtodo.title}
            onChange={(e) => handleSubtodoChange("title", e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={subtodo.priority}
              onChange={(e) => handleSubtodoChange("priority", e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={subtodo.completed}
                onChange={(e) =>
                  handleSubtodoChange("completed", e.target.checked)
                }
              />
            }
            label="Completed"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubtodoModal(false)}>Cancel</Button>
          <Button onClick={handleAddSubtodo} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateTodo;
