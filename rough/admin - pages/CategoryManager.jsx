// src/admin/pages/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import CategoryNode from "../components/CategoryNode";
// import buildCategoryTree from "../components/buildCategoryTree";
import { dummyCategories } from "./dummyCategories";
import { Plus, Layers } from "lucide-react";
import "./CategoryManager.css";
import { buildCategoryTree } from "../components/buildCategoryTree";


const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [draggedNode, setDraggedNode] = useState(null);

  useEffect(() => {
    setCategories(buildCategoryTree(dummyCategories));
  }, []);

  const handleAddMain = () => {
    if (!name.trim()) return;
    const newCat = { id: Date.now(), name, parentId: null };
    dummyCategories.push(newCat);
    setCategories(buildCategoryTree(dummyCategories));
    setName("");
  };

  const handleAddSub = (subName, parentId) => {
    const newSub = { id: Date.now(), name: subName, parentId };
    dummyCategories.push(newSub);
    setCategories(buildCategoryTree(dummyCategories));
  };

  const handleUpdate = (id, newName) => {
    const cat = dummyCategories.find((c) => c.id === id);
    if (cat) cat.name = newName;
    setCategories(buildCategoryTree(dummyCategories));
  };

  const handleDelete = (id) => {
    const removeRecursively = (catId) => {
      const children = dummyCategories.filter((c) => c.parentId === catId);
      children.forEach((child) => removeRecursively(child.id));
      const index = dummyCategories.findIndex((c) => c.id === catId);
      if (index !== -1) dummyCategories.splice(index, 1);
    };
    removeRecursively(id);
    setCategories(buildCategoryTree(dummyCategories));
  };

  const handleDragStart = (node) => setDraggedNode(node);

  const handleDrop = (targetNode) => {
    if (!draggedNode || draggedNode.id === targetNode.id) return;
    const draggedIndex = dummyCategories.findIndex((c) => c.id === draggedNode.id);
    const targetIndex = dummyCategories.findIndex((c) => c.id === targetNode.id);
    // Swap positions in dummyCategories array
    [dummyCategories[draggedIndex], dummyCategories[targetIndex]] = [dummyCategories[targetIndex], dummyCategories[draggedIndex]];
    setCategories(buildCategoryTree(dummyCategories));
    setDraggedNode(null);
  };

  return (
    <div className="category-manager">
      <h2 className="cm-title"><Layers size={24} className="me-2"/> Category Manager Preview</h2>

      <div className="cm-add-main">
        <input
          type="text"
          placeholder="New main category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn-primary" onClick={handleAddMain}>
          <Plus size={16} className="me-1"/> Add
        </button>
      </div>

      <div className="cm-tree">
        {categories.map((cat) => (
          <CategoryNode
            key={cat.id}
            node={cat}
            onAddSub={handleAddSub}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;

