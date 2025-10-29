// src/admin/components/CategoryTreeView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderTree, Plus } from "lucide-react";
// import CategoryNode from "./CategoryNode";
import AddCategoryUI from "./AddCategoryUI";
import "./CategoryTreeView.css";
import CategoryNodeII from "./CategoryNodeII";

const CategoryTreeView = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-tree-container">
      <div className="category-tree-header">
        <FolderTree className="tree-icon" />
        <h2>Category Tree</h2>
      </div>

      <div className="add-category-box">
        <AddCategoryUI onCategoryAdded={fetchCategories} />
      </div>

      <div className="tree-list">

            <CategoryNodeII
      
      
          
            />
         
  
          <p className="empty-message">
            <Plus size={18} /> No categories yet. Add one above.
          </p>
   
      </div>
    </div>
  );
};

export default CategoryTreeView;