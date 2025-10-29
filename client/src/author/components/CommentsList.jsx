// src/author/components/CommentsList.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";

const CommentsList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await newRequest.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchComments(); }, [postId]);

  return (
    <div className="comments-container">
      {comments.length === 0 ? <p>No comments yet.</p> : 
        comments.map((c) => (
          <div key={c._id} className="comment-item">
            <b>{c.userId.username}</b>: {c.content}
          </div>
        ))
      }
    </div>
  );
};

export default CommentsList;