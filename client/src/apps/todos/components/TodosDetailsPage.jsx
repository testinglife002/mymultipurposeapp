// ✅ src/apps/todos/pages/TodosDetailsPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X,
  Trash2,
  GripVertical,
  PlusCircle,
  Tag,
  CalendarClock,
  Clock,
  Folder,
} from "lucide-react";
import newRequest from "../../../api/newRequest";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { showBrowserNotification } from "../../../utils/notificationUtils";
import SubtodoForm from "./SubtodoForm";
import "./TodosDetailsPage.css";

const TodosDetailsPage = () => {
  const { todoId } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rowAnim, setRowAnim] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [endLeft, setEndLeft] = useState("");

  const dragItem = useRef();
  const dragOverItem = useRef();

  // Fetch todo
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await newRequest.get(`/todos/${todoId}`);
        setTodo(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch todo", err);
      }
    };
    fetchTodo();
  }, [todoId]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects");
        setProjects(res.data.projects);
      } catch (err) {
        console.error("❌ Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  // Countdown for start/end
  const calculateCountdown = () => {
    if (!formData?.start || !formData?.end) return;
    const now = dayjs();
    const startDiff = dayjs(formData.start).diff(now, "second");
    const endDiff = dayjs(formData.end).diff(now, "second");
    setTimeLeft(formatDuration(startDiff));
    setEndLeft(formatDuration(endDiff));

    if (startDiff <= 3600 && startDiff > 0) {
      const msg = `⏰ "${formData.title}" starts in less than an hour!`;
      toast(msg);
      showBrowserNotification("Todo Reminder ⏰", { body: msg });
    }
  };

  const formatDuration = (seconds) => {
    if (seconds <= 0) return "Started or expired";
    const days = Math.floor(seconds / (3600 * 24));
    const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hrs}h ${mins}m ${secs}s`;
  };

  useEffect(() => {
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [formData?.start, formData?.end]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await newRequest.put(`/todos/${todoId}`, formData);
      toast.success("✅ Todo updated");
      setFormData(res.data);
    } catch (err) {
      console.error("❌ Update failed", err);
      toast.error("Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this Todo permanently?")) return;
    try {
      await newRequest.delete(`/todos/${todoId}`);
      toast.success("🗑️ Todo deleted");
      navigate(-1);
    } catch (err) {
      console.error("❌ Delete failed", err);
      toast.error("Failed to delete todo");
    }
  };

  // Subtodo logic
  const handleAddSubtodo = async (subtodo) => {
    try {
      const res = await newRequest.post(`/todos/${todo._id}/subtodos`, subtodo);
      setFormData(res.data);
      const newSub = res.data.subtodos.at(-1);
      setRowAnim((prev) => ({ ...prev, [newSub._id]: "appear" }));
      setTimeout(() => setRowAnim({}), 400);
      setShowModal(false);
    } catch (err) {
      console.error("❌ Failed to add subtodo", err);
    }
  };

  const handleRemoveSubtodo = async (index) => {
    const st = formData.subtodos[index];
    if (!window.confirm(`Delete subtodo "${st.title}"?`)) return;
    setRowAnim((prev) => ({ ...prev, [st._id]: "remove" }));
    setTimeout(async () => {
      try {
        const res = await newRequest.delete(`/todos/${todo._id}/subtodos/${st._id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("❌ Failed to remove subtodo", err);
      }
    }, 300);
  };

  const handleSubtodoChange = (index, key, value) => {
    const subtodos = [...formData.subtodos];
    subtodos[index] = { ...subtodos[index], [key]: value };
    setFormData({ ...formData, subtodos });
  };

  const handleSubtodoBlur = async (st) => {
    try {
      await newRequest.put(`/todos/${todo._id}/subtodos/${st._id}`, st);
    } catch (err) {
      console.error("❌ Failed to update subtodo inline", err);
    }
  };

  const handleDragStart = (index) => (dragItem.current = index);
  const handleDragEnter = (index) => (dragOverItem.current = index);
  const handleDragEnd = () => {
    const items = [...formData.subtodos];
    const dragged = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, dragged);
    dragItem.current = dragOverItem.current = null;
    setFormData({ ...formData, subtodos: items });
  };

  if (!formData) return <p className="loading-text">Loading Todo...</p>;

  return (
    <div className="todos-details-page">
      <header className="page-header non-sticky">
        <div className="header-left">
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <X size={22} />
          </button>
          <h2>{formData.title || "Todo Details"}</h2>
        </div>

         {/* ⏳ Start & End Time Countdowns (after Title) */}
        <div className="row-2col">
          <div>
            <label>⏰ Start Countdown</label>
            <div className="countdown-box">
              <Clock size={14} className="me-1" />
              <span className="info">{timeLeft || "—"}</span>
            </div>
          </div>
          <div>
            <label>📅 End Countdown</label>
            <div className="countdown-box">
              <CalendarClock size={14} className="me-1" />
              <span className="success">{endLeft || "—"}</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <button className="btn btn-success small" onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving..." : "Update"}
          </button>
          <button className="btn btn-danger small" onClick={handleDelete} disabled={loading}>
            <Trash2 size={16} /> Delete
          </button>
        </div>

        
      </header>

      <div className="page-body">
        {/* Title / Description */}
        <label>Title</label>
        <input name="title" value={formData.title || ""} onChange={handleChange} />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
        />

        {/* Dates */}
        <div className="row-3col">
          <div>
            <label>Start</label>
            <input type="datetime-local" name="start" value={formData.start || ""} onChange={handleChange} />
            <small className="muted">
              <Clock size={14} /> Starts in: <span className="info">{timeLeft}</span>
            </small>
          </div>
          <div>
            <label>End</label>
            <input type="datetime-local" name="end" value={formData.end || ""} onChange={handleChange} />
            <small className="muted">
              <CalendarClock size={14} /> Ends in: <span className="success">{endLeft}</span>
            </small>
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Project */}
        <label>Project</label>
        <select name="projectId" value={formData.projectId || ""} onChange={handleChange}>
          <option value="">None</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Priority / Recurrence / Status */}
        <div className="row-3col">
          <div>
            <label>Priority</label>
            <select name="priority" value={formData.priority || ""} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label>Recurrence</label>
            <select name="recurrence" value={formData.recurrence || "none"} onChange={handleChange}>
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select name="status" value={formData.status || "pending"} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed || false}
              onChange={handleChange}
            />{" "}
            Completed
          </label>
          <label>
            <input
              type="checkbox"
              name="marked"
              checked={formData.marked || false}
              onChange={handleChange}
            />{" "}
            Important
          </label>
        </div>

        {/* Reminder */}
        <label>Remind Me</label>
        <input
          type="datetime-local"
          name="remindMe"
          value={formData.remindMe || ""}
          onChange={handleChange}
        />
        <label>Reminder (Date only)</label>
        <input
          type="datetime-local"
          name="reminder"
          value={formData.reminder || ""}
          onChange={handleChange}
        />

        {/* Comments */}
        <label>Comments</label>
        <textarea
          name="comments"
          rows="2"
          value={formData.comments || ""}
          onChange={handleChange}
        />

        {/* Tags */}
        {formData.tags?.length > 0 && (
          <div className="tags-list">
            <h5>
              <Tag size={16} /> Tags
            </h5>
            <div className="tags">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="tag-chip">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        <div className="color-picker">
          <label>Color Label</label>
          <input
            type="color"
            name="color"
            value={formData.color || "#000000"}
            onChange={handleChange}
          />
        </div>

        {/* Subtodos */}
        <h4>Subtodos</h4>
        <table className="subtodos-table">
          <thead>
            <tr>
              <th></th>
              <th>Done</th>
              <th>Title</th>
              <th>Priority</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(formData.subtodos || []).map((st, i) => (
              <tr
                key={st._id}
                className={`${rowAnim[st._id] || ""}`}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd}
              >
                <td><GripVertical size={16} className="drag-handle" /></td>
                <td>
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={(e) =>
                      handleSubtodoChange(i, "completed", e.target.checked)
                    }
                    onBlur={() => handleSubtodoBlur(st)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={st.title || ""}
                    onChange={(e) => handleSubtodoChange(i, "title", e.target.value)}
                    onBlur={() => handleSubtodoBlur(st)}
                  />
                </td>
                <td>
                  <select
                    value={st.priority || "medium"}
                    onChange={(e) => handleSubtodoChange(i, "priority", e.target.value)}
                    onBlur={() => handleSubtodoBlur(st)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-danger small"
                    onClick={() => handleRemoveSubtodo(i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for new subtodo */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <SubtodoForm
              onAddSubtodo={handleAddSubtodo}
              onCancel={() => setShowModal(false)}
              styleVariant="modal"
            />
          </div>
        </div>
      )}

      <div className="add-subtodo-btn">
        <button onClick={() => setShowModal(true)}>
          <PlusCircle size={18} /> Add Subtodo
        </button>
      </div>
    </div>
  );
};

export default TodosDetailsPage;




/*
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, PlusCircle, Trash2, GripVertical } from "lucide-react";
import { FaCheck, FaSpinner } from "react-icons/fa";
import newRequest from "../../../api/newRequest";
import useCountdownWithReminder from "../../../utils/useCountdownWithReminder";
import "./TodosDetailsModal.css"; // reuse existing CSS

const TodosDetailsPage = () => {
  const { todoId } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showSubtodoForm, setShowSubtodoForm] = useState(false);
  const [subtodo, setSubtodo] = useState({ title: "", priority: "medium", completed: false });

  const dragItem = useRef();
  const dragOverItem = useRef();

  // Fetch todo details
  // Fetch todo by ID
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await newRequest.get(`/todos/${todoId}`);
        setTodo(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch todo", err);
      }
    };
    fetchTodo();
  }, [todoId]);

  console.log(todo);

  const targetDate = todo?.start || todo?.dueDate;
  const reminders = todo?.reminders || [];
  const countdown = useCountdownWithReminder(targetDate, reminders);

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags?.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...(prev.tags || []), trimmed] }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const completedCount = formData.subtodos?.filter((st) => st.completed).length || 0;
      const totalCount = formData.subtodos?.length || 0;
      const completedPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

      await newRequest.put(`/todos/${todo._id}`, {
        ...formData,
        completedPercent,
        completed: formData.completed || formData.status === "done",
      });
      alert("Todo updated successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this todo?")) return;
    try {
      setLoading(true);
      await newRequest.delete(`/todos/${todo._id}`);
      navigate(-1); // go back to inbox
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubtodoChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSubtodo({ ...subtodo, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddSubtodo = async () => {
    if (!subtodo.title.trim()) return alert("Subtodo title is required");
    try {
      const res = await newRequest.post(`/todos/${todo._id}/subtodos`, subtodo);
      setFormData(res.data);
      setSubtodo({ title: "", priority: "medium", completed: false });
      setShowSubtodoForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSubtodo = async (index) => {
    const st = formData.subtodos[index];
    if (!window.confirm(`Delete subtodo "${st.title}"?`)) return;
    try {
      const res = await newRequest.delete(`/todos/${todo._id}/subtodos/${st._id}`);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubtodoInlineChange = async (index, field, value) => {
    const st = formData.subtodos[index];
    try {
      const updatedSubtodo = { [field]: value };
      const res = await newRequest.put(`/todos/${todo._id}/subtodos/${st._id}`, updatedSubtodo);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (index) => (dragItem.current = index);
  const handleDragEnter = (index) => (dragOverItem.current = index);
  const handleDragEnd = () => {
    const items = [...formData.subtodos];
    const dragged = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, dragged);
    dragItem.current = dragOverItem.current = null;
    setFormData({ ...formData, subtodos: items });
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="modal-container page-view">
      <header className="modal-header">
        <h2>Edit Todo</h2>
        <button className="icon-btn" onClick={() => navigate(-1)}><X size={20} /></button>
      </header>

      <div className="modal-body">
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Completed</option>
        </select>

        <label>Tags</label>
        <div className="tag-input">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleTagAdd();
              }
            }}
          />
          <button onClick={handleTagAdd}>Add</button>
        </div>
        <div className="tags">
          {formData.tags?.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button onClick={() => handleTagRemove(tag)}>×</button>
            </span>
          ))}
        </div>

        <hr />

        <div className="subtodo-header">
          <h3>Subtodos</h3>
          <button className="btn small" onClick={() => setShowSubtodoForm(!showSubtodoForm)}>
            <PlusCircle size={16} /> Add Subtodo
          </button>
        </div>

        {showSubtodoForm && (
          <div className="subtodo-form-dropdown">
            <label>Title</label>
            <input name="title" value={subtodo.title} onChange={handleSubtodoChange} />
            <label>Priority</label>
            <select name="priority" value={subtodo.priority} onChange={handleSubtodoChange}>
              <option>low</option>
              <option>medium</option>
              <option>high</option>
            </select>
            <div className="checkbox">
              <input
                type="checkbox"
                name="completed"
                checked={subtodo.completed}
                onChange={handleSubtodoChange}
              />
              <span>Completed</span>
            </div>
            <div className="actions">
              <button className="btn secondary" onClick={() => setShowSubtodoForm(false)}>Cancel</button>
              <button className="btn primary" onClick={handleAddSubtodo}>Add</button>
            </div>
          </div>
        )}

        <div className="subtodo-list">
          {formData.subtodos?.map((st, i) => (
            <div
              key={i}
              className={`subtodo-item ${st.completed ? "done" : ""}`}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
            >
              <GripVertical size={16} className="drag-icon" />
              <input
                value={st.title}
                onChange={(e) => handleSubtodoInlineChange(i, "title", e.target.value)}
              />
              <select
                value={st.priority}
                onChange={(e) => handleSubtodoInlineChange(i, "priority", e.target.value)}
              >
                <option>low</option>
                <option>medium</option>
                <option>high</option>
              </select>
              <input
                type="checkbox"
                checked={st.completed}
                onChange={(e) => handleSubtodoInlineChange(i, "completed", e.target.checked)}
              />
              <button className="icon-btn danger" onClick={() => handleRemoveSubtodo(i)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer className="modal-footer">
        <button className="btn secondary" onClick={() => navigate(-1)}>Cancel</button>
        <button className="btn primary" onClick={handleUpdate} disabled={loading}>
          {loading ? <FaSpinner className="spin" /> : <FaCheck />} Save
        </button>
        <button className="btn danger" onClick={handleDelete}>Delete</button>
      </footer>
    </div>
  );
};

export default TodosDetailsPage;
*/



