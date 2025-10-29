// src/admin/pages/CategoryManagerDraggable.jsx
import React, { useState, useRef } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash } from "lucide-react";
import "./CategoryManagerDraggable.css";

// Dummy data
const dummyCategories = [
  { id: 1, name: "Electronics", children: [{ id: 2, name: "Mobile Phones", children: [] }] },
  { id: 3, name: "Fashion", children: [{ id: 4, name: "Men", children: [] }] },
];

// Recursive Node Component
const CategoryNode = ({ node, onAddSub, onDelete, onRename, onDrag }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(node.name);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSubName, setNewSubName] = useState("");

  const nodeRef = useRef();

  const handleRename = () => {
    if (nameInput.trim()) onRename(node.id, nameInput.trim());
    setIsEditing(false);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", node.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
    if (draggedId !== node.id) onDrag(draggedId, node.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="cat-node"
      draggable
      ref={nodeRef}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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

      <div
        className={`cat-children ${isExpanded ? "expanded" : "collapsed"}`}
      >
        {node.children?.map((child) => (
          <CategoryNode
            key={child.id}
            node={child}
            onAddSub={onAddSub}
            onDelete={onDelete}
            onRename={onRename}
            onDrag={onDrag}
          />
        ))}
      </div>
    </div>
  );
};

// Main Component
const CategoryManagerDraggable = () => {
  const [categories, setCategories] = useState(dummyCategories);

  const addSub = (id, name) => {
    const addRecursive = (nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, children: [...node.children, { id: Date.now(), name, children: [] }] };
        }
        if (node.children.length > 0) node.children = addRecursive(node.children);
        return node;
      });
    setCategories(addRecursive(categories));
  };

  const rename = (id, name) => {
    const renameRecursive = (nodes) =>
      nodes.map((node) => {
        if (node.id === id) node.name = name;
        if (node.children.length > 0) node.children = renameRecursive(node.children);
        return node;
      });
    setCategories(renameRecursive(categories));
  };

  const deleteNode = (id) => {
    const deleteRecursive = (nodes) =>
      nodes
        .filter((node) => node.id !== id)
        .map((node) => {
          if (node.children.length > 0) node.children = deleteRecursive(node.children);
          return node;
        });
    setCategories(deleteRecursive(categories));
  };

  const handleDrag = (draggedId, targetId) => {
    let draggedNode;
    const removeNode = (nodes) =>
      nodes
        .filter((node) => {
          if (node.id === draggedId) {
            draggedNode = node;
            return false;
          }
          return true;
        })
        .map((node) => {
          if (node.children.length > 0) node.children = removeNode(node.children);
          return node;
        });
    const newTree = removeNode(categories);

    const insertNode = (nodes) =>
      nodes.map((node) => {
        if (node.id === targetId) node.children.push(draggedNode);
        if (node.children.length > 0) node.children = insertNode(node.children);
        return node;
      });
    setCategories(insertNode(newTree));
  };

  return (
    <div className="category-manager">
      <h3>📂 Draggable Category Manager</h3>
      <div className="cat-tree">
        {categories.map((cat) => (
          <CategoryNode
            key={cat.id}
            node={cat}
            onAddSub={addSub}
            onDelete={deleteNode}
            onRename={rename}
            onDrag={handleDrag}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryManagerDraggable;