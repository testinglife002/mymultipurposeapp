// src/admin/pages/AnotherManager.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash } from "lucide-react";

import { buildCategoryTree } from "../components/buildCategoryTree";
import "./AnotherManager.css";

const CatNode = ({ node, onAddSub, onDelete, onRename }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(node.name);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSubName, setNewSubName] = useState("");

  const handleRename = () => {
    if (nameInput.trim()) {
    
    }
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
          <button
            className="cat-btn delete-btn"
            onClick={() => onDelete(node.id)}
          >
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
            <CatNode
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

const AnotherManager = () => {
  const [categories, setCategories] = useState([]);
  const [rootName, setRootName] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCategories = async () => {
    const all = await getCategoriesAlt();
    setCategories(all);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddRoot = async () => {
    if (!rootName.trim()) return;
   
    setRootName("");
    fetchCategories();
  };

  const handleAddSub = async (parentId, name) => {
  
    fetchCategories();
  };

  const handleRename = async (id, newName) => {
    if (!newName.trim()) return;
  
    fetchCategories();
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCategoryAlt(deleteId);
      setDeleteId(null);
      setShowDeleteModal(false);
      fetchCategories();
    }
  };

  const tree = buildCategoryTree(categories);

  return (
    <div className="category-manager">
      <h3>📂 Category Manager</h3>
      <div className="cat-links">
        <Link to="/dashboard/category-manager" className="cat-link info">
          Category
        </Link>
        <Link to="/dashboard/category-manager-alt" className="cat-link warning">
          Category Alt
        </Link>
        <Link to="/dashboard/category-manager-ui" className="cat-link secondary">
          Category UI
        </Link>
      </div>

      <div className="cat-add-root">
        <input
          placeholder="New root category"
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
        />
        <button className="cat-btn primary-btn" onClick={handleAddRoot}>
          + Add Root
        </button>
      </div>

      <div className="cat-tree">
        {tree.map((cat) => (
          <CatNode
            key={cat.id}
            node={cat}
            onAddSub={handleAddSub}
            onDelete={confirmDelete}
            onRename={handleRename}
          />
        ))}
      </div>

      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this category?</p>
            <div className="modal-actions">
              <button
                className="cat-btn secondary-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="cat-btn delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnotherManager;