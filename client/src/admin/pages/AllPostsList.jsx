// ✅ src/pages/post/AllPostsList.jsx
// ✅ src/pages/post/AllPostsList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newRequest from "../../api/newRequest";
import { Eye, Pencil, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import "./AllPostsList.css";

const AllPostsList = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await newRequest.get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await newRequest.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm("Publish this post now?")) return;
    setUpdating(id);
    try {
      const res = await newRequest.put(`/posts/${id}/publish`);
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "published" } : p))
      );
    } catch (err) {
      console.error("Publish failed:", err);
      alert("Failed to publish post");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="allposts-loading">
        <Loader2 className="spin" /> Loading posts...
      </div>
    );
  }

  return (
    <div className="allposts-container" style={{marginBottom:'10%'}} >
      <div className="allposts-header">
        <h2>All Posts</h2>
        <Link to="/admin/add-post" className="btn-create">
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <table className="allposts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Channel</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.channel?.name || "-"}</td>
                <td>{post.author?.username || "Unknown"}</td>
                <td className={`status-${post.status}`}>{post.status}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <Link
                    to={`/admin/dashboard/slug/${post.slug}`}
                    className="btn-icon view"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/admin/dashboard/post/${post.slug}`}
                    className="btn-icon view"
                  >
                    View
                  </Link>
                  <Link
                    to={`/admin/dashboard/edit-post/${post.slug}`}
                    className="btn-icon edit"
                  >
                    <Pencil size={18} />
                  </Link>

                  {/* Publish Button (Visible for Pending) */}
                  {/* ✅ Publish Button: Only visible for admins when post is pending */}
                  {user?.role === "admin" && post.status === "pending" && (
                    <button
                      onClick={() => handlePublish(post._id)}
                      className="btn-icon publish"
                      disabled={updating === post._id}
                    >
                      {updating === post._id ? (
                        <Loader2 className="spin" size={18} />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn-icon delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </div>
  );
};

export default AllPostsList;




