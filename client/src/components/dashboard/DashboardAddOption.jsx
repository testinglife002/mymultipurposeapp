// src/comonents/dashboard/DashboardAddOption.jsx
import React, { useState } from "react";

import { CheckCircle2, PlusCircle } from "lucide-react";
import "./DashboardAddOption.css";

const DashboardAddOption = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

   

    setSuccess("Option added successfully!");
    setTitle("");
    setDescription("");

    setTimeout(() => setSuccess(""), 3000); // auto-hide success
  };

  return (
    <div className="dashboard-add-option">
      <div className="form-card">
        <h1 className="form-title">
          <PlusCircle size={24} className="icon" /> Add Option
        </h1>

        <form onSubmit={handleSubmit} className="custom-form">
          <h3 className="form-subtitle">Create Option</h3>

          {success && (
            <div className="success-message">
              <CheckCircle2 size={18} /> {success}
            </div>
          )}

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter option title..."
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Option
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardAddOption;