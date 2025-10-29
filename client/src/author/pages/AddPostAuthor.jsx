// src/author/pages/AddPostAuthor.jsx
// src/author/pages/AddPostAuthor.jsx
// src/author/pages/AddPostAuthor.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import newRequest from "../../api/newRequest";
import { Plus, X, Eye } from "lucide-react";
import slugify from "slugify";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { EditorContext } from "../../apps/notes/components/EditorContext";
import "./AddPost.css";

const AddPostAuthor = ({ user }) => {
  const [form, setForm] = useState({
    title: "",
    trending: "no",
    description: "",
    content: "",
    blocks: [],
    status: "pending", // Author posts require admin approval
    scheduledDate: "",
    categoryId: "",
    subcategoryId: "",
    channelId: "",
    audioLink: "",
    videoLink: "",
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
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const editor = useRef();
  const { initEditor, editorInstanceRef, getEditorData } = useContext(EditorContext) || {};

  // ---------- Initialize EditorJS ----------
  useEffect(() => {
    const timer = setTimeout(() => initEditor("editorjs"), 100);
    return () => clearTimeout(timer);
  }, [initEditor]);

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
    fetchCategories();

    const fetchChannels = async () => {
      try {
        const res = await newRequest.get("/channels");
        setChannels(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch channels", err);
      }
    };
    fetchChannels();
  }, []);

  // ---------- Category/Subcategory/Channel ----------
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find((c) => c._id === categoryId);
    setForm({
      ...form,
      categoryId,
      categoryTitle: selectedCategory?.name || "",
      subcategoryId: "",
      subcategoryTitle: "",
    });
    setSubcategories(categories.filter((c) => String(c.parentId) === categoryId));
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    const selectedSub = subcategories.find((s) => s._id === subcategoryId);
    setForm({ ...form, subcategoryId, subcategoryTitle: selectedSub?.name || "" });
  };

  const handleChannelChange = (e) => setForm({ ...form, channelId: e.target.value });

  // ---------- Tags & Hashtags ----------
 // ---------- Tags & Hashtags ----------
    const handleTagAdd = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags([...tags, t]);
        setTagInput("");
    };
    const handleTagRemove = (t) => setTags(tags.filter((tag) => tag !== t));

    const handleHashtagAdd = () => {
        const h = hashtagInput.trim().replace(/^#/, ""); // remove leading #
        if (h && !hashtags.includes(h)) setHashtags([...hashtags, h]);
        setHashtagInput("");
    };
    const handleHashtagRemove = (h) => setHashtags(hashtags.filter((tag) => tag !== h));

    // ---------- Media Handling ----------
    const handleDropFiles = (e, setFiles, accept = []) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter(f => {
            if (accept.length && !accept.includes(f.type.split("/")[0])) return false;
            return true;
        });
        setFiles(validFiles);
        };
        const handleFileSelect = (e, setFiles, multiple = true, accept = []) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(f => {
            if (accept.length && !accept.includes(f.type.split("/")[0])) return false;
            return true;
        });
        setFiles(multiple ? validFiles : validFiles[0] || null);
        };
        const handleDragOver = (e) => e.preventDefault();

        const MediaDropZone = ({ label, files, setFiles, placeholder, multiple = true, accept = [] }) => {
        const [isDrag, setIsDrag] = useState(false);

        return (
            <div
            className={`dropzone ${isDrag ? "dragover" : ""}`}
            onDragOver={(e) => { handleDragOver(e); setIsDrag(true); }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={(e) => { handleDropFiles(e, setFiles, accept); setIsDrag(false); }}
            >
            <label>{label}</label>
            <input
                type="file"
                multiple={multiple}
                accept={accept.map(a => a + "/*").join(",")}
                onChange={(e) => handleFileSelect(e, setFiles, multiple, accept)}
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
                <div className="file-preview">
                {files.map((f, i) => (
                    <div key={i} className="file-item">
                    {f.name || f.link} <X onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
                    </div>
                ))}
                </div>
            )}

            {!Array.isArray(files) && files?.file && (
                <div className="file-preview">
                {files.file.name} <X onClick={() => setFiles(null)} />
                </div>
            )}
            </div>
        );
    };


  // ---------- Draft Handling ----------
  const fetchDraft = async () => {
    if (!user?._id) return;
    try {
      const res = await newRequest.get(`/posts/draft/${user._id}`);
      const draft = res.data;
      if (!draft) return;

      setForm({
        ...form,
        ...draft,
        audioLink: draft.audioUrl || "",
        videoLink: draft.videoUrl || "",
        status: "pending",
      });
      setTags(draft.tags || []);
      setHashtags(draft.hashtags || []);
      setImages(draft.images || []);
      setAudioFile(draft.audioUrl ? { link: draft.audioUrl } : null);
      setVideoFile(draft.videoUrl ? { link: draft.videoUrl } : null);
      setText(draft.content || "");
      alert("Draft loaded successfully!");
    } catch (err) {
      console.warn("No draft found or failed to load draft:", err.message);
    }
  };

  useEffect(() => { if (user?._id) fetchDraft(); }, [user]);

  const handleSaveDraft = async () => {
    if (!user?._id) return;
    try {
      const blocks = await getEditorData();
      const slug = slugify(form.title || "untitled", { lower: true, strict: true });
      const formData = new FormData();

      formData.append("title", form.title || "Untitled Post");
      formData.append("slug", `${slug}-${Date.now()}`);
      formData.append("description", form.description || "");
      formData.append("content", text || "");
      formData.append("blocks", JSON.stringify(blocks));
      formData.append("status", "pending");
      formData.append("author", user._id);
      formData.append("tags", JSON.stringify(tags));
      formData.append("hashtags", JSON.stringify(hashtags));

      images.forEach((img) => formData.append("images", img));
      if (audioFile?.file) formData.append("audio", audioFile.file);
      else if (audioFile?.link) formData.append("audioUrl", audioFile.link);
      if (videoFile?.file) formData.append("video", videoFile.file);
      else if (videoFile?.link) formData.append("videoUrl", videoFile.link);

      const existingDraft = await newRequest.get(`/posts/draft/${user._id}`).catch(() => null);
      if (existingDraft?.data?._id) {
        await newRequest.put(`/posts/${existingDraft.data._id}`, formData);
        alert("Draft updated successfully!");
      } else {
        await newRequest.post("/posts", formData);
        alert("Draft saved!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving draft.");
    }
  };

  // ---------- Submit Post ----------
  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.channelId) {
      return alert("Title, description, and channel are required!");
    }

    try {
      const blocks = await getEditorData();
      const slug = `${slugify(form.title || "untitled", { lower: true, strict: true })}-${Date.now()}`;
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("slug", slug);
      formData.append("description", form.description);
      formData.append("content", text || "");
      formData.append("blocks", JSON.stringify(blocks));
      formData.append("trending", form.trending || "no");
      formData.append("status", "pending"); // Always pending approval
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

      await newRequest.post("/posts", formData);
      alert("Post submitted! Waiting for admin approval.");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to submit post.");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      trending: "no",
      description: "",
      content: "",
      blocks: [],
      status: "pending",
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
  };

  // ---------- Render ----------
  return (
    <div className="add-post-container">
      <h2>Create New Post</h2>
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
            {channels.map((ch) => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
          </select>

          <select value={form.categoryId} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.filter((c) => !c.parentId).map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select value={form.subcategoryId} onChange={handleSubcategoryChange} disabled={!subcategories.length}>
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
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
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleTagAdd(); } }}
            />
            <button type="button" className="icon-btn" onClick={handleTagAdd}><Plus size={16} /></button>
          </div>
          <div className="badges">{tags.map((t) => <span key={t} className="tag-badge">{t} <X size={12} onClick={() => handleTagRemove(t)} /></span>)}</div>
        </div>

        <div className="tags-group">
          <div className="tag-input-wrapper">
            <input
              type="text"
              placeholder="Add hashtag"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleHashtagAdd(); } }}
            />
            <button type="button" className="icon-btn" onClick={handleHashtagAdd}><Plus size={16} /></button>
          </div>
          <div className="badges">{hashtags.map((h) => <span key={h} className="tag-badge">#{h} <X size={12} onClick={() => handleHashtagRemove(h)} /></span>)}</div>
        </div>

        {/* EditorJS */}
        <div className="editorjs-container">
          <label>Blocks Editor</label>
          <div id="editorjs" style={{ minHeight: 400, border: "1px solid #ddd", borderRadius: 8, padding: 10 }}></div>
        </div>

        {/* Media */}        
        <MediaDropZone label="Images" files={images} setFiles={setImages} multiple={true} accept={["image"]} />
        <MediaDropZone label="Audio File" files={audioFile || {}} setFiles={setAudioFile} multiple={false} accept={["audio"]} placeholder="Or paste audio link" />
        <MediaDropZone label="Video File" files={videoFile || {}} setFiles={setVideoFile} multiple={false} accept={["video"]} placeholder="Or paste video link" />


        <div className="action-buttons" style={{ marginBottom: "10%" }}>
          <button type="button" className="btn primary" onClick={() => setShowPreview(true)}><Eye size={16} /> Preview</button>
          <button type="button" className="btn secondary" onClick={handleSaveDraft}>Save Draft</button>
          <button type="button" className="btn secondary" onClick={fetchDraft}>Load Draft</button>
          <button type="button" className="btn primary" onClick={handleSubmit}>Submit Post</button>
        </div>
      </form>

      {showPreview && (
        <div className="modal-backdrop" onClick={() => setShowPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{form.title}</h3>
            <div className="preview-description" dangerouslySetInnerHTML={{ __html: form.description }} />
            <div className="modal-actions">
              <button className="btn primary" onClick={() => setShowPreview(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPostAuthor;

