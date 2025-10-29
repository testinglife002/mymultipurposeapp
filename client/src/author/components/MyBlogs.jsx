// src/admin/components/MyBlogs.jsx
// src/components/Dashboard/MyBlogs.jsx
import React, { useEffect, useState } from "react";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import "./MyBlogs.css";

const MyBlogs = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "blogs"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, snap => setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteDoc(doc(db, "blogs", id));
  };

  return (
    <div>
      <h3>My Blogs</h3>
      <div className="posts-grid">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            {blog.imgUrl && <img src={blog.imgUrl} alt={blog.title} className="post-img" />}
            <div className="post-content">
              <h4>{blog.title}</h4>
              <p><strong>Category:</strong> {blog.categoryType} | <strong>Segment:</strong> {blog.segment}</p>
              <div className="post-tags">
                {blog.tags?.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
              <div className="post-actions">
                <button className="btn-view" onClick={() => setShowModal(blog)}><FiEye /> View</button>
                <button className="btn-edit" onClick={() => alert("Edit functionality")}><FiEdit /> Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(blog.id)}><FiTrash2 /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{showModal.title}</h4>
            {showModal.imgUrl && <img src={showModal.imgUrl} className="img-fluid" alt={showModal.title} />}
            <p>{showModal.description}</p>
            <button className="btn-close" onClick={() => setShowModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
