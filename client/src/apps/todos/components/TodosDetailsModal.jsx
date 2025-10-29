
// TodosDetailsModal.jsx
// TodosDetailsModal.jsx
// 🧩 TodosDetailsModal.jsx (Pure React + CSS)
// ---------------------------------------------------------------------
// This modal component allows viewing and editing a single todo item.
// Features:
// - Edit todo fields: title, description, status, priority, color, reminder, tags
// - Add, remove, and reorder subtodos (drag & drop)
// - Inline subtodo editing (title, priority, completed)
// - Add/remove tags with suggestions fetched from backend
// - Save changes or delete the todo
// - Uses useRef + appendChild to render modal above all components
// - Integrates countdown reminders via useCountdownWithReminder hook
// - Shows a nested modal for adding subtodos
// ---------------------------------------------------------------------

import React, { useEffect, useRef, useState } from "react";
import { X, PlusCircle, Trash2, GripVertical } from "lucide-react";
import { FaCheck, FaSpinner } from "react-icons/fa";
import newRequest from "../../../api/newRequest";
import useCountdownWithReminder from "../../../utils/useCountdownWithReminder";
import "./TodosDetailsModal.css";

const TodosDetailsModal = ({ show, onHide, todo, refreshTodos }) => {
  const [formData, setFormData] = useState({ ...todo });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showSubtodoForm, setShowSubtodoForm] = useState(false);
  const [subtodo, setSubtodo] = useState({ title: "", priority: "medium", completed: false });

  const dragItem = useRef();
  const dragOverItem = useRef();
  const modalRef = useRef(null); // modal container

  const targetDate = todo?.start || todo?.dueDate;
  const reminders = todo?.reminders || [];
  const countdown = useCountdownWithReminder(targetDate, reminders);

  // Append modal to body for top-level rendering
  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    if (show) {
      document.body.appendChild(modalEl);
      modalEl.style.display = "flex";
      modalEl.style.zIndex = "9999";
    } else {
      modalEl.style.display = "none";
    }

    return () => {
      if (modalEl && modalEl.parentNode === document.body) {
        document.body.removeChild(modalEl);
      }
    };
  }, [show]);

  if (!show) return null;

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
      refreshTodos();
      onHide();
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
      refreshTodos();
      onHide();
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

  // ---------------- Render ----------------
  return (
    <div ref={modalRef}  className={`modal-overlay ${show ? "show" : ""}`}>
      <div className="modal-container">
        {/* Header */}
        <header className="modal-header">
          <h2>Edit Todo</h2>
          <button className="icon-btn" onClick={onHide}><X size={20} /></button>
        </header>

        {/* Body */}
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

          {/* Subtodos Section */}
          {/* Subtodos Section */}
          <div className="subtodo-header">
            <h3>Subtodos</h3>
            <button className="btn small" onClick={() => setShowSubtodoForm(!showSubtodoForm)}>
              <PlusCircle size={16} /> Add Subtodo
            </button>
          </div>

          {/* Dropdown Add Subtodo Form */}
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

          {/* Subtodo List */}
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

        {/* Footer */}
        <footer className="modal-footer">
          <button className="btn secondary" onClick={onHide}>Cancel</button>
          <button className="btn primary" onClick={handleUpdate} disabled={loading}>
            {loading ? <FaSpinner className="spin" /> : <FaCheck />} Save
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TodosDetailsModal;




