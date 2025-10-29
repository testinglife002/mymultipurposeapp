// src/admin/pages/CategoryManagerPreview.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash } from "lucide-react";
import "./CategoryManagerPreview.css";

// Dummy category data
const dummyCategories = [
  {
    id: 1,
    name: "Electronics",
    children: [
      { id: 2, name: "Mobile Phones", children: [] },
      { id: 3, name: "Laptops", children: [] },
    ],
  },
  {
    id: 4,
    name: "Fashion",
    children: [
      { id: 5, name: "Men", children: [] },
      { id: 6, name: "Women", children: [] },
    ],
  },
];

// Recursive Node Component
const CategoryNode = ({ node, onAddSub, onDelete, onRename }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(node.name);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSubName, setNewSubName] = useState("");

  const handleRename = () => {
    if (nameInput.trim()) onRename(node.id, nameInput.trim());
    setIsEditing(false);
  };

  return (
    <div className="cat-node">
      <div className="cat-node-header">
        <div className="cat-node-left">
          {node.children?.length > 0 && (
            <span
              className="cat-toggle-icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          {isEditing ? (
            <input
              className="cat-input"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
            />
          ) : (
            <strong>{node.name}</strong>
          )}
        </div>

        <div className="cat-node-actions">
          <button
            className="cat-btn add-btn"
            onClick={() => setShowAddInput(!showAddInput)}
          >
            <Plus size={14} />
          </button>
          <button
            className="cat-btn edit-btn"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={14} />
          </button>
          <button className="cat-btn delete-btn" onClick={() => onDelete(node.id)}>
            <Trash size={14} />
          </button>
        </div>
      </div>

      {showAddInput && (
        <div className="cat-add-sub">
          <input
            className="cat-input"
            placeholder="Subcategory name"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
          />
          <button
            className="cat-btn success-btn"
            onClick={() => {
              if (newSubName.trim()) {
                onAddSub(node.id, newSubName.trim());
                setNewSubName("");
                setShowAddInput(false);
              }
            }}
          >
            Add
          </button>
        </div>
      )}

      {isExpanded && node.children?.length > 0 && (
        <div className="cat-children">
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              onAddSub={onAddSub}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Preview Component
const CategoryManagerPreview = () => {
  const [categories, setCategories] = useState(dummyCategories);

  const handleAddSub = (id, name) => {
    const addSubRecursive = (nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, children: [...node.children, { id: Date.now(), name, children: [] }] };
        }
        if (node.children.length > 0) node.children = addSubRecursive(node.children);
        return node;
      });
    setCategories(addSubRecursive(categories));
  };

  const handleRename = (id, name) => {
    const renameRecursive = (nodes) =>
      nodes.map((node) => {
        if (node.id === id) node.name = name;
        if (node.children.length > 0) node.children = renameRecursive(node.children);
        return node;
      });
    setCategories(renameRecursive(categories));
  };

  const handleDelete = (id) => {
    const deleteRecursive = (nodes) =>
      nodes
        .filter((node) => node.id !== id)
        .map((node) => {
          if (node.children.length > 0) node.children = deleteRecursive(node.children);
          return node;
        });
    setCategories(deleteRecursive(categories));
  };

  return (
    <div className="category-manager">
      <h3>📂 Category Manager Preview</h3>
      <div className="cat-tree">
        {categories.map((cat) => (
          <CategoryNode
            key={cat.id}
            node={cat}
            onAddSub={handleAddSub}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryManagerPreview;