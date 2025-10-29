// ✅ React Component
// src/admin/components/EditCategory.jsx
// src/pages/dashboard/EditCategory.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PencilLine, Save, AlertCircle } from "lucide-react";
import newRequest from "../../utils/newRequest";
import "./EditCategory.css";

const EditCategory = () => {
  const { slug } = useParams();
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await newRequest.get(`/categories/${slug}`);
        setForm({
          name: res.data.name,
          description: res.data.description,
        });
      } catch (err) {
        console.error("Failed to fetch category", err);
        setError("Category not found");
      }
    };

    fetchCategory();
  }, [slug]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await newRequest.put(`/categories/${slug}`, form);
      alert("Category updated successfully!");
      navigate("/dashboard/categories");
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data || "Server error");
    }
  };

  return (
    <div className="edit-category-container">
      <div className="edit-category-header">
        <PencilLine size={22} className="icon" />
        <h2>Edit Category</h2>
      </div>

      <form onSubmit={handleUpdate} className="edit-category-form">
        <div className="form-group">
          <label>Category Name</label>
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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter category description"
          />
        </div>

        <button type="submit" className="btn-submit">
          <Save size={18} /> Update Category
        </button>

        {error && (
          <p className="error-message">
            <AlertCircle size={16} /> {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default EditCategory;