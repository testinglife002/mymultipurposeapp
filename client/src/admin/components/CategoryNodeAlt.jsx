// ✅ React Component (CategoryNodeAlt.jsx)
// src/admin/components/CategoryNodeAlt.jsx
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Move } from "lucide-react";
import "./CategoryNodeAlt.css";

const CategoryNodeAlt = ({
  category,
  onAdd,
  onEdit,
  onDelete,
  onDragStart,
  onDrop,
  maxLevel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(category.name);

  const handleEditSubmit = () => {
    if (newName.trim()) {
      onEdit(category.slug, newName);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="gordius-node"
      draggable
      onDragStart={(e) => onDragStart(e, category)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, category)}
    >
      <div className="gordius-node-content">
        <div className="gordius-node-left">
          <Move className="gordius-drag-icon" size={16} />
          {isEditing ? (
            <input
              className="gordius-edit-input"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
              autoFocus
            />
          ) : (
            <span className="gordius-node-name">{category.name}</span>
          )}
        </div>

        <div className="gordius-node-actions">
          {category.level < maxLevel && (
            <button
              className="gordius-action-btn add"
              onClick={() => onAdd(category._id)}
            >
              <Plus size={14} />
            </button>
          )}
          {isEditing ? (
            <button
              className="gordius-action-btn save"
              onClick={handleEditSubmit}
            >
              ✔
            </button>
          ) : (
            <button
              className="gordius-action-btn edit"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={14} />
            </button>
          )}
          <button
            className="gordius-action-btn delete"
            onClick={() => onDelete(category.slug)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {category.children?.length > 0 && (
        <div className="gordius-children">
          {category.children.map((child) => (
            <CategoryNodeAlt
              key={child._id}
              category={child}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDrop={onDrop}
              maxLevel={maxLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNodeAlt;

