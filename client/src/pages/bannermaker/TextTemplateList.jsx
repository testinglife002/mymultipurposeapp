// TextTemplateList.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";

export default function TextTemplateList({ onSelect }) {
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    try {
      const res = await newRequest.get("/text-templates");
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      await newRequest.delete(`/text-templates/${id}`);
      setTemplates(templates.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete template");
    }
  };

  return (
    <div className="template-list p-3 border rounded">
      <h6>📁 Saved Templates</h6>
      {templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {templates.map((t) => (
            <div
              key={t._id}
              className="template-card border rounded p-2"
              style={{ width: 150, cursor: "pointer" }}
            >
              {/* Thumbnail */}
              <div
                className="template-thumb mb-2"
                style={{
                  width: "100%",
                  height: 100,
                  backgroundColor: "#eee",
                  backgroundImage: `url(${t.bgImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 4
                }}
                onClick={() => onSelect(t)}
              />
              {/* Name */}
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: 12, fontWeight: 500 }}>{t.name}</span>
                <button
                  className="btn btn-sm btn-danger"
                  style={{ fontSize: 10, padding: "2px 4px" }}
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
