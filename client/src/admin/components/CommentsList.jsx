// 🧩 2️⃣ Create src/components/CommentsList.jsx
// src/components/CommentsList.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";
import "./CommentsList.css";

const CommentsList = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await newRequest.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await newRequest.patch(`/comments/${id}/approve`);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await newRequest.delete(`/comments/${id}`);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  if (loading) return <p>Loading comments...</p>;
  if (comments.length === 0) return <p>No comments yet.</p>;

  return (
    <div className="comments-list">
      {comments.map((c) => (
        <div
          key={c._id}
          className={`comment-item ${!c.approved ? "pending" : ""}`}
        >
          <div className="comment-header">
            <span className="comment-user">{c.userId?.username || "Anonymous"}</span>
            <span className="comment-date">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="comment-content">{c.content}</p>

          {/* 🔹 Show Approve/Delete buttons only for admins/authors */}
          {(!c.approved && (user?.role === "admin" || user?.role === "author")) && (
            <div className="comment-actions">
              <button className="approve-btn" onClick={() => handleApprove(c._id)}>
                Approve
              </button>
              <button className="delete-btn" onClick={() => handleDelete(c._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;


