// src/admin/components/AllCategories.jsx
import React from "react";
import { Layers } from "lucide-react";
import SubscribeButton from "./SubscribeButton";
 import "./AllCategories.css";

const categories = ["Tech", "Science", "Business", "Sports", "Health", "Culture"];

const AllCategories = ({ user }) => {
  return (
    <div className="card">
      <div className="card-header">
        <Layers size={20} />
        <h4>All Categories</h4>
      </div>
      <div className="card-body">
        <ul className="category-list">
          {categories.map((category, i) => (
            <li key={i}>
              {category}
              <SubscribeButton user={user} categoryName={category} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllCategories;