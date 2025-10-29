// ✅ src/pages/post/Post.jsx
// ✅ src/pages/post/Post.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit2, Trash2, Loader2, MessageSquare } from "lucide-react";
import newRequest from "../../api/newRequest";
import PostBlocks from "./PostBlocks";
import CommentsList from "../components/CommentsList";
import AddComment from "../components/AddComment";
import { Helmet } from "react-helmet-async";
import "./Post.css";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import LinkPreviewCard from "./LinkPreviewCard";


const Post = ({ user }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await newRequest.get(`/posts/slug/${slug}`);
        setPost(res.data);
        setSelectedImage(res.data.primaryImg || res.data.images?.[0]?.url || null);
      } catch (err) {
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="post-list-loading"><Loader2 className="spin" /> Loading...</div>;
  if (!post) return <div className="post-empty">Post not found.</div>;

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await newRequest.delete(`/posts/${post._id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // const shareUrl = `https://yourdomain.com/post/${post.slug}`;
  const shareUrl = `https://yourdomain.com/og/post/${post.slug}`;


  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.description || ""} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description || ""} />
        <meta property="og:image" content={post.images?.[0]?.url || ""} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="post-page">
        <header className="page-header">
          <h1>All Posts</h1>
          <button className="add-post-btn" onClick={() => navigate("/add-post")}>
            + New Post
          </button>
        </header>

        <div className="post-scroll-area">
          <div className="post-layout">

            {/* LEFT COLUMN */}
            <div className="post-left">
              <div className="image-preview">
                {selectedImage 
                  ? <img src={selectedImage} alt="selected" className="main-preview" />
                  : <div className="no-image">No Image</div>}
              </div>

              <div className="thumbnails">
                {post.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`thumb-${i}`}
                    className={`thumbnail ${selectedImage === img.url ? "active" : ""}`}
                    onClick={() => setSelectedImage(img.url)}
                  />
                ))}
              </div>

              {post.audioUrl && (
                <div className="audio-section">
                  <audio controls src={post.audioUrl} className="audio-container" />
                </div>
              )}

              {post.videoUrl && (
                <div className="video-section">
                  <video controls src={post.videoUrl} className="video-container" />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="post-right">
              <h1 className="post-title">{post.title}</h1>
              <p className="description">{post.description}</p>

              <div className="meta">
                <p><strong>Category:</strong> {post.categoryTitle || "—"}</p>
                {post.subcategoryTitle && <p><strong>Subcategory:</strong> {post.subcategoryTitle}</p>}
                <p><strong>Author:</strong> {post.author?.username || "—"}</p>
                <p><strong>Status:</strong> {post.status}</p>
              </div>

              <div className="tags-row">
                {post.tags?.map((t, i) => <span key={i} className="tag">#{t}</span>)}
                {post.hashtags?.map((h, i) => <span key={i} className="hashtag">#{h}</span>)}
              </div>

              <div className="post-content">
                <PostBlocks blocks={post.blocks} fallbackContent={post.content} />
              </div>


              <div className="actions">
                <button onClick={() => navigate(`/admin/dashboard/edit-post/${post.slug}`)}><Edit2 /> Edit</button>
                <button onClick={handleDelete} disabled={deleting}>{deleting ? <Loader2 className="spin" /> : <Trash2 />} Delete</button>
                <button onClick={() => setShowCommentsModal(true)}><MessageSquare /> Comments</button>
                {/* Social Share */}
                <div className="social-share">
                  <FacebookShareButton url={shareUrl} quote={post.title}>
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>
                  <WhatsappShareButton url={shareUrl} title={post.title}>
                    <WhatsappIcon size={40} round />
                  </WhatsappShareButton>
                </div>
              </div>

              {showCommentsModal && (
                <div className="comment-modal-overlay" onClick={() => setShowCommentsModal(false)}>
                  <div className="comment-modal" onClick={e => e.stopPropagation()}>
                    <div className="header">
                      <h3>Comments</h3>
                      <button onClick={() => setShowCommentsModal(false)}>X</button>
                    </div>
                    <div className="body">
                      {user ? <AddComment postId={post._id} /> : <p>Please log in to comment</p>}
                      <CommentsList postId={post._id} />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        
      </div>

      
        {/* WhatsApp/Facebook-like link preview */}
        <LinkPreviewCard
          title={post.title}
          description={post.description}
          images={post.images?.map(img => img.url)}
          url={shareUrl}
        />

    </>
  );
};

export default Post;






