// src/admin/components/CategoryNodeII.jsx
// React Component: CategoryNodeII.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Folder,
  Plus,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import "./CategoryNodeII.css";

const CategoryNodeII = ({ node, depth = 0, refresh }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.name);
  const [collapsed, setCollapsed] = useState(false);

  const handleRename = async () => {
    await axios.put(`/api/categories/${node.slug}`, { name });
    setEditing(false);
    refresh();
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this category?")) {
      await axios.delete(`/api/categories/${node.slug}`);
      refresh();
    }
  };

  const handleAddChild = async () => {
    const childName = prompt("New subcategory name");
    if (childName && depth < 2) {
      await axios.post("/api/categories", {
        name: childName,
        parentId: node._id,
      });
      refresh();
    }
  };

  return (
    <div className="category-node-wrapper" style={{ paddingLeft: `${depth * 20}px` }}>
      <div className="category-node">
        {node.children && node.children.length > 0 ? (
          <button
            className="icon-btn toggle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
        ) : (
          <div style={{ width: "24px" }}></div>
        )}

        {editing ? (
          <div className="edit-wrapper">
            <input
              className="edit-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <button className="icon-btn confirm" onClick={handleRename}>
              <Check size={16} />
            </button>
            <button
              className="icon-btn cancel"
              onClick={() => setEditing(false)}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="node-label">
            <Folder size={16} className="folder-icon" />
            <span onClick={() => setEditing(true)}>{node.name}</span>
          </div>
        )}

        <div className="actions">
          <button
            className="icon-btn add"
            onClick={handleAddChild}
            disabled={depth >= 2}
            title="Add subcategory"
          >
            <Plus size={16} />
          </button>
          <button
            className="icon-btn delete"
            onClick={handleDelete}
            title="Delete category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Recursive children, hidden if collapsed */}
      {!collapsed &&
        node.children &&
        node.children.map((child) => (
          <CategoryNodeII
            key={child.slug}
            node={child}
            depth={depth + 1}
            refresh={refresh}
          />
        ))}
    </div>
  );
};

export default CategoryNodeII;