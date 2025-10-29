// src/admin/components/MyLikes.jsx
import React from "react";
import { Heart } from "lucide-react";
import "./MyLikes.css";

const MyLikes = ({ likedPosts }) => {
  return (
    <div className="card">
      <div className="card-header">
        <Heart size={20} />
        <h4>Liked Posts</h4>
      </div>
      <div className="card-body">
        {likedPosts.length === 0 ? (
          <p>No liked posts.</p>
        ) : (
          likedPosts.map(post => (
            <div key={post.id} className="list-item">
              {post.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyLikes;