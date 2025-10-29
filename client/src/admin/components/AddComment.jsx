// 🧩 1️⃣ Create src/components/AddComment.jsx
// src/components/AddComment.jsx
import React, { useState } from "react";
import newRequest from "../../api/newRequest";
import "./AddComment.css";

const AddComment = ({ postId, onCommentAdded, user }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return setMessage("Comment cannot be empty");

    setLoading(true);
    try {
      const autoApproved = user?.role === "admin" || user?.role === "author";
      const res = await newRequest.post("/comments", {
        postId,
        content,
        approved: autoApproved,
      });

      setMessage(
        autoApproved
          ? "✅ Comment published successfully!"
          : "🕓 Comment submitted for approval."
      );
      setContent("");
      onCommentAdded();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-comment">
      <h4>Add a Comment</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
      {message && <p className="comment-msg">{message}</p>}
    </div>
  );
};

export default AddComment;


