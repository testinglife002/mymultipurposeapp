// ✅ src/apps/todos/pages/SubtodoForm.jsx
import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import "./SubtodoForm.css";

const SubtodoForm = ({ onAddSubtodo, onCancel }) => {
  const [subtodo, setSubtodo] = useState({ title: "", priority: "medium", completed: false });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSubtodo((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!subtodo.title.trim()) return alert("Subtodo title is required");
    await onAddSubtodo(subtodo);
    setSubtodo({ title: "", priority: "medium", completed: false });
  };

  return (
    <div className="subtodo-form">
      <div className="subtodo-form-header">
        <h5><PlusCircle size={18} /> Add Subtodo</h5>
        {onCancel && (
          <button className="icon-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        )}
      </div>

      <label>Title</label>
      <input name="title" value={subtodo.title} onChange={handleChange} placeholder="Subtodo title" />

      <label>Priority</label>
      <select name="priority" value={subtodo.priority} onChange={handleChange}>
        <option>low</option>
        <option>medium</option>
        <option>high</option>
      </select>

      <div className="checkbox-row">
        <input type="checkbox" name="completed" checked={subtodo.completed} onChange={handleChange} />
        <span>Completed</span>
      </div>

      <div className="form-actions">
        {onCancel && <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        <button className="btn btn-primary" onClick={handleSubmit}>Add</button>
      </div>
    </div>
  );
};

export default SubtodoForm;