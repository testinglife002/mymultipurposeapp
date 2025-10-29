import React, { useState } from "react";
import { ChevronDown, Edit, Trash2, Folder } from "lucide-react";
import "./CategoryNodeI.css";

const CategoryNodeI = ({ node, refresh }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Delete category "${node.name}"?`)) {
      try {
        await fetch(`/api/categories/${node._id}`, {
          method: "DELETE",
        });
        refresh();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div className="category-node">
      <div className="node-header">
        <div className="node-main" onClick={() => setOpen(!open)}>
          {node.children && node.children.length > 0 ? (
            <ChevronDown
              className={`chevron-icon ${open ? "open" : ""}`}
            />
          ) : (
            <span className="chevron-placeholder" />
          )}
          <Folder className="folder-icon" />
          <span className="node-name">{node.name}</span>
        </div>
        <div className="node-actions">
          <Edit className="action-icon edit-icon" />
          <Trash2
            className="action-icon delete-icon"
            onClick={handleDelete}
          />
        </div>
      </div>

      {open && node.children && node.children.length > 0 && (
        <div className="node-children">
          {node.children.map((child) => (
            <CategoryNode
              key={child.slug || child._id}
              node={child}
              refresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNodeI;
