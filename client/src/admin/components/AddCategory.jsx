// src/admin/components/AddCategory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../api/newRequest";
import {
  FolderPlus,
  AlignLeft,
  Tag,
  Layers,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./AddCategory.css";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const navigate = useNavigate();

  const slugExists = categories.some((cat) => cat.slug === slug);

  useEffect(() => {
    if (!slug) {
      setSlugAvailable(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await newRequest.get(`/categories/check-slug?slug=${slug}`);
        setSlugAvailable(res.data.available);
      } catch (err) {
        console.error(err);
        setSlugAvailable(null);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [slug]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await newRequest.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/categories", {
        name,
        slug,
        parentId: parentId || null,
        description,
      });
      navigate("/admin/dashboard/all-category");
    } catch (err) {
      console.error(err);
      setError("Failed to add category. Try again.");
    }
  };

  return (
    <div className="add-category-container">
      <h3 className="form-title">
        <FolderPlus className="icon" /> Add Category
      </h3>

      <form className="category-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <Tag className="icon-sm" /> Name
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            required
          />
          {name && (
            <p
              className={`slug-preview ${
                slugAvailable === true
                  ? "available"
                  : slugAvailable === false || slugExists
                  ? "unavailable"
                  : ""
              }`}
            >
              <LinkIcon className="icon-sm" />
              <a href={`/categories/${slug}`} target="_blank" rel="noopener noreferrer">
                /categories/{slug}
              </a>
              {(slugAvailable === true && !slugExists) && <CheckCircle className="icon-sm" />}
              {(slugAvailable === false || slugExists) && <XCircle className="icon-sm" />}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>
            <AlignLeft className="icon-sm" /> Slug
          </label>
          <input
            type="text"
            placeholder="Generated slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <AlignLeft className="icon-sm" /> Description
          </label>
          <textarea
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            <Layers className="icon-sm" /> Parent Category
          </label>
          <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">Select Parent Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <div className="tooltip-wrapper">
            <button
              type="submit"
              className="btn-submit"
              disabled={slugExists || slugAvailable === false}
            >
              <FolderPlus className="icon-sm" /> Add Category
            </button>
            {slugExists && (
              <span className="tooltip-text">
                Slug already exists. Edit it or let backend generate a unique slug.
              </span>
            )}
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
        
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

      </form>
    </div>
  );
};

export default AddCategory;



