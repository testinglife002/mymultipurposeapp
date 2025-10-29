// src/apps/posts/pages/PostDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./PostDetail.css";
import { ChevronLeft, ChevronRight, X, MessageCircle } from "lucide-react";
import AddComment from "../components/AddComment";
import CommentsList from "../components/CommentsList";
import "../components/CommentsModal.css";
import PostMedia from "./PostMedia";
import PostBlocks from "./PostBlocks";

const PostDetail = ({ user }) => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const imagesRef = useRef(null);
  const blocksRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await newRequest.get(`/posts/slug/${slug}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found.</p>;

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

  const validBlocks = Array.isArray(post.blocks)
    ? post.blocks.filter(b => b && b.type && b.data)
    : [];
  const validImages = Array.isArray(post.images)
    ? post.images.filter(img => img && (typeof img === "string" || img.url))
    : [];

  const validAudio = post.audioUrl && typeof post.audioUrl === "string" ? post.audioUrl : null;
  const validVideo = post.videoUrl && typeof post.videoUrl === "string" ? post.videoUrl : null;

  return (
    < >
      <div className="scrollable-content">
        <div className="post-details-container">
          <h1>{post.title}</h1>
          <p>{post.description}</p>

          <PostMedia
            images={post.images}
            primaryImg={post.primaryImg}
            audioUrl={post.audioUrl}
            videoUrl={post.videoUrl}
          />

          <PostBlocks blocks={post.blocks} />

          <div className="post-meta">
            <p><strong>Category:</strong> {post.categoryTitle}</p>
            {post.subcategoryTitle && <p><strong>Subcategory:</strong> {post.subcategoryTitle}</p>}
            <p><strong>Author:</strong> {post.author?.username || "Unknown"}</p>
          </div>

          <div className="social-share">
            <FacebookShareButton url={shareUrl} quote={post.title}><FacebookIcon size={40} round /></FacebookShareButton>
            <WhatsappShareButton url={shareUrl} title={post.title}><WhatsappIcon size={40} round /></WhatsappShareButton>
          </div>

          <button onClick={() => setShowCommentsModal(true)}>
            <MessageSquare /> Comments
          </button>

          {showCommentsModal && (
            <div className="comment-modal-overlay" onClick={() => setShowCommentsModal(false)}>
              <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="header">
                  <h3>Comments</h3>
                  <X onClick={() => setShowCommentsModal(false)} />
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
    </>
  );
};

export default PostDetail;
