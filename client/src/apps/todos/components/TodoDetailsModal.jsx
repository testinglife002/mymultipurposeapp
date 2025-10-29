
// TodoDetailsModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { X, Trash2, GripVertical, Check } from "lucide-react";
import newRequest from "../../../api/newRequest";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "./TodoDetailsModal.css";

dayjs.extend(duration);

const formatTimeLeft = (diff) => {
  if (isNaN(diff)) return "—";
  if (diff <= 0) return "Started / Ended";

  const d = dayjs.duration(diff);
  const days = d.days();
  const hours = d.hours();
  const minutes = d.minutes();
  const seconds = d.seconds();

  return `${days ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`;
};


const getStartBadge = (diff) => {
  const hours = diff / (1000 * 60 * 60);
  if (hours <= 1) return { className: "badge-danger", icon: "🔥" };
  if (hours <= 24) return { className: "badge-warning", icon: "⚠️" };
  return { className: "badge-info", icon: "⏰" };
};

const getBadgeClass = (priority, completed) => {
  if (completed) return "badge-success";
  if (priority === "high") return "badge-danger";
  if (priority === "medium") return "badge-warning";
  return "badge-secondary";
};

const getRowStyle = (priority) => ({
  high: { backgroundColor: "#f8d7da" },
  medium: { backgroundColor: "#fff3cd" },
  low: { backgroundColor: "#e2e3e5" },
}[priority] || {});

// Normalize date for datetime-local input
const formatDatetimeLocal = (date) => (date ? new Date(date).toISOString().slice(0, 16) : "");

const SubtodoRow = ({ subtodo, index, onChange, onRemove, onDragStart, onDragEnter, onDragEnd }) => (
  <div
    className="subtodo-row"
    style={getRowStyle(subtodo.priority)}
    draggable
    onDragStart={() => onDragStart(index)}
    onDragEnter={() => onDragEnter(index)}
    onDragOver={(e) => e.preventDefault()}
    onDragEnd={onDragEnd}
  >
    <GripVertical size={16} className="drag-icon" />
    <input
      type="text"
      value={subtodo.title}
      onChange={(e) => onChange(index, "title", e.target.value)}
      className="subtodo-input"
    />
    <select
      value={subtodo.priority}
      onChange={(e) => onChange(index, "priority", e.target.value)}
      className="subtodo-select"
    >
      <option>low</option>
      <option>medium</option>
      <option>high</option>
    </select>
    <input
      type="checkbox"
      checked={subtodo.completed}
      onChange={(e) => onChange(index, "completed", e.target.checked)}
    />
    <span className={`badge ${getBadgeClass(subtodo.priority, subtodo.completed)}`}>
      {subtodo.completed ? "Completed" : subtodo.priority}
    </span>
    <button className="icon-btn danger" onClick={() => onRemove(index)}>
      <Trash2 size={16} />
    </button>
  </div>
);

