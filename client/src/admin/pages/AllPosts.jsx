// src/pages/post/AllPosts.jsx
// src/pages/post/AllPosts.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash2, LayoutGrid, List, Table, Check, X } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import newRequest from "../../api/newRequest";
import "./AllPosts.css";

const AllPosts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState("card"); // card | list | table
  const [loading, setLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "", status: "" });

  // ---------- Fetch Posts ----------
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await newRequest.get('/posts');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchPosts();
  }, [user]);

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await newRequest.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      alert("Post deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting post.");
    }
  };

  // ---------- Edit ----------
  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditData({ title: post.title, description: post.description, status: post.status });
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditData({ title: "", description: "", status: "" });
  };

  const saveEdit = async (postId) => {
    try {
      const res = await newRequest.put(`/posts/${postId}`, editData);
      setPosts(posts.map((p) => (p._id === postId ? res.data : p)));
      setEditingPostId(null);
      alert("Post updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating post.");
    }
  };

  // ---------- Routes ----------
  const getPostLink = (post) => `/admin/dashboard/slug/${post.slug}`; // public link
  const getEditLink = (post) => `/admin/dashboard/edit-post/${post.slug}`; // admin edit link

  // ---------- Scrollable style ----------
  const scrollableStyle = {
    maxHeight: "70vh",
    overflowY: "auto",
    overflowX: "hidden",
    paddingRight: "8px",
  };

  // -------- Render Views --------
  const renderCardView = () => (
    <div className="posts-card-view" style={scrollableStyle}>
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          {editingPostId === post._id ? (
            <>
              <input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="edit-title"
              />
              <MDEditor
                value={editData.description}
                onChange={(val) => setEditData({ ...editData, description: val })}
              />
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="edit-actions">
                <button onClick={() => saveEdit(post._id)}><Check size={16}/> Save</button>
                <button onClick={cancelEditing}><X size={16}/> Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: post.description.slice(0, 100) + "..." }} />
              <span>Status: {post.status}</span>
              <div className="post-actions">
                <Link to={getPostLink(post)} title="View"><Eye size={16} /></Link>
                <Link to={getEditLink(post)} title="Edit"><Edit size={16} /></Link>
                <button onClick={() => handleDelete(post._id)} title="Delete"><Trash2 size={16} /></button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="posts-list-view" style={scrollableStyle}>
      {posts.map((post) => (
        <div key={post._id} className="post-list-item">
          {editingPostId === post._id ? (
            <>
              <input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="edit-title"
              />
              <MDEditor
                value={editData.description}
                onChange={(val) => setEditData({ ...editData, description: val })}
              />
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="edit-actions">
                <button onClick={() => saveEdit(post._id)}><Check size={16}/> Save</button>
                <button onClick={cancelEditing}><X size={16}/> Cancel</button>
              </div>
            </>
          ) : (
            <>
              <span className="title">{post.title}</span>
              <span className="status">{post.status}</span>
              <div className="actions">
                <Link to={getPostLink(post)} title="View"><Eye size={16} /></Link>
                <Link to={getEditLink(post)} title="Edit"><Edit size={16} /></Link>
                <button onClick={() => handleDelete(post._id)} title="Delete"><Trash2 size={16} /></button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <table className="posts-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Channel</th>
          <th>Category</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post._id}>
            <td>{editingPostId === post._id ? (
              <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
            ) : post.title}</td>
            <td>{editingPostId === post._id ? (
              <MDEditor value={editData.description} onChange={(val) => setEditData({ ...editData, description: val })} />
            ) : <span dangerouslySetInnerHTML={{ __html: post.description.slice(0, 80) + "..." }} />}
            </td>
            <td>{editingPostId === post._id ? (
              <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            ) : post.status}</td>
            <td>{post.channelTitle || "-"}</td>
            <td>{post.categoryTitle || "-"}</td>
            <td>{new Date(post.createdAt).toLocaleDateString()}</td>
            <td>
              {editingPostId === post._id ? (
                <>
                  <button onClick={() => saveEdit(post._id)} title="Save"><Check size={16}/></button>
                  <button onClick={cancelEditing} title="Cancel"><X size={16}/></button>
                </>
              ) : (
                <>
                  <Link to={getPostLink(post)} title="View"><Eye size={16} /></Link>
                  <Link to={getEditLink(post)} title="Edit"><Edit size={16} /></Link>
                  <button onClick={() => handleDelete(post._id)} title="Delete"><Trash2 size={16}/></button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="all-posts-container">
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <div className="header">
        <h2>All Posts</h2>
        <div className="view-toggle">
          <button onClick={() => setViewMode("card")} title="Card View"><LayoutGrid size={16}/></button>
          <button onClick={() => setViewMode("list")} title="List View"><List size={16}/></button>
          <button onClick={() => setViewMode("table")} title="Table View"><Table size={16}/></button>
        </div>
      </div>

      {loading ? <p>Loading posts...</p> :
        posts.length === 0 ? <p>No posts found.</p> :
        viewMode === "card" ? renderCardView() :
        viewMode === "list" ? renderListView() :
        renderTableView()
      }
    </div>
  );
};

export default AllPosts;




