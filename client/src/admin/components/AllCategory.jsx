// src/admin/components/AllCategory.jsx
// src/pages/dashboard/AllCategory.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2 } from "lucide-react";
import newRequest from "../../api/newRequest";
import "./AllCategory.css";

const AllCategory = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await newRequest.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await newRequest.delete(`/categories/${slug}`);
        fetchCategories();
      } catch (err) {
        console.error("Failed to delete category", err);
        alert("Delete failed!");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="cat-page">
      <div className="cat-header">
        <h3>All Categories</h3>
        <Link to="/dashboard/add-category" className="cat-add-btn">
          <Plus size={18} /> Add New
        </Link>
      </div>

      <div className="cat-table-wrapper">
        <table className="cat-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id} style={{ animationDelay: `${index * 0.05}s` }}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td className="cat-slug">{cat.slug}</td>
                <td className="cat-actions">
                  <Link
                    to={`/dashboard/edit-category/${cat.slug}`}
                    className="cat-btn cat-edit"
                  >
                    <Edit3 size={16} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.slug)}
                    className="cat-btn cat-delete"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="cat-empty">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <br/><br/><br/><br/><br/><br/><br/><br/>
    </div>
  );
};

export default AllCategory;
