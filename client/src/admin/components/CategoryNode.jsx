// src/admin/components/CategoryNode.jsx
import React, { useState } from "react";
import { Plus, Edit2, Check, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import "../pages/CategoryManager.css";

const CategoryNode = ({ node, onAddSub, onUpdate, onDelete, onDragStart, onDrop }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [subName, setSubName] = useState("");

  const handleEdit = () => {
    if (editing && editName.trim()) onUpdate(node.id, editName);
    setEditing(!editing);
  };

  const handleAddSub = (e) => {
    e.preventDefault();
    if (!subName.trim()) return;
    onAddSub(subName, node.id);
    setSubName("");
    setOpen(true);
  };

  return (
    <div
      className="category-node"
      draggable
      onDragStart={() => onDragStart(node)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(node)}
    >
      <div className="node-header">
        <span className="toggle" onClick={() => setOpen(!open)}>
          {node.children?.length ? (open ? <ChevronDown size={16}/> : <ChevronRight size={16}/>) : null}
        </span>

        {editing ? (
          <input
            className="edit-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        ) : (
          <strong>{node.name}</strong>
        )}

        <div className="node-actions">
          <button className="btn-edit" onClick={handleEdit}>
            {editing ? <Check size={16}/> : <Edit2 size={16}/>}
          </button>
          <button className="btn-delete" onClick={() => onDelete(node.id)}>
            <Trash2 size={16}/>
          </button>
        </div>
      </div>

      {open && (
        <div className="node-children">
          <form className="add-sub" onSubmit={handleAddSub}>
            <input
              type="text"
              placeholder="Add subcategory"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
            />
            <button className="btn-success" type="submit">
              <Plus size={14}/> Add
            </button>
          </form>

          {node.children?.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              onAddSub={onAddSub}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNode;