const TodoDetailsModal = ({ show, onHide, todo, onTodoUpdated }) => {
  const [editTodo, setEditTodo] = useState({});
  const [username, setUsername] = useState("");
  const [startCountdown, setStartCountdown] = useState("");
  const [startBadge, setStartBadge] = useState({});
  const [endCountdown, setEndCountdown] = useState("");
  const [timeToStart, setTimeToStart] = useState("");
  const [timeToEnd, setTimeToEnd] = useState("");
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    if (!todo?.start && !todo?.end) return;

    const interval = setInterval(() => {
      if (todo.start) {
        const startDiff = dayjs(todo.start).diff(dayjs());
        setTimeToStart(formatTimeLeft(startDiff));
      }
      if (todo.end) {
        const endDiff = dayjs(todo.end).diff(dayjs());
        setTimeToEnd(formatTimeLeft(endDiff));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [todo]);

  useEffect(() => {
    if (!todo) return;
    setEditTodo({
      title: todo.title || "",
      description: todo.description || "",
      start: todo.start || "",
      end: todo.end || "",
      priority: todo.priority || "medium",
      subtodos: todo.subtodos || [],
      ...todo,
    });
    if (todo.userId) {
      newRequest
        .get(`/users/${todo.userId}`)
        .then((res) => setUsername(res.data.username))
        .catch(() => setUsername("Unknown"));
    }
  }, [todo]);

  useEffect(() => {
    if (!editTodo.start && !editTodo.end) return;

    const updateCountdowns = () => {
      const now = dayjs();

      if (editTodo.start) {
        const startDiff = dayjs(editTodo.start).diff(now);
        setStartCountdown(formatTimeLeft(startDiff));
        setStartBadge(getStartBadge(startDiff));
      }

      if (editTodo.end) {
        const endDiff = dayjs(editTodo.end).diff(now);
        setEndCountdown(formatTimeLeft(endDiff));
      }
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [editTodo.start, editTodo.end]);


  const handleSubtodoChange = (index, field, value) => {
    setEditTodo((prev) => {
      const updated = [...prev.subtodos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, subtodos: updated };
    });
  };

  const handleRemoveSubtodo = (index) => {
    setEditTodo((prev) => ({
      ...prev,
      subtodos: prev.subtodos.filter((_, i) => i !== index),
    }));
  };

  const handleDragStart = (index) => (dragItem.current = index);
  const handleDragEnter = (index) => (dragOverItem.current = index);
  const handleDragEnd = () => {
    setEditTodo((prev) => {
      const items = [...prev.subtodos];
      const dragged = items[dragItem.current];
      items.splice(dragItem.current, 1);
      items.splice(dragOverItem.current, 0, dragged);
      return { ...prev, subtodos: items };
    });
    dragItem.current = dragOverItem.current = null;
  };

  const completedCount = editTodo.subtodos?.filter((st) => st.completed).length || 0;
  const completedPercent = editTodo.subtodos?.length
    ? Math.round((completedCount / editTodo.subtodos.length) * 100)
    : 0;

  const handleSave = async () => {
    try {
      const payload = {
        ...editTodo,
        completedPercent,
        start: editTodo.start ? new Date(editTodo.start).toISOString() : null,
        end: editTodo.end ? new Date(editTodo.end).toISOString() : null,
      };
      const res = await newRequest.put(`/todos/${todo._id}`, payload);
      onTodoUpdated(res.data);
      onHide();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>Edit Todo - {editTodo.title || "Loading..."}</h2>
          <button className="icon-btn" onClick={onHide}>
            <X size={20} />
          </button>
        </header>

        <div className="modal-body">
          
          {editTodo.start && (
            <div className="badge-box">
              <strong>Starts:</strong>{" "}
              <span className={`badge ${startBadge.className}`}>
                {startBadge.icon} {startCountdown}
              </span>
            </div>
          )}

          {editTodo.end && (
            <div className="badge-box">
              <strong>Ends:</strong>{" "}
              <span className="badge badge-secondary">{endCountdown}</span>
            </div>
          )}


          {/* 🕒 Start countdown */}
          {todo.start && (
            <div className="countdown-row">
              <span className="label">Starts in:</span>
              <span className="value"> &nbsp; {timeToStart}</span>
            </div>
          )}

          {/* ⏳ End countdown */}
          {todo.end && (
            <div className="countdown-row">
              <span className="label">Ends in:</span>
              <span className="value"> &nbsp; {timeToEnd}</span>
            </div>
          )}

          <div className="form-group">
            <label>Title</label>
            <input
              value={editTodo.title || ""}
              onChange={(e) => setEditTodo((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editTodo.description || ""}
              onChange={(e) => setEditTodo((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="form-group inline">
            <div>
              <label>Start</label>
              <input
                type="datetime-local"
                value={formatDatetimeLocal(editTodo.start)}
                onChange={(e) => setEditTodo((prev) => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <label>End</label>
              <input
                type="datetime-local"
                value={formatDatetimeLocal(editTodo.end)}
                onChange={(e) => setEditTodo((prev) => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={editTodo.priority}
              onChange={(e) => setEditTodo((prev) => ({ ...prev, priority: e.target.value }))}
            >
              <option>low</option>
              <option>medium</option>
              <option>high</option>
            </select>
          </div>

          {editTodo.subtodos?.length > 0 && (
            <>
              <div className="progress-container">
                <label>Subtodos Completion: {completedPercent}%</label>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completedPercent}%` }}></div>
                </div>
              </div>
              <div className="subtodo-list">
                {editTodo.subtodos.map((st, i) => (
                  <SubtodoRow
                    key={i}
                    subtodo={st}
                    index={i}
                    onChange={handleSubtodoChange}
                    onRemove={handleRemoveSubtodo}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            </>
          )}

          <div className="todo-info">
            Created by: <span className="badge badge-info">{username}</span>
            <br />
            Created: {editTodo.createdAt && new Date(editTodo.createdAt).toLocaleString()}
            <br />
            Last Updated: {editTodo.updatedAt && new Date(editTodo.updatedAt).toLocaleString()}
          </div>
        </div>

        <footer className="modal-footer">
          <button
            className="btn danger"
            onClick={() => {
              if (window.confirm("Delete this todo?")) {
                newRequest
                  .delete(`/todos/${editTodo._id}`)
                  .then(() => {
                    onTodoUpdated(null);
                    onHide();
                  })
                  .catch((err) => {
                    console.error(err);
                    toast.error("Failed to delete todo");
                  });
              }
            }}
          >
            <Trash2 size={16} /> Delete
          </button>
          <button className="btn primary" onClick={handleSave}>
            <Check size={16} /> Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TodoDetailsModal;


