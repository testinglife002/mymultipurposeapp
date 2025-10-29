//🔹 Updated CategoryManagerToggle.jsx with 
// src/admin/pages/CategoryManagerToggle.jsx
import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, X, List } from "lucide-react";
import newRequest from "../../api/newRequest";
import "./CategoryManagerToggle.css";

const CategoryManagerToggle = () => {
  const [categories, setCategories] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editSlug, setEditSlug] = useState(null);
  const [formData, setFormData] = useState({ name: "", parentId: "", description: "" });
  const [viewMode, setViewMode] = useState("table"); // "table" or "tree"

  const fetchCategories = async () => {
    try {
      const res = await newRequest.get("/categories");
      setCategories(res.data);
      setParentOptions(res.data.filter((cat) => !cat.parentId));
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleShow = (category = null) => {
    if (category) {
      setEditId(category._id);
      setEditSlug(category.slug);
      setFormData({
        name: category.name,
        parentId: category.parentId || "",
        description: category.description || "",
      });
    } else {
      setEditId(null);
      setFormData({ name: "", parentId: "", description: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSlug) {
        await newRequest.put(`/categories/${editSlug}`, formData);
      } else {
        await newRequest.post("/categories", formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Failed to save category", err);
      alert("Error saving category");
    }
  };

  const handleDelete = async (idOrSlug) => {
    if (window.confirm("Delete this category?")) {
      try {
        await newRequest.delete(`/categories/${idOrSlug}`);
        fetchCategories();
      } catch (err) {
        console.error("Failed to delete category", err);
        alert("Error deleting category");
      }
    }
  };

  // Recursive tree view
  const buildCategoryTree = (parentId = null) => {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => (
        <TreeNode key={cat._id} category={cat} childrenNodes={buildCategoryTree(cat._id)} />
      ));
  };

  const TreeNode = ({ category, childrenNodes }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="tree-node">
        <div className="tree-node-content">
          {childrenNodes.length > 0 && (
            <button className="icon-btn chevron" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <span>{category.name}</span>
          <div className="tree-actions">
            <button className="btn small warning" onClick={() => handleShow(category)}>
              <Edit2 size={12} />
            </button>
            <button className="btn small danger" onClick={() => handleDelete(category._id)}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        {expanded && childrenNodes.length > 0 && (
          <div className="tree-children">{childrenNodes}</div>
        )}
      </div>
    );
  };

  return (
    <div className="cat-manager">
      <div className="cat-header">
        <h2>📂 Category Manager</h2>
        <div className="cat-header-actions">
          <button className="btn toggle-view" onClick={() => setViewMode(viewMode === "table" ? "tree" : "table")}>
            <List size={16} /> {viewMode === "table" ? "Tree View" : "Table View"}
          </button>
          <button className="btn primary" onClick={() => handleShow()}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <table className="cat-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Parent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{categories.find((p) => p._id === cat.parentId)?.name || "—"}</td>
                <td className="table-actions">
                  <button className="btn small warning" onClick={() => handleShow(cat)}>
                    <Edit2 size={12} />
                  </button>
                  <button className="btn small danger" onClick={() => handleDelete(cat._id)}>
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Tree View */}
      {viewMode === "tree" && <div className="cat-tree">{buildCategoryTree()}</div>}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editId ? "Edit Category" : "Add Category"}</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Category Name
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </label>
              <label>
                Parent Category
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <option value="">None (Top Level)</option>
                  {parentOptions.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="modal-footer">
                <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagerToggle;