// src/admin/components/MyFavorites.jsx
import React from "react";
import { Star } from "lucide-react";
import "./MyFavorites.css";

const MyFavorites = ({ favorites }) => {
  return (
    <div className="card">
      <div className="card-header">
        <Star size={20} />
        <h4>Favorited Posts</h4>
      </div>
      <div className="card-body">
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          favorites.map(post => (
            <div key={post.id} className="list-item">
              {post.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyFavorites;