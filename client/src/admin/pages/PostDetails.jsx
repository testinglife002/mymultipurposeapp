// src/admin/pages/PostDetails.jsx
// src/pages/post/PostDetails.jsx
// src/pages/PostDetails.jsx
// src/pages/PostDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./PostDetails.css";
import PostContent from "./PostContent";
import { ChevronLeft, ChevronRight, X, MessageSquare } from "lucide-react";
import CommentsList from "../components/CommentsList";
import AddComment from "../components/AddComment";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";

const PostDetails = ({ user }) => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // for modal
  const [showCommentsModal, setShowCommentsModal] = useState(false); // ✅ added

  const imagesRef = useRef(null);
  const blocksRef = useRef(null);



  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await newRequest.get(`/posts/slug/${slug}`);
        setPost(res.data);
        setSelectedImage(res.data.primaryImg || res.data.images?.[0]?.url);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="postdetails-loading">Loading...</div>;
  if (!post) return <div className="postdetails-empty">Post not found.</div>;

  const scrollContainer = (ref, direction) => {
    const container = ref.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.7;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Filters
  const validBlocks = Array.isArray(post.blocks)
    ? post.blocks.filter(b => b && b.type && b.data)
    : [];
  const validImages = Array.isArray(post.images)
    ? post.images.filter(img => img && (typeof img === "string" || img.url))
    : [];
  const validAudio = post.audioUrl && typeof post.audioUrl === "string" ? post.audioUrl : null;
  const validVideo = post.videoUrl && typeof post.videoUrl === "string" ? post.videoUrl : null;

  
  const shareUrl = `https://yourdomain.com/post/${post.slug}`;
  const shareTitle = post.title;

  return (
    <div style={{marginBottom:'-10%'}} >
      <div className="scrollable-content">
        <div className="postdetails-wrapper">
      {/* ===== LEFT: IMAGE / AUDIO / VIDEO SECTION ===== */}
      <div className="post-details-container">
      <div className="post-header">
        <h1>{post.title}</h1>
        <p className="description">{post.description}</p>
      </div>

      {/* Media Section */}
      <div className="post-media">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="selected"
            className="main-image"
            onClick={() => setSelectedImage(selectedImage)}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}

        {post.images?.length > 0 && (
          <div className="thumbnails">
            {post.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`thumb-${i}`}
                className={selectedImage === img.url ? "active" : ""}
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        )}

        {post.audioUrl && (
          <audio controls src={post.audioUrl} className="audio" />
        )}
        {post.videoUrl && (
          <video controls src={post.videoUrl} className="video" />
        )}
      </div>

      {/* Content Section */}
      <div className="post-content">
        {Array.isArray(post.blocks) && post.blocks.length > 0 ? (
          post.blocks.map((block, i) => (
            <div key={i} className={`block block-${block.type}`}>
              {block.type === "paragraph" && <p>{block.data?.text}</p>}
              {block.type === "header" && <h3>{block.data?.text}</h3>}
              {block.type === "list" && (
                <ul>{(block.data?.items || []).map((li, j) => <li key={j}>{li}</li>)}</ul>
              )}
              {block.type === "code" && <pre><code>{block.data?.code}</code></pre>}
            </div>
          ))
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {/* Meta Info */}
      <div className="post-meta">
        <p><strong>Category:</strong> {post.categoryTitle || "—"}</p>
        {post.subcategoryTitle && <p><strong>Subcategory:</strong> {post.subcategoryTitle}</p>}
        <p><strong>Author:</strong> {post.author?.username || "Unknown"}</p>
        <p><strong>Status:</strong> {post.status}</p>
        <div className="tags">
          {post.tags?.map((t, i) => <span key={i}>#{t}</span>)}
          {post.hashtags?.map((h, i) => <span key={i}>#{h}</span>)}
        </div>
      </div>

      {/* Social Share */}
      <div className="social-share">
        <FacebookShareButton url={shareUrl} quote={post.title}><FacebookIcon size={40} round /></FacebookShareButton>
        <WhatsappShareButton url={shareUrl} title={post.title}><WhatsappIcon size={40} round /></WhatsappShareButton>
      </div>

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="comment-modal-overlay" onClick={() => setShowCommentsModal(false)}>
          <div className="comment-modal" onClick={e => e.stopPropagation()}>
            <div className="header">
              <h3>Comments</h3>
              <X className="close" onClick={() => setShowCommentsModal(false)} />
            </div>
            <div className="body">
              {user ? <AddComment postId={post._id} /> : <p>Please log in to comment.</p>}
              <CommentsList postId={post._id} />
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <X className="close" onClick={() => setSelectedImage(null)} />
            <img src={selectedImage} alt="large" />
          </div>
        </div>
      )}
    </div>

    </div>
    </div>
    <br/><br/><br/><br/><br/><br/><br/>
    </div>
  );
};

export default PostDetails;










