// src/admin/pages/NewCategoryManager.jsx
// NewCategoryManager.jsx (with dummy data + drag & drop)
import React, { useEffect, useState } from "react";
import {
  Folder,
  FolderOpen,
  Edit2,
  Plus,
  Trash2,
  Move,
} from "lucide-react";
import "./NewCategoryManager.css";

const DUMMY_DATA = [
  { id: "1", name: "Work", parentId: null },
  { id: "2", name: "Personal", parentId: null },
  { id: "3", name: "Urgent", parentId: "1" },
  { id: "4", name: "Optional", parentId: "1" },
  { id: "5", name: "Hobbies", parentId: "2" },
];

const NewCategoryManager = () => {
  const [categories, setCategories] = useState(DUMMY_DATA);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter(
    (cat) => !cat.parentId && cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const getSubcategories = (parentId) =>
    categories.filter((cat) => cat.parentId === parentId);

  // ===== Drag & Drop =====
  const [draggingId, setDraggingId] = useState(null);

  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDrop = (targetId) => {
    if (!draggingId || draggingId === targetId) return;

    const dragCat = categories.find((c) => c.id === draggingId);
    const targetCat = categories.find((c) => c.id === targetId);

    if (dragCat.parentId === targetCat.parentId) {
      // same level, reorder
      const siblings = categories.filter(
        (c) => c.parentId === dragCat.parentId && c.id !== draggingId
      );
      const index = siblings.findIndex((c) => c.id === targetId);
      siblings.splice(index, 0, dragCat);
      const newCats = categories.map((c) =>
        c.parentId === dragCat.parentId
          ? siblings.find((s) => s.id === c.id) || c
          : c
      );
      setCategories(newCats);
    }
    setDraggingId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ===== Category Actions =====
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat = { id: Date.now().toString(), name: newCategoryName.trim(), parentId: null };
    setCategories([...categories, newCat]);
    setNewCategoryName("");
  };

  const handleAddSubcategory = () => {
    if (!selectedParentId || !subCategoryName.trim()) return;
    const newSub = {
      id: Date.now().toString(),
      name: subCategoryName.trim(),
      parentId: selectedParentId,
    };
    setCategories([...categories, newSub]);
    setSubCategoryName("");
    setSelectedParentId(null);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setEditCategoryName(cat.name);
    setEditModalVisible(true);
  };

  const handleUpdate = () => {
    if (editingCategory && editCategoryName.trim()) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...c, name: editCategoryName } : c
        )
      );
      setEditModalVisible(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setCategories(categories.filter((c) => c.id !== id && c.parentId !== id));
  };

  const handleToggle = (id) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="category-manager">
      <h2>Category Manager (Demo)</h2>

      <div className="category-controls">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-search"
        />
        <div className="input-group">
          <input
            type="text"
            placeholder="New main category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="input-new"
          />
          <button className="btn-primary" onClick={handleAddCategory}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <ul className="category-list">
        {filteredCategories.map((cat) => {
          const subcats = getSubcategories(cat.id);
          return (
            <li
              key={cat.id}
              className="category-item"
              draggable
              onDragStart={() => handleDragStart(cat.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(cat.id)}
            >
              <div className="category-header">
                <button className="btn-icon" onClick={() => handleToggle(cat.id)}>
                  {expandedCategories[cat.id] ? <FolderOpen size={20} /> : <Folder size={20} />}
                </button>
                <strong>{cat.name}</strong>
                <span className="subcount">({subcats.length} subcategories)</span>

                <div className="category-actions">
                  <button className="btn-outline" onClick={() => handleEdit(cat)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-outline-danger" onClick={() => handleDelete(cat.id)}>
                    <Trash2 size={16} />
                  </button>
                  {selectedParentId === cat.id ? (
                    <>
                      <input
                        type="text"
                        placeholder="Subcategory name"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        className="input-sub"
                      />
                      <button className="btn-success" onClick={handleAddSubcategory}>
                        Add
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-outline-primary"
                      onClick={() => setSelectedParentId(cat.id)}
                    >
                      + Subcategory
                    </button>
                  )}
                </div>
              </div>

              {expandedCategories[cat.id] && (
                <ul className="subcategory-list">
                  {subcats.map((sub) => (
                    <li
                      key={sub.id}
                      className="subcategory-item"
                      draggable
                      onDragStart={() => handleDragStart(sub.id)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(sub.id)}
                    >
                      <Folder size={16} className="sub-icon" />
                      <span>{sub.name}</span>
                      <div className="subcategory-actions">
                        <button className="btn-outline" onClick={() => handleEdit(sub)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-outline-danger" onClick={() => handleDelete(sub.id)}>
                          <Trash2 size={16} />
                        </button>
                        <Move size={16} className="move-icon" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {editModalVisible && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Category</h3>
            <input
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="input-edit"
            />
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setEditModalVisible(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCategoryManager;




/*
import React, { useEffect, useState } from "react";
import {
  Folder,
  FolderOpen,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  addCategoryNew,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/CategoryService";
import "./NewCategoryManager.css";

const NewCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const saved = localStorage.getItem("expandedCategories");
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    const all = await getCategories();
    setCategories(all);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem("expandedCategories", JSON.stringify(expandedCategories));
  }, [expandedCategories]);

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;
    await addCategoryNew({ name: trimmedName, parentId: null });
    setNewCategoryName("");
    fetchCategories();
  };

  const handleAddSubcategory = async () => {
    if (!selectedParentId || !subCategoryName.trim()) return;
    await addCategoryNew({
      name: subCategoryName.trim(),
      parentId: selectedParentId,
    });
    setSubCategoryName("");
    setSelectedParentId(null);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setEditCategoryName(cat.name);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (editingCategory && editCategoryName.trim()) {
      await updateCategory(editingCategory.id, { name: editCategoryName, parentId: null });
      setEditModalVisible(false);
      fetchCategories();
    }
  };

  const handleToggle = (id) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  const filteredCategories = categories.filter(
    (cat) => !cat.parentId && typeof cat.name === "string" && cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const getSubcategories = (parentId) =>
    categories.filter((cat) => cat.parentId === parentId);

  return (
    <div className="category-manager">
      <h2>Category Manager</h2>

      <div className="category-controls">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-search"
        />
        <div className="input-group">
          <input
            type="text"
            placeholder="New main category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="input-new"
          />
          <button className="btn-primary" onClick={handleAddCategory}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <ul className="category-list">
        {filteredCategories.map((cat) => {
          const subcats = getSubcategories(cat.id);
          return (
            <li key={cat.id} className="category-item">
              <div className="category-header">
                <button
                  className="btn-icon"
                  onClick={() => handleToggle(cat.id)}
                >
                  {expandedCategories[cat.id] ? <FolderOpen size={20} /> : <Folder size={20} />}
                </button>
                <strong>{cat.name}</strong>
                <span className="subcount">({subcats.length} subcategories)</span>

                <div className="category-actions">
                  <button className="btn-outline" onClick={() => handleEdit(cat)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-outline-danger" onClick={() => handleDelete(cat.id)}>
                    <Trash2 size={16} />
                  </button>
                  {selectedParentId === cat.id ? (
                    <>
                      <input
                        type="text"
                        placeholder="Subcategory name"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        className="input-sub"
                      />
                      <button className="btn-success" onClick={handleAddSubcategory}>
                        Add
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-outline-primary"
                      onClick={() => setSelectedParentId(cat.id)}
                    >
                      + Subcategory
                    </button>
                  )}
                </div>
              </div>

              {expandedCategories[cat.id] && (
                <ul className="subcategory-list">
                  {subcats.map((sub) => (
                    <li key={sub.id} className="subcategory-item">
                      <Folder size={16} className="sub-icon" />
                      <span>{sub.name}</span>
                      <div className="subcategory-actions">
                        <button className="btn-outline" onClick={() => handleEdit(sub)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-outline-danger" onClick={() => handleDelete(sub.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {editModalVisible && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Category</h3>
            <input
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="input-edit"
            />
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setEditModalVisible(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCategoryManager;
*/

