// src/pages/post/AddPost.jsx
// src/pages/post/AddPost.jsx
import React, { useState, useEffect, useRef } from "react";
import newRequest from "../../api/newRequest";
import { Plus, X } from "lucide-react";
import JoditEditor from "jodit-react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import "./AddPost.css";

const AddPost = ({ user }) => {
  const [form, setForm] = useState({
    title: "",
    trending: "no",
    description: "",
    content: "",
    blocks: [],
    status: user?.role === "admin" ? "published" : "draft",
    scheduledDate: "",
    categoryId: "",
    subcategoryId: "",
    channelId: "",
    audioLink: "",
    videoLink: "",
  });

  console.log(user)

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [channels, setChannels] = useState([]);
  const [tags, setTags] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const editor = useRef();
  const joditRef = useRef();
  const config = { readonly: false };

  // --- Fetch categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await newRequest.get("/categories");
        const cats = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // --- Fetch channels ---
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await newRequest.get("/channels");
        const chs = Array.isArray(res.data) ? res.data : res.data.data || [];
        setChannels(chs);
      } catch (err) {
        console.error("Failed to fetch channels", err);
        setChannels([]);
      }
    };
    fetchChannels();
  }, []);

  // --- Handle category/subcategory changes ---
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setForm({ ...form, categoryId, subcategoryId: "" });
    setSubcategories(
      (categories || []).filter((c) => String(c.parentId) === categoryId)
    );
  };

  const handleSubcategoryChange = (e) =>
    setForm({ ...form, subcategoryId: e.target.value });
  const handleChannelChange = (e) =>
    setForm({ ...form, channelId: e.target.value });

  // --- Tag/Hashtag handlers ---
  const handleTagAdd = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };
  const handleTagRemove = (t) => setTags(tags.filter((tag) => tag !== t));
  const handleHashtagAdd = () => {
    const h = hashtagInput.trim();
    if (h && !hashtags.includes(h)) {
      setHashtags([...hashtags, h]);
      setHashtagInput("");
    }
  };
  const handleHashtagRemove = (h) =>
    setHashtags(hashtags.filter((tag) => tag !== h));

  // --- Media handlers ---
  const handleDropFiles = (e, setFiles) => {
    e.preventDefault();
    setFiles([...e.dataTransfer.files]);
  };
  const handleDragOver = (e) => e.preventDefault();

  const MediaDropZone = ({ label, files, setFiles, placeholder }) => {
    const [isDrag, setIsDrag] = useState(false);
    return (
      <div
        className={`dropzone ${isDrag ? "dragover" : ""}`}
        onDragOver={(e) => {
          handleDragOver(e);
          setIsDrag(true);
        }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={(e) => {
          handleDropFiles(e, setFiles);
          setIsDrag(false);
        }}
      >
        <label>{label}</label>
        <input
          type="file"
          multiple={Array.isArray(files)}
          onChange={(e) =>
            Array.isArray(files)
              ? setFiles([...e.target.files])
              : setFiles({ ...files, file: e.target.files[0] })
          }
        />
        {placeholder && (
          <input
            type="text"
            placeholder={placeholder}
            value={files.link || ""}
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, link: e.target.value }))
            }
          />
        )}
        {Array.isArray(files) && files.length > 0 && (
          <div className="file-preview">
            {Array.from(files).map((f, i) => (
              <div key={i} className="file-item">
                {f.name} <X onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.channelId) {
      return alert("Title, description, and channel are required!");
    }
    console.log(form)
    let blocks = [];
    try {
      blocks = (await editor.current?.editor?.save?.()) || [];
    } catch (err) {
      console.error("EditorJS save failed", err);
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("content", text);
    formData.append("blocks", JSON.stringify(blocks));
    formData.append("trending", form.trending);
    if (form.categoryId) formData.append("categoryId", form.categoryId);
    if (form.subcategoryId) formData.append("subcategoryId", form.subcategoryId);
    if (form.channelId) formData.append("channelId", form.channelId);
    formData.append("tags", JSON.stringify(tags));
    formData.append("hashtags", JSON.stringify(hashtags));
    formData.append("status", form.status);
    formData.append("scheduledDate", form.scheduledDate || "");
    if (user?._id) {
        formData.append("author", user._id);
        formData.append("userId", user._id);
    } else {
        return alert("User not logged in or user ID missing");
    }

    images.forEach((img) => formData.append("images", img));
    if (audioFile) formData.append("audio", audioFile);
    if (videoFile) formData.append("video", videoFile);
    if (form.audioLink) formData.append("audioUrl", form.audioLink);
    if (form.videoLink) formData.append("videoUrl", form.videoLink);

    try {
      await newRequest.post("/posts", formData);
      alert("Post created successfully!");
      // Reset
      setForm({
        title: "",
        trending: "no",
        description: "",
        content: "",
        blocks: [],
        status: user?.role === "admin" ? "published" : "draft",
        scheduledDate: "",
        categoryId: "",
        subcategoryId: "",
        channelId: "",
        audioLink: "",
        videoLink: "",
      });
      setTags([]);
      setHashtags([]);
      setImages([]);
      setAudioFile(null);
      setVideoFile(null);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="add-post-container">
      <h2>Create New Post</h2>
      <form className="add-post-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="Post Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <MDEditor
          value={form.description}
          onChange={(val) => setForm({ ...form, description: val })}
          commands={[
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.hr,
            commands.title,
            commands.divider,
            commands.link,
            commands.code,
            commands.image,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
          ]}
          className="md-editor"
        />

        {/* Category / Subcategory / Channel */}
        <div className="select-group">
          <select value={form.categoryId} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {(Array.isArray(categories) ? categories : [])
              .filter((c) => !c.parentId)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>

          <select
            value={form.subcategoryId}
            onChange={handleSubcategoryChange}
            disabled={!subcategories.length}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select value={form.channelId} onChange={handleChannelChange} required>
            <option value="">Select Channel</option>
            {(Array.isArray(channels) ? channels : []).map((ch) => (
              <option key={ch._id} value={ch._id}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="tags-group">
          <div className="tag-input-wrapper">
            <input
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  handleTagAdd();
                }
              }}
            />
            <button type="button" className="icon-btn" onClick={handleTagAdd}>
              <Plus size={16} />
            </button>
          </div>
          <div className="badges">
            {tags.map((t) => (
              <span key={t} className="tag-badge">
                {t}
                <X size={12} onClick={() => handleTagRemove(t)} />
              </span>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div className="tags-group">
          <div className="tag-input-wrapper">
            <input
              type="text"
              placeholder="Add hashtag"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleHashtagAdd();
                }
              }}
            />
            <button type="button" className="icon-btn" onClick={handleHashtagAdd}>
              <Plus size={16} />
            </button>
          </div>
          <div className="badges">
            {hashtags.map((h) => (
              <span key={h} className="tag-badge">
                #{h}
                <X size={12} onClick={() => handleHashtagRemove(h)} />
              </span>
            ))}
          </div>
        </div>

        {/* Content Editors */}
        <div className="editorjs-container">
          <label>Blocks Editor</label>
          <div ref={editor}></div>
        </div>

        {/* Media Upload */}
        <MediaDropZone
          label="Images"
          files={images}
          setFiles={setImages}
        />
        <MediaDropZone
          label="Audio File"
          files={audioFile || {}}
          setFiles={setAudioFile}
          placeholder="Or paste audio link"
        />
        <MediaDropZone
          label="Video File"
          files={videoFile || {}}
          setFiles={setVideoFile}
          placeholder="Or paste video link"
        />

        <button type="submit" className="btn primary">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;

