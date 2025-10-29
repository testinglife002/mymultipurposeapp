// src/comonents/dashboard/DashboardAddSegment.jsx
import React, { useState } from "react";

import { CheckCircle, PlusCircle } from "lucide-react";
import "./DashboardAddSegment.css";

const DashboardAddSegment = () => {
  const [title, setTitle] = useState("");
  const [bangla, setBangla] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !bangla) return;

  

    setSuccess("✅ Segment added successfully!");
    setTitle("");
    setBangla("");
    setDescription("");

    setTimeout(() => setSuccess(""), 3000); // auto-hide success msg
  };

  return (
    <div className="segment-container">
      <h1 className="segment-header">Add Segment</h1>

      <form className="segment-form" onSubmit={handleSubmit}>
        <h3 className="form-title">
          <PlusCircle size={20} /> Create Segment
        </h3>

        {success && (
          <div className="success-alert">
            <CheckCircle size={18} /> {success}
          </div>
        )}

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write Title"
          />
        </div>

        <div className="form-group">
          <label>Content (Bangla Typing Enabled)</label>
          <textarea
            value={bangla}
            onChange={(e) => setBangla(e.target.value)}
            placeholder="শিরোনাম লিখুন"
            className="bangla-font"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write description..."
          />
        </div>

        <button type="submit" className="submit-btn">
          <PlusCircle size={18} /> Add Segment
        </button>
      </form>
    </div>
  );
};

export default DashboardAddSegment;
