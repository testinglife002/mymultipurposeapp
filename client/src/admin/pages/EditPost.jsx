// src/admin/pages/post/EditPost.jsx
// src/admin/pages/post/EditPost.jsx
// src/admin/pages/post/EditPost.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../../api/newRequest";
import { Plus, X, Eye } from "lucide-react";
import slugify from "slugify";
import MDEditor, { commands } from "@uiw/react-md-editor";
import JoditEditor from "jodit-react";
import { EditorContext } from "../../apps/notes/components/EditorContext";

import "./AddPost.css";

const EditPost = ({ user }) => {
  const { slug } = useParams();
  const joditRef = useRef();
  const { initEditor, getEditorData } = useContext(EditorContext);

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
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [channels, setChannels] = useState([]);
  const [tags, setTags] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [audioFile, setAudioFile] = useState({ file: null, link: "" });
  const [videoFile, setVideoFile] = useState({ file: null, link: "" });
  const [showPreview, setShowPreview] = useState(false);

  // ---------- Fetch Categories & Channels ----------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await newRequest.get("/categories");
        setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    const fetchChannels = async () => {
      try {
        const res = await newRequest.get("/channels");
        setChannels(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch channels", err);
      }
    };
    fetchCategories();
    fetchChannels();
  }, []);

  // ---------- Fetch Post by Slug ----------
  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await newRequest.get(`/posts/slug/${slug}`);
        const post = res.data;
        if (!post) return alert("Failed to load post");

        // Set all form data
        setForm({
          title: post.title || "",
          trending: post.trending || "no",
          description: post.description || "",
          content: post.content || "",
          status: post.status || "draft",
          scheduledDate: post.scheduledDate || "",
          categoryId: post.categoryId?._id || "",
          subcategoryId: post.subcategoryId?._id || "",
          channelId: post.channel?._id || "",
        });

        setTags(post.tags || []);
        setHashtags(post.hashtags || []);
        setImages(Array.isArray(post.images) ? post.images : []);
        setText(post.content || "");

        // Audio & video state
        setAudioFile({ file: null, link: post.audioUrl || "" });
        setVideoFile({ file: null, link: post.videoUrl || "" });

        // Initialize EditorJS with blocks
        initEditor("editorjs", { blocks: post.blocks || [] });
      } catch (err) {
        console.error(err);
        alert("Failed to load post");
      }
    };

    fetchPost();
  }, [slug, initEditor]);

  // ---------- Category / Subcategory / Channel Handlers ----------
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find((c) => c._id === categoryId);
    setForm((prev) => ({
      ...prev,
      categoryId,
      categoryTitle: selectedCategory?.name || "",
      subcategoryId: "",
      subcategoryTitle: "",
    }));
    setSubcategories(categories.filter((c) => String(c.parentId) === categoryId));
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    const selectedSub = subcategories.find((s) => s._id === subcategoryId);
    setForm((prev) => ({
      ...prev,
      subcategoryId,
      subcategoryTitle: selectedSub?.name || "",
    }));
  };

  const handleChannelChange = (e) => setForm((prev) => ({ ...prev, channelId: e.target.value }));

  // ---------- Tag / Hashtag ----------
  const handleTagAdd = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  const handleTagRemove = (t) => setTags(tags.filter((tag) => tag !== t));

  const handleHashtagAdd = () => {
    const h = hashtagInput.trim();
    if (h && !hashtags.includes(h)) setHashtags([...hashtags, h]);
    setHashtagInput("");
  };
  const handleHashtagRemove = (h) => setHashtags(hashtags.filter((tag) => tag !== h));

  // ---------- Media DropZone ----------
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
            value={files?.link || ""}
            onChange={(e) => setFiles((prev) => ({ ...prev, link: e.target.value }))}
          />
        )}
        {Array.isArray(files) && files.length > 0 && (
          <div className="file-preview horizontal-scroll">
            {files.map((f, i) => (
              <div key={i} className="file-item">
                {f.name || f.url || f}
                <X onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---------- Save / Submit ----------
  const handleSaveDraft = async () => {
    if (!user?._id) return;
    let blocks = [];
    try {
      blocks = (await getEditorData())?.blocks || [];
    } catch (err) {
      console.error("EditorJS save failed", err);
    }

    const postSlug = slugify(form.title || "untitled", { lower: true, strict: true });
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("slug", `${postSlug}-${Date.now()}`);
    formData.append("description", form.description);
    formData.append("content", text);
    formData.append("blocks", JSON.stringify(blocks));
    formData.append("status", "draft");
    formData.append("author", user._id);
    formData.append("trending", form.trending || "no");
    if (form.channelId) formData.append("channelId", form.channelId);
    if (form.categoryId) formData.append("categoryId", form.categoryId);
    if (form.subcategoryId) formData.append("subcategoryId", form.subcategoryId);
    formData.append("tags", JSON.stringify(tags));
    formData.append("hashtags", JSON.stringify(hashtags));
    images.forEach((img) => formData.append("images", img));
    if (audioFile?.file) formData.append("audio", audioFile.file);
    else if (audioFile?.link) formData.append("audioUrl", audioFile.link);
    if (videoFile?.file) formData.append("video", videoFile.file);
    else if (videoFile?.link) formData.append("videoUrl", videoFile.link);

    try {
      await newRequest.put(`/posts/${postSlug}`, formData);
      alert("Draft updated successfully!");
    } catch (err) {
      console.error("Failed to save draft:", err);
      alert("Error saving draft.");
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!form.title || !form.description || !form.channelId) {
      alert("Title, description, and channel are required!");
      return;
    }

    let blocks = [];
    try {
      blocks = (await getEditorData())?.blocks || [];
    } catch (err) {
      console.error("EditorJS save failed", err);
    }

    const postSlug = slugify(form.title || "untitled", { lower: true, strict: true }) + `-${Date.now()}`;
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("slug", postSlug);
    formData.append("description", form.description);
    formData.append("content", text);
    formData.append("blocks", JSON.stringify(blocks));
    formData.append("status", isDraft ? "draft" : form.status);
    formData.append("trending", form.trending || "no");
    formData.append("author", user._id);
    if (form.channelId) formData.append("channelId", form.channelId);
    if (form.categoryId) formData.append("categoryId", form.categoryId);
    if (form.subcategoryId) formData.append("subcategoryId", form.subcategoryId);
    formData.append("tags", JSON.stringify(tags));
    formData.append("hashtags", JSON.stringify(hashtags));
    images.forEach((img) => formData.append("images", img));
    if (audioFile?.file) formData.append("audio", audioFile.file);
    else if (audioFile?.link) formData.append("audioUrl", audioFile.link);
    if (videoFile?.file) formData.append("video", videoFile.file);
    else if (videoFile?.link) formData.append("videoUrl", videoFile.link);

    try {
      await newRequest.put(`/posts/${postSlug}`, formData);
      alert("Post updated successfully!");
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Failed to update post.");
    }
  };

  // ---------- UI ----------
  return (
    <div className="add-post-container">
      <h2>Edit Post</h2>
      <form className="add-post-form" onSubmit={(e) => e.preventDefault()}>
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

        <div className="select-group">
          <select value={form.channelId} onChange={handleChannelChange} required>
            <option value="">Select Channel</option>
            {channels.map((ch) => (
              <option key={ch._id} value={ch._id}>
                {ch.name}
              </option>
            ))}
          </select>

          <select value={form.categoryId} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.filter((c) => !c.parentId).map((cat) => (
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
        </div>

        {/* Tags & Hashtags */}
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
          <div className="badges horizontal-scroll">
            {tags.map((t) => (
              <span key={t} className="tag-badge">
                {t}
                <X size={12} onClick={() => handleTagRemove(t)} />
              </span>
            ))}
          </div>
        </div>

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
          <div className="badges horizontal-scroll">
            {hashtags.map((h) => (
              <span key={h} className="tag-badge">
                #{h}
                <X size={12} onClick={() => handleHashtagRemove(h)} />
              </span>
            ))}
          </div>
        </div>

        {/* JoditReact content editor */}
        <div className="editor-container">
          <label>Content (JoditReact)</label>
          <JoditEditor
            key={slug} // force reload on different post
            ref={joditRef}
            value={text}
            onBlur={(newContent) => setText(newContent)}
            config={{ readonly: false, height: 300 }}
          />
        </div>

        {/* EditorJS blocks */}
        <div className="editorjs-container horizontal-scroll">
          <label>Blocks Editor</label>
          <div
            id="editorjs"
            style={{
              minHeight: 400,
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 10,
              overflowX: "auto",
            }}
          ></div>
        </div>

        {/* Media */}
        <MediaDropZone label="Images" files={images} setFiles={setImages} />
        <MediaDropZone
          label="Audio File"
          files={audioFile}
          setFiles={setAudioFile}
          placeholder="Or paste audio link"
        />
        <MediaDropZone
          label="Video File"
          files={videoFile}
          setFiles={setVideoFile}
          placeholder="Or paste video link"
        />

        {/* Action Buttons */}
        <div className="action-buttons" style={{ marginBottom: "10%" }}>
          <button type="button" className="btn primary" onClick={() => setShowPreview(true)}>
            <Eye size={16} /> Preview
          </button>
          <button type="button" className="btn secondary" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button type="button" className="btn primary" onClick={() => handleSubmit(false)}>
            Update Post
          </button>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="modal-backdrop" onClick={() => setShowPreview(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{form.title}</h3>
              <div
                className="preview-description"
                dangerouslySetInnerHTML={{ __html: form.description }}
              />
              <div className="modal-actions">
                <button className="btn primary" onClick={() => setShowPreview(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditPost;



