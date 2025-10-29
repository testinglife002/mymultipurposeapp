// src/admin/components/CommentsOnMyPosts.jsx
import React from "react";
import { MessageCircle } from "lucide-react";
import "./CommentsOnMyPosts.css";

const CommentsOnMyPosts = ({ comments }) => {
  return (
    <div className="card">
      <div className="card-header">
        <MessageCircle size={20} />
        <h4>Comments on Your Posts</h4>
      </div>
      <div className="card-body">
        {comments.map(c => (
          <div key={c.id} className="comment-card">
            <p><strong>{c.commenterName}</strong> on <em>{c.postTitle}</em></p>
            <p>{c.commentText}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsOnMyPosts;