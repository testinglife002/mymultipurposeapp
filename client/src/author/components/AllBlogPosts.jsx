// src/user/components/AllBlogPosts.jsx
import React from "react";
import { FileText } from "lucide-react";
import "./AllBlogPosts.css";

const AllBlogPosts = ({ allPosts }) => {
  return (
    <div className="card">
      <div className="card-header">
        <FileText size={20} />
        <h4>All Blog Posts</h4>
      </div>
      <div className="card-body">
        {allPosts?.map(post => (
          <div className="post-item" key={post.id}>
            <h5>{post.title}</h5>
            <p>{post.description?.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBlogPosts;