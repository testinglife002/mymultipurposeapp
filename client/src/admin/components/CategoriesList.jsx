// src/pages/dashboard/CategoriesList.jsx
// src/pages/dashboard/CategoriesList.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Edit3, Trash2, Folder, Plus, Move } from "lucide-react";
import newRequest from "../../api/newRequest";
import "./CategoriesList.css";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState(null);

  const dragItem = useRef();
  const dragOverItem = useRef();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await newRequest.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await newRequest.delete(`/categories/${slug}`);
      setCategories(categories.filter((cat) => cat.slug !== slug));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete category");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/categories", form);
      setCategories([res.data, ...categories]);
      setForm({ name: "", description: "" });
      setShowModal(false);
      setFormError(null);
    } catch (err) {
      console.error("Add category failed", err);
      setFormError(err.response?.data || "Server error");
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
    const newList = [...categories];
    const draggedItemContent = newList[dragItem.current];
    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setCategories(newList);
  };

  const handleDragEnd = async () => {
    // Optional: save new order to backend
    try {
      await newRequest.put("/categories/reorder", {
        categories: categories.map((c) => c.slug),
      });
    } catch (err) {
      console.error("Failed to save order", err);
    }
  };

  if (loading) return <p className="loading">Loading categories...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="categories-list-container">
      <div className="categories-header">
        <Folder size={22} className="icon" />
        <h2>Categories</h2>
      </div>

      <div className="categories-cards">
        {categories.map((category, index) => (
          <div
            key={category.slug}
            className="category-card draggable"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
          >
            <div className="card-drag-handle">
              <Move size={16} />
            </div>
            <h3>{category.name}</h3>
            <p>{category.description || "No description provided."}</p>
            <div className="card-actions">
              <Link
                to={`/dashboard/categories/edit/${category.slug}`}
                className="edit-btn"
              >
                <Edit3 size={16} /> Edit
              </Link>
              <button
                onClick={() => handleDelete(category.slug)}
                className="delete-btn"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Category Button */}
      <button className="add-category-btn" onClick={() => setShowModal(true)}>
        <Plus size={18} /> Add Category
      </button>

      {/* Add Category Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Category</h3>
            <form onSubmit={handleAddCategory} className="edit-category-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Enter category description"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-submit">
                  <Plus size={16} /> Add Category
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
              {formError && <p className="error-message">{formError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
