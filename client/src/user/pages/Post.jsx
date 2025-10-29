// ✅ src/pages/post/Post.jsx
// ✅ src/pages/post/Post.jsx
import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Loader2,
  Music2,
  Video,
  CalendarClock,
  X,
  MessageSquare,
  ShieldCheck,
  Image as ImgIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./Post.css";
import CommentsList from "../components/CommentsList";
import AddComment from "../components/AddComment";

const Post = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false); // ✅ added
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint =
          user?.role === "admin" ? "/posts" : `/posts/user/${user?._id}`;
        const res = await newRequest.get(endpoint);
        setPosts(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeleting(id);
    try {
      await newRequest.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="post-list-loading">
        <Loader2 className="spin" size={28} /> Loading posts...
      </div>
    );

  if (posts.length === 0)
    return <div className="post-empty">No posts found.</div>;

  return (
    <div className="post-page">
      <header className="page-header">
        <h1>All Posts</h1>
        <button className="add-post-btn" onClick={() => navigate("/add-post")}>
          + New Post
        </button>
      </header>

      <div className="post-scroll-area">
        {posts.map((post) => (
          
          <div key={post._id} className="post-full">
            {/* ===== HEADER BAR ===== */}
            <div className="post-top-bar">
              <h2>{post.title}</h2>
              <div className="post-top-actions">
                <button
                  onClick={() => navigate(`/admin/dashboard/editing-post/${post._id}`)}
                  className="icon-btn edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="icon-btn delete"
                  disabled={deleting === post._id}
                >
                  {deleting === post._id ? (
                    <Loader2 className="spin" size={16} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>

                {/* 🗨️ Comment Icon and Text */}
                <div className="comment-trigger" onClick={() => setShowCommentsModal(true)}>
                  <MessageSquare size={20} />
                  <span>Comments</span>
                </div>
              </div>
            </div>

            <p className="slug">/{post.slug}</p>

            {/* ===== DESCRIPTION ===== */}
            {post.description && (
              <p className="desc">{post.description}</p>
            )}

            {/* ===== INLINE MEDIA ===== */}
            <div className="media-inline">
              {post.images?.length > 0 &&
                post.images.map((img, i) => (
                  <img key={i} src={img.url} alt={`img-${i}`} className="inline-img" />
                ))}

              {post.audioUrl && (
                <div className="inline-audio">
                  <Music2 size={16} />
                  <audio controls src={post.audioUrl}></audio>
                </div>
              )}

              {post.videoUrl && (
                <div className="inline-video">
                  <Video size={16} />
                  <video controls width="100%" src={post.videoUrl}></video>
                </div>
              )}
            </div>

            {/* ===== META INFO ===== */}
            <div className="meta-row">
              <span className={`status ${post.status}`}>
                {post.status.toUpperCase()}
              </span>
              {post.trending === "yes" && (
                <span className="trending">🔥 Trending</span>
              )}
              {post.scheduledDate && (
                <span className="schedule">
                  <CalendarClock size={14} />
                  {new Date(post.scheduledDate).toLocaleString()}
                </span>
              )}
            </div>

            {/* ===== CATEGORY & TAGS ===== */}
            <div className="category-tags">
              <p>
                <strong>Category:</strong> {post.categoryTitle || "—"}{" "}
                {post.subcategoryTitle && (
                  <span className="subcategory">
                    / {post.subcategoryTitle}
                  </span>
                )}
              </p>
              <div className="tags-row">
                {post.tags?.map((tag, i) => (
                  <span key={i} className="tag">
                    #{tag}
                  </span>
                ))}
                {post.hashtags?.map((h, i) => (
                  <span key={i} className="hashtag">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* ===== FLAGS ===== */}
            <div className="flags">
              <span
                className={`flag ${
                  post.allowComments ? "allow" : "disable"
                }`}
              >
                <MessageSquare size={14} />{" "}
                {post.allowComments ? "Comments Enabled" : "Comments Disabled"}
              </span>

              {post.publishedByAdmin && (
                <span className="flag admin">
                  <ShieldCheck size={14} /> Admin Published
                </span>
              )}
            </div>

            {/* ===== AUTHOR & CHANNEL ===== */}
            <div className="relations">
              <span>
                <strong>Author:</strong> {post.author?.username || "—"}
              </span>
              <span>
                <strong>Channel:</strong> {post.channel?.name || "—"}
              </span>
            </div>

            {/* ===== TIMESTAMPS ===== */}
            <div className="timestamps">
              <span>
                <strong>Created:</strong>{" "}
                {new Date(post.createdAt).toLocaleString()}
              </span>
              <span>
                <strong>Updated:</strong>{" "}
                {new Date(post.updatedAt).toLocaleString()}
              </span>
            </div>

            {/*<div className="post-comments-preview">
            <CommentsList postId={post._id} />
            </div>*/}

              {/* 🧠 Comment Modal */}
              {showCommentsModal && (
                <div className="comment-modal-overlay" onClick={() => setShowCommentsModal(false)}>
                  <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="comment-modal-header">
                      <h3>Comments</h3>
                      <X className="close-icon" size={22} onClick={() => setShowCommentsModal(false)} />
                    </div>

                    <div className="comment-modal-body">
                      {user ? (
                        <AddComment postId={post._id} onCommentAdded={() => {}} />
                      ) : (
                        <p>Please log in to comment.</p>
                      )}
                      <CommentsList postId={post._id} />
                    </div>
                  </div>
                </div>
              )}

          </div>
          
        ))}
      </div>

      
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>


      

    </div>
  );
};

export default Post;




