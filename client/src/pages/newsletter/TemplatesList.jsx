// 1) TemplatesList.jsx — show templates in grid, Edit / Delete buttons, open editor route
// src/pages/newsletter/TemplatesList.jsx
// src/pages/newsletter/TemplatesList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./templates.css";

const TemplatesList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await newRequest.get("/templates");
      setTemplates(res.data.templates || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      alert("Could not load templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (id) => {
    // navigate(`/create-email-template?templateId=${id}`);
    navigate(`/edit-email-template/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Delete this template permanently?")) return;
    try {
      setDeletingId(id);
      await newRequest.delete(`/templates/${id}`);
      setTemplates((prev) => prev.filter((tpl) => tpl._id !== id));
      alert("✅ Template deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-3 text-center">Loading templates…</div>;
  if (!templates.length)
    return (
      <div className="p-3 text-center">
        No templates found.
        <br />
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/create-email-template")}
        >
          + Create Template
        </button>
      </div>
    );

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📨 Saved Templates</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/create-email-template")}
        >
          + Create Template
        </button>
      </div>

      <div className="templates-grid">
        {templates.map((tpl) => (
          <div className="template-card" key={tpl._id}>
            <div className="template-card-body">
              <div className="template-name">{tpl.name || "Untitled"}</div>
              <div className="template-preview">
                <iframe
                  title={`preview-${tpl._id}`}
                  srcDoc={tpl.html || "<div/>"}
                  sandbox="allow-same-origin allow-popups allow-forms"
                />
              </div>
            </div>

            <div className="template-actions text-center">
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => handleEdit(tpl._id)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(tpl._id)}
                disabled={deletingId === tpl._id}
              >
                {deletingId === tpl._id ? "Deleting…" : "🗑️ Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesList;
