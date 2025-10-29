// src/admin/components/CommentForm.jsx
import React, { useState } from "react";
import newRequest from "../../api/newRequest";

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;

    try {
      await newRequest.post("/comments", { postId, content });
      setContent("");
      onCommentAdded();
      alert("Comment submitted for approval");
    } catch (err) {
      console.error(err);
      alert("Failed to submit comment");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a comment..." />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentForm;
