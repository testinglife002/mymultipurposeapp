// src/comonents/dashboard/DashboardAddCategoryType.jsx
import React, { useState } from "react";

import { CheckCircle, PlusCircle } from "lucide-react";
import "./DashboardAddCategoryType.css";

const DashboardAddCategoryType = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    

    setSuccess("Category Type added successfully!");
    setTitle("");
    setDescription("");

    setTimeout(() => setSuccess(""), 3000); // auto-hide message
  };

  return (
    <div className="category-container">
      <div className="category-card">
        <h1 className="category-title">
          <PlusCircle className="icon" /> Add Category Type
        </h1>

        <form className="category-form" onSubmit={handleSubmit}>
          <h3 className="form-heading">Create Category Type</h3>

          {success && (
            <div className="alert-success">
              <CheckCircle className="icon" /> {success}
            </div>
          )}

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter category title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            <PlusCircle className="btn-icon" /> Add Category Type
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardAddCategoryType;
