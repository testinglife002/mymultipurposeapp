// 🔹 CategoryManagerAlt.jsx
// src/admin/components/CategoryManagerAlt.jsx
// src/admin/components/CategoryManagerAlt.jsx
// src/admin/components/CategoryManagerAlt.jsx
import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  X,
  Link as LinkIcon,
  CheckCircle,
} from "lucide-react";
import newRequest from "../../api/newRequest";
import "./CategoryManagerAlt.css";

const CategoryManagerAlt = () => {
  const [categories, setCategories] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    description: "",
  });
  const [slugAvailable, setSlugAvailable] = useState(null);

  // Fetch categories
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

  // Slug validation
  useEffect(() => {
    if (!formData.slug) {
      setSlugAvailable(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await newRequest.get(
          `/categories/check-slug?slug=${formData.slug}`
        );
        setSlugAvailable(res.data.available);
      } catch (err) {
        console.error(err);
        setSlugAvailable(null);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [formData.slug]);

  const handleShow = (category = null, isSub = false) => {
    if (category && !isSub) {
      setEditId(category._id);
      setFormData({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId || "",
        description: category.description || "",
      });
    } else if (category && isSub) {
      // Adding subcategory inline
      setEditId(null);
      setFormData({
        name: "",
        slug: "",
        parentId: category._id,
        description: "",
      });
    } else {
      // Add top-level category
      setEditId(null);
      setFormData({ name: "", slug: "", parentId: "", description: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await newRequest.put(`/categories/${formData.slug}`, formData);
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

  // Build recursive tree
  const buildCategoryTree = (parentId = null) => {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => {
        const children = buildCategoryTree(cat._id);
        return (
          <TreeNode
            key={cat._id}
            category={cat}
            childrenNodes={children}
            onEdit={handleShow}
            onDelete={handleDelete}
            onAddSub={() => handleShow(cat, true)}
          />
        );
      });
  };

  // Tree Node
  const TreeNode = ({ category, childrenNodes, onEdit, onDelete, onAddSub }) => {
    const [expanded, setExpanded] = useState(false);
    const subCount = childrenNodes.length;

    return (
      <div className="tree-node-box">
        <div className="tree-node-content">
          {subCount > 0 && (
            <button
              className="icon-btn chevron"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <span className="tree-label">
            {category.name} {subCount > 0 && <span className="subcount">({subCount})</span>}
          </span>
          <div className="tree-actions">
            <button className="btn small success" onClick={onAddSub}>
              <Plus size={12} /> Sub
            </button>
            <button className="btn small warning" onClick={() => onEdit(category)}>
              <Edit2 size={12} />
            </button>
            <button className="btn small danger" onClick={() => onDelete(category._id)}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {expanded && subCount > 0 && <div className="tree-children">{childrenNodes}</div>}
      </div>
    );
  };

  return (
    <div className="cat-manager">
      <div className="cat-header">
        <h2>📂 Category Manager</h2>
        <button className="btn primary" onClick={() => handleShow()}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="cat-tree">{buildCategoryTree()}</div>

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
                Name
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    });
                  }}
                />
              </label>

              <label>
                Slug
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                />
                {formData.slug && (
                  <p className={`slug-preview ${slugAvailable ? "available" : "unavailable"}`}>
                    <LinkIcon size={12} /> /categories/{formData.slug}{" "}
                    {slugAvailable ? <CheckCircle size={12} /> : <X size={12} />}
                  </p>
                )}
              </label>

              <label>
                Description
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </label>

              <label>
                Parent Category
                <select
                  value={formData.parentId}
                  onChange={(e) =>
                    setFormData({ ...formData, parentId: e.target.value })
                  }
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
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={slugAvailable === false}>
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

export default CategoryManagerAlt;



