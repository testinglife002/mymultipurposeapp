// src/admin/components/DisplayUserBlogs.jsx
import React from "react";
import "./DisplayUserBlogs.css";

const DisplayUserBlogs = ({ userBlogs }) => {
  return (
    <div>
      <h3 className="section-title">Your Blog Posts</h3>
      {userBlogs?.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="blog-grid">
          {userBlogs.map(post => (
            <div className="blog-card" key={post.id}>
              {post.imgUrl && <img src={post.imgUrl} alt={post.title} />}
              <div className="blog-content">
                <h4>{post.title}</h4>
                <p>{post.description?.slice(0, 100)}...</p>
                <small>{new Date(post.timestamp?.seconds * 1000).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayUserBlogs;