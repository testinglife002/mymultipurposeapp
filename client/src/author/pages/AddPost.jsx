// src/author/pages/AddPost.jsx
import React, { useEffect, useRef, useState } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import axios from "axios";
import { Plus, X } from "lucide-react";
import "./AddPost.css";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvnxusfy8/upload";
const UPLOAD_PRESET = "mymultipurposeapp";

const AddPost = ({ user }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [images, setImages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [audioLink, setAudioLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  /** 🔹 Initialize EditorJS once */
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const editor = new EditorJS({
      holder: editorContainerRef.current,
      autofocus: true,
      placeholder: "Start writing your story...",
      tools: {
        header: Header,
        list: List,
        embed: Embed,
        quote: Quote,
        code: CodeTool,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", UPLOAD_PRESET);
                const res = await axios.post(CLOUDINARY_URL, formData);
                return {
                  success: 1,
                  file: { url: res.data.secure_url },
                };
              },
            },
          },
        },
      },
    });

    editorRef.current = editor;
    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch((err) => console.warn("Editor cleanup error:", err));
      editorRef.current = null;
    };
  }, []);

  /** 🔹 Auto-generate slug */
  useEffect(() => {
    setSlug(
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
    );
  }, [title]);

  /** 🔹 File upload helpers */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    const res = await axios.post(CLOUDINARY_URL, formData);
    return res.data.secure_url;
  };

  /** 🔹 Handle cover image */
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /** 🔹 Handle multiple image uploads */
  const handleMultipleImages = async (e) => {
    const files = Array.from(e.target.files);
    const urls = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      urls.push(url);
    }
    setImages((prev) => [...prev, ...urls]);
  };

  /** 🔹 Handle audio/video upload */
  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    setAudioFile(url);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    setVideoFile(url);
  };

  /** 🔹 Preview modal */
  const handlePreview = async () => {
    const data = await editorRef.current.save();
    setPreviewData({
      title,
      tags,
      slug,
      imagePreview,
      blocks: data.blocks,
      audioFile,
      audioLink,
      videoFile,
      videoLink,
      images,
    });
    setShowPreview(true);
  };

  /** 🔹 Submit handler */
  const handleSubmit = async (e, status = "published") => {
    e.preventDefault();
    if (!title) return alert("Please add a title");

    setIsSubmitting(true);
    try {
      const editorData = await editorRef.current.save();
      const coverImageUrl = coverImage ? await uploadToCloudinary(coverImage) : "";

      const postData = {
        title,
        slug,
        description,
        tags,
        hashtags,
        category: selectedCategory,
        channel: selectedChannel,
        coverImage: coverImageUrl,
        extraImages: images,
        audioFile,
        audioLink,
        videoFile,
        videoLink,
        content: editorData,
        status,
        authorId: user?._id,
      };

      await axios.post("http://localhost:5000/api/posts", postData);
      alert(`✅ Post ${status === "draft" ? "saved as draft" : "published"}!`);

      setTitle("");
      setSlug("");
      setTags([]);
      setImagePreview(null);
      setImages([]);
      setAudioFile(null);
      setVideoFile(null);
      editorRef.current.clear();
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting post");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** 🔹 Tag & hashtag handlers */
  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };
  const handleTagRemove = (tag) => setTags(tags.filter((t) => t !== tag));
  const handleHashtagAdd = () => {
    if (hashtagInput && !hashtags.includes(hashtagInput)) {
      setHashtags([...hashtags, hashtagInput]);
      setHashtagInput("");
    }
  };
  const handleHashtagRemove = (h) =>
    setHashtags(hashtags.filter((tag) => tag !== h));

  return (
    <div className="addpost-container">
      <h2 className="addpost-title">✍️ Create New Post</h2>

      <form className="addpost-form" onSubmit={(e) => handleSubmit(e, "published")}>
        {/* Title */}
        <div className="form-group">
          <label>Post Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Slug */}
        <div className="form-group">
          <label>Slug</label>
          <input type="text" value={slug} readOnly />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <MDEditor
            value={description}
            onChange={setDescription}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.link,
              commands.unorderedListCommand,
              commands.orderedListCommand,
            ]}
          />
        </div>

        {/* Cover Image */}
        <div className="form-group">
          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverImageChange} />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="cover" />
            </div>
          )}
        </div>

        {/* Multiple Images */}
        <div className="form-group">
          <label>Additional Images</label>
          <input type="file" accept="image/*" multiple onChange={handleMultipleImages} />
          <div className="multi-image-preview">
            {images.map((img, i) => (
              <img key={i} src={img} alt={`upload-${i}`} />
            ))}
          </div>
        </div>

        {/* Audio / Video */}
        <div className="form-group">
          <label>Audio Link</label>
          <input
            type="text"
            placeholder="https://..."
            value={audioLink}
            onChange={(e) => setAudioLink(e.target.value)}
          />
          <input type="file" accept="audio/*" onChange={handleAudioUpload} />
          {audioFile && <audio controls src={audioFile} />}
        </div>

        <div className="form-group">
          <label>Video Link</label>
          <input
            type="text"
            placeholder="https://..."
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
          {videoFile && <video controls src={videoFile} width="320" />}
        </div>

        {/* EditorJS */}
        <div className="form-group">
          <label>Post Content</label>
          <div ref={editorContainerRef} className="editorjs-container"></div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={isSubmitting}
            className="draft-btn"
          >
            💾 Save as Draft
          </button>

          <button
            type="button"
            className="preview-btn"
            onClick={handlePreview}
            disabled={isSubmitting}
          >
            👁️ Preview
          </button>

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? "Publishing..." : "🚀 Publish"}
          </button>
        </div>
      </form>

      {/* ✅ Preview Modal */}
      {showPreview && (
        <div className="preview-modal">
          <div className="preview-overlay" onClick={() => setShowPreview(false)}></div>
          <div className="preview-box">
            <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
            <h3>{previewData?.title}</h3>
            {previewData?.imagePreview && <img src={previewData.imagePreview} alt="cover" />}
            {previewData?.audioFile && <audio controls src={previewData.audioFile} />}
            {previewData?.videoFile && <video controls src={previewData.videoFile} width="400" />}
            <div className="preview-tags">
              {previewData?.tags?.map((tag) => (
                <span key={tag} className="tag-item">{tag}</span>
              ))}
            </div>
            <div className="preview-content">
              {previewData?.blocks?.map((block, index) => {
                switch (block.type) {
                  case "header":
                    return <h3 key={index}>{block.data.text}</h3>;
                  case "paragraph":
                    return <p key={index}>{block.data.text}</p>;
                  case "quote":
                    return (
                      <blockquote key={index}>
                        “{block.data.text}” — {block.data.caption}
                      </blockquote>
                    );
                  case "image":
                    return (
                      <img
                        key={index}
                        src={block.data.file.url}
                        alt={block.data.caption || "img"}
                        className="preview-inline-img"
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;


