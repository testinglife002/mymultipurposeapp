// src/pages/post/AddPost.jsx
// ✅ src/pages/post/AddPost.jsx
// src/pages/post/AddPost.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import newRequest from "../../api/newRequest";
import { Plus, X, Check, XCircle, Eye } from "lucide-react";
import slugify from "slugify";
import MDEditor, { commands } from "@uiw/react-md-editor";
import JoditEditor from "jodit-react";
import { EditorContext } from "../../apps/notes/components/EditorContext";
import "./AddPost.css";

const AddPost = ({ user }) => {
  // main form
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

  // UI / helpers
  const [slug, setSlug] = useState("");
  const [slugUnique, setSlugUnique] = useState(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [updateBtn, setUpdateBtn] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [channels, setChannels] = useState([]);

  const [tags, setTags] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");

  const [images, setImages] = useState([]); // File objects or already-uploaded URLs
  const [imagePreviews, setImagePreviews] = useState([]); // local preview URLs for files
  const [audioFile, setAudioFile] = useState(null); // file object
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(""); // link or uploaded url
  const [videoFile, setVideoFile] = useState(null); // file object
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(""); // link or uploaded url

  const [text, setText] = useState("");
    
  const editor = useRef();
  const editorJoditRef = useRef();
  const { initEditor, editorInstanceRef } = useContext(EditorContext) || {};
  const editorInitializedRef = useRef(false);

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const config = { readonly: false };

  // Fetch categories and channels
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [catsRes, chansRes] = await Promise.all([
          newRequest.get("/categories"),
          newRequest.get("/channels"),
        ]);
        setCategories(catsRes.data?.data || catsRes.data || []);
        setChannels(chansRes.data?.data || chansRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLists();
  }, []);

  // Initialize EditorJS
  useEffect(() => {
    if (!editorInitializedRef.current && typeof initEditor === "function" && document.getElementById("editorjs")) {
      initEditor("editorjs");
      editorInitializedRef.current = true;
    }
  }, [initEditor]);

  // Generate slug from title
  useEffect(() => {
    if (!form.title) return setSlug("");
    if (!updateBtn) setSlug(slugify(form.title, { lower: true, strict: true }));
  }, [form.title, updateBtn]);

  // Slug uniqueness check
  useEffect(() => {
    if (!slug) return setSlugUnique(null);
    let active = true;
    setSlugChecking(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await newRequest.get(`/posts/check-slug/${slug}`);
        if (active) setSlugUnique(Boolean(res.data.unique));
      } catch {
        if (active) setSlugUnique(null);
      } finally {
        if (active) setSlugChecking(false);
      }
    }, 350);
    return () => { active = false; clearTimeout(timeout); };
  }, [slug]);

  const manualSlugChange = (val) => {
    setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    setUpdateBtn(true);
  };
  const updateSlugFromInput = () => { setSlug(slugify(slug, { lower: true, strict: true })); setUpdateBtn(false); };

  // Tags / Hashtags
  const handleTagAdd = () => { if(tagInput.trim() && !tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]); setTagInput(""); };
  const handleTagRemove = (t) => setTags(tags.filter(x => x !== t));
  const handleHashtagAdd = () => { if(hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) setHashtags([...hashtags, hashtagInput.trim()]); setHashtagInput(""); };
  const handleHashtagRemove = (h) => setHashtags(hashtags.filter(x => x !== h));

  // Category/Subcategory
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, categoryId: value, subcategoryId: "" }));
    setSubcategories(categories.filter(c => String(c.parentId) === String(value)));
  };
  const handleSubcategoryChange = (e) => setForm(f => ({ ...f, subcategoryId: e.target.value }));

  // ---------- Media drop/preview helpers ----------
  const handleDropFiles = (e, setFiles, setPreviews) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const fileList = Array.from(dt.files || []);
    setFiles((prev) => [...prev, ...fileList]);
    if (setPreviews) {
      const previews = fileList.map((f) => URL.createObjectURL(f));
      setPreviews((p) => [...p, ...previews]);
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  const MediaDropZone = ({ label, files, setFiles, previews, setPreviews, placeholder }) => {
    return (
      <div
        className="dropzone"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropFiles(e, setFiles, setPreviews)}
      >
        <label>{label}</label>
        <input
          type="file"
          multiple={Array.isArray(files)}
          onChange={(e) => {
            const fileList = Array.from(e.target.files || []);
            setFiles((prev) => [...prev, ...fileList]);
            if (setPreviews) {
              const newPreviews = fileList.map((f) => URL.createObjectURL(f));
              setPreviews((p) => [...p, ...newPreviews]);
            }
          }}
        />
        {placeholder && (
          <input
            type="text"
            placeholder={placeholder}
            value={files?.link || ""}
            onChange={(e) => setFiles((prev) => ({ ...(prev || {}), link: e.target.value }))}
          />
        )}

        {Array.isArray(files) && files.length > 0 && (
          <div className="file-preview">
            {files.map((f, i) => (
              <div key={i} className="file-item">
                {f.name || f}
                <X onClick={() => {
                  setFiles((prev) => prev.filter((_, idx) => idx !== i));
                  if (setPreviews) setPreviews((p) => p.filter((_, idx) => idx !== i));
                }} />
              </div>
            ))}
          </div>
        )}

        {/* simple previews if available */}
        {previews && previews.length > 0 && (
          <div className="preview-row">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="preview" className="preview-thumb" />
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---------- Preview building ----------
  const openPreview = async () => {
    // gather editorjs blocks
    let blocks = [];
    try {
      blocks = (await editorInstanceRef?.current?.save?.())?.blocks || [];
    } catch (err) {
      // ignore if editor not ready
      console.warn("EditorJS save failed for preview", err);
    }

    // jodit content
    const joditContent = editorJoditRef.current?.value || form.content;

    setPreviewData({
      ...form,
      tags,
      hashtags,
      blocks,
      joditContent,
      images: imagePreviews.length ? imagePreviews : form.images || [],
      audioPreview: audioPreviewUrl || (audioFile ? URL.createObjectURL(audioFile) : ""),
      videoPreview: videoPreviewUrl || (videoFile ? URL.createObjectURL(videoFile) : ""),
      channelLabel: channels.find((c) => c._id === form.channelId)?.name || "",
      categoryLabel: categories.find((c) => c._id === form.categoryId)?.name || "",
      subcategoryLabel: categories.find((c) => c._id === form.subcategoryId)?.name || "",
    });
    setShowPreview(true);
  };


  // ---------- Submit handler (robust to both event or isDraft param) ----------
  // inside AddPost.jsx — only inside handleSubmit()

  const handleSubmit = async (isDraftOrEvent) => {
    let isDraft = false;
    if (isDraftOrEvent?.preventDefault) isDraftOrEvent.preventDefault(); else isDraft = Boolean(isDraftOrEvent);

    let blocks = [];
    try { blocks = (await editorInstanceRef?.current?.save())?.blocks || []; } catch {}

    if (!form.title || !form.description || !form.channelId) return alert("Title, description and channel are required.");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", slug || slugify(form.title, { lower: true, strict: true }));
    formData.append("description", form.description);
    formData.append("content", text || form.content || "");
    formData.append("blocks", JSON.stringify(blocks));
    formData.append("trending", form.trending || "no");
    formData.append("status", isDraft ? "draft" : form.status);
    formData.append("scheduledDate", form.scheduledDate || "");
    formData.append("author", user?._id || "");
    formData.append("userId", user?._id || "");
    if(form.channelId) formData.append("channelId", form.channelId);
    if(form.categoryId) formData.append("categoryId", form.categoryId);
    if(form.subcategoryId) formData.append("subcategoryId", form.subcategoryId);
    formData.append("tags", JSON.stringify(tags));
    formData.append("hashtags", JSON.stringify(hashtags));

    images.filter(f => f instanceof File).forEach(f => formData.append("images", f));
    if(images.some(f => typeof f === "string")) formData.append("images", JSON.stringify(images.filter(f => typeof f === "string")));

    if(audioFile instanceof File) formData.append("audio", audioFile);
    else if(form.audioLink) formData.append("audioUrl", form.audioLink);
    if(videoFile instanceof File) formData.append("video", videoFile);
    else if(form.videoLink) formData.append("videoUrl", form.videoLink);

    try {
      const res = await newRequest.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
      if(res?.data?.success) { alert("Post created successfully!"); resetForm(); setSlug(""); }
      else console.log(res.data);
    } catch(err) { console.error(err); alert("Failed to create post."); }
  };

  const resetForm = () => {
    setForm({
      title: "", trending: "no", description: "", content: "", blocks: [],
      status: user?.role === "admin" ? "published" : "draft",
      scheduledDate: "", categoryId: "", subcategoryId: "", channelId: "", audioLink: "", videoLink: ""
    });
    setSlug(""); setSlugUnique(null); setUpdateBtn(false); setTags([]); setHashtags([]); 
    setImages([]); setImagePreviews([]); setAudioFile(null); setVideoFile(null); setAudioPreviewUrl(""); setVideoPreviewUrl(""); setText("");
  };

  // ---------- Render ----------
  return (
    <div className="add-post-container">
       <br/><br/>
      <h2>Create New Post</h2>

      <form
        className="add-post-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        method="post"
      >
        <div className="form-group">
          <label>Title *</label>
          <input
            className="input-field"
            placeholder="Post Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>

        {/* Slug */}
        <div className="form-group slug-field">
          <label>Slug</label>
          <div className="slug-input-wrapper">
            <input
              type="text"
              className={`input-field ${
                slugUnique === false ? "slug-error" : slugUnique === true ? "slug-ok" : ""
              }`}
              value={slug}
              onChange={(e) => manualSlugChange(e.target.value)}
              onBlur={() => {
                // when user leaves slug box we check (debounced effect already exists)
                setUpdateBtn(true);
              }}
            />
            {slugChecking ? (
              <span className="slug-status checking">Checking...</span>
            ) : slugUnique === true ? (
              <span className="slug-status success">
                <Check size={14} /> Available
              </span>
            ) : slugUnique === false ? (
              <span className="slug-status error">
                <XCircle size={14} /> Taken
              </span>
            ) : null}
          </div>
          <small>URL-friendly slug. Edit if you want custom slug.</small>

          {updateBtn && (
            <button
              type="button"
              className="slug-update-btn"
              onClick={(e) => {
                e.preventDefault();
                updateSlugFromInput();
              }}
            >
              <Check size={12} /> Normalize slug
            </button>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Short description</label>
          <MDEditor
            value={form.description}
            onChange={(val) => setForm((f) => ({ ...f, description: val || "" }))}
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
        </div>

        {/* selects */}
        <div className="select-group">
          <select value={form.channelId} onChange={(e) => setForm((f) => ({ ...f, channelId: e.target.value }))} required>
            <option value="">Select Channel</option>
            {channels.map((ch) => (
              <option key={ch._id} value={ch._1 ?? ch._id ?? ch.id ?? ch._id}>{ch.name}</option>
            ))}
          </select>

          <select value={form.categoryId} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.filter((c) => !c.parentId).map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select value={form.subcategoryId} onChange={handleSubcategoryChange} disabled={!subcategories.length}>
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
        </div>

        {/* tags */}
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
            <button type="button" className="icon-btn" onClick={handleTagAdd}><Plus size={12} /></button>
          </div>
          <div className="badges">
            {tags.map((t) => (
              <span key={t} className="tag-badge">{t} <X size={12} onClick={() => handleTagRemove(t)} /></span>
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
                if (e.key === "Enter") { e.preventDefault(); handleHashtagAdd(); }
              }}
            />
            <button type="button" className="icon-btn" onClick={handleHashtagAdd}><Plus size={12} /></button>
          </div>
          <div className="badges">
            {hashtags.map((h) => (
              <span key={h} className="tag-badge">#{h} <X size={12} onClick={() => handleHashtagRemove(h)} /></span>
            ))}
          </div>
        </div>

        {/* EditorJS blocks holder (editor is managed by EditorContext) */}
        <div className="editorjs-container">
          <label>Blocks Editor</label>
          <div id="editorjs" style={{ minHeight: 300, border: "1px solid #ddd", borderRadius: 6, padding: 10 }} />
        </div>

        {/* Jodit content field */}
        <div 
            // className="mt-2 mb-4 p-3 bg-light border rounded editor-box"
            style={{width:'100%', minHeight:'100%',marginTop:'30px'}}
          ><label>Content</label>
            <div className="mb-3 "  >
            <JoditEditor
                ref={editorJoditRef}
                value={text}
                config={config}
                onBlur={newContent => setText(newContent)}
            />
            </div>
        </div>

        {/* Media Dropzones */}
        <div style={{ marginTop: 12 }}>
          <MediaDropZone
            label="Images (drag & drop or choose)"
            files={images}
            setFiles={setImages}
            previews={imagePreviews}
            setPreviews={setImagePreviews}
          />
          <div style={{ marginTop: 8 }}>
            <label>Audio (file or paste link)</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setAudioFile(f);
                  setAudioPreviewUrl(URL.createObjectURL(f));
                }
              }}
            />
            <input
              placeholder="Or paste audio URL"
              value={form.audioLink}
              onChange={(e) => setForm((f) => ({ ...f, audioLink: e.target.value }))}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Video (file or paste link)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setVideoFile(f);
                  setVideoPreviewUrl(URL.createObjectURL(f));
                }
              }}
            />
            <input
              placeholder="Or paste video URL"
              value={form.videoLink}
              onChange={(e) => setForm((f) => ({ ...f, videoLink: e.target.value }))}
            />
          </div>
        </div>

        {/* action buttons */}
        <div className="action-buttons" style={{ marginTop: 16 }}>
          <button type="button" className="btn primary" onClick={openPreview}>
            <Eye size={14} /> Preview
          </button>

          {/* publish: pass boolean (isDraft=false). We call handleSubmit with isDraft param,
              which the handler recognizes and won't attempt to call preventDefault on it */}
          <button type="button" className="btn primary" onClick={() => handleSubmit(false)}>
            Publish Post
          </button>

          {/* Save draft: isDraft true */}
          <button type="button" className="btn secondary" onClick={() => handleSubmit(true)}>
            Save Draft
          </button>
        </div>
      </form>

      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

      {/* Preview modal */}
      {showPreview && previewData && (
        <div className="preview-modal">
          <div className="preview-overlay" onClick={() => setShowPreview(false)} />
          <div className="preview-box">
            <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>

            <h2>{previewData.title || form.title}</h2>
            <div className="meta">
              <span><strong>Channel:</strong> {previewData.channelLabel}</span>
              <span><strong>Category:</strong> {previewData.categoryLabel}</span>
              {previewData.subcategoryLabel && <span><strong>Subcat:</strong> {previewData.subcategoryLabel}</span>}
            </div>

            <div className="preview-description" dangerouslySetInnerHTML={{ __html: previewData.description || form.description }} />

            {/* images */}
            {previewData.images?.length > 0 && (
              <div className="preview-images">
                {previewData.images.map((src, i) => (
                  <img key={i} src={src} alt={`img-${i}`} className="preview-full-img" />
                ))}
              </div>
            )}

            {/* audio/video */}
            {previewData.audioPreview && (
              <div className="preview-audio">
                <audio controls src={previewData.audioPreview} />
              </div>
            )}
            {previewData.videoPreview && (
              <div className="preview-video">
                <video controls src={previewData.videoPreview} className="w-100" />
              </div>
            )}

            {/* tags */}
            <div className="preview-tags">
              {previewData.tags?.map((t) => <span key={t} className="badge tag">{t}</span>)}
              {previewData.hashtags?.map((h) => <span key={h} className="badge hashtag">#{h}</span>)}
            </div>

            {/* EditorJS blocks render (simple rendering) */}
            <div className="preview-blocks">
              {previewData.blocks?.map((block, idx) => {
                const type = block.type;
                const data = block.data || {};
                switch (type) {
                  case "paragraph":
                    return <p key={idx} dangerouslySetInnerHTML={{ __html: data.text || "" }} />;
                  case "header":
                    return React.createElement(`h${data.level || 2}`, { key: idx, dangerouslySetInnerHTML: { __html: data.text || "" } });
                  case "list":
                    return data.style === "ordered" ? (
                      <ol key={idx}>{(data.items || []).map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}</ol>
                    ) : (
                      <ul key={idx}>{(data.items || []).map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}</ul>
                    );
                  case "quote":
                    return <blockquote key={idx} dangerouslySetInnerHTML={{ __html: data.caption ? `${data.text} — ${data.caption}` : data.text || "" }} />;
                  case "image":
                    // block.data.file?.url or block.data.url
                    const url = data.file?.url || data.url;
                    return url ? <img key={idx} src={url} alt={data.caption || "img"} className="preview-inline-img" /> : null;
                  case "embed":
                    return <div key={idx} dangerouslySetInnerHTML={{ __html: data.embed || "" }} />;
                  default:
                    // fallback: show JSON
                    return <pre key={idx} className="block-json">{JSON.stringify(block, null, 2)}</pre>;
                }
              })}
            </div>

            {/* Jodit content HTML */}
            {previewData.joditContent && (
              <div className="preview-jodit" dangerouslySetInnerHTML={{ __html: previewData.joditContent }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;











/*
import React, { useState, useEffect, useRef, useContext } from "react";
import newRequest from "../../api/newRequest";
import { Plus, X, Check, XCircle, Eye } from "lucide-react";
import slugify from "slugify";
import MDEditor, { commands } from "@uiw/react-md-editor";
import JoditEditor from 'jodit-react';
import { EditorContext } from "../../apps/notes/components/EditorContext";
import "./AddPost.css";

const AddPost = ({ user }) => {
  const [form, setForm] = useState({
    title: "",
    trending: "no",
    description: "",
    content: "",
    blocks: {},
    status: user?.role === "admin" ? "published" : "draft",
    scheduledDate: "",
    categoryId: "",
    subcategoryId: "",
    channelId: "",
    audioLink: "",
    videoLink: "",
  });
  const [state, setState] = useState({});
  const [slug, setSlug] = useState('');
  const [slugUnique, setSlugUnique] = useState(null); // null = not checked
  const [slugChecking, setSlugChecking] = useState(false);
  const [updateBtn, setUpdateBtn] = useState(false);
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
  const [previewData, setPreviewData] = useState(null);
    
  const editor = useRef();
  const config = {
      readonly : false
  }
  const { initEditor, editorInstanceRef } = useContext(EditorContext);
  const editorRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current && document.getElementById("editorjs")) {
      initEditor();
      editorRef.current = true;
    }
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

   // ✅ Auto slugify on title change
  useEffect(() => {
    if (form.title.trim()) {
      const baseSlug = slugify(form.title, { lower: true, strict: true });
      setSlug(baseSlug);
    }
  }, [form.title]);

  // ✅ Slug check
  useEffect(() => {
    if (!slug) return;
    const timer = setTimeout(async () => {
      const res = await newRequest.get(`/posts/check-slug/${slug}`);
      setSlugUnique(res.data.unique);
    }, 400);
    return () => clearTimeout(timer);
  }, [slug]);

    // auto check whenever slug changes and user stops typing
    useEffect(() => {
      const delay = setTimeout(() => {
        if (slug.trim()) checkSlug(slug);
      }, 500);
      return () => clearTimeout(delay);
    }, [slug]);

 
  // ---------- Category/Subcategory/Channel ----------
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setForm({ ...form, category: selectedId, subcategory: "" });
    setSubcategories(categories.filter((c) => c.parentId === selectedId));
  };

  const handleSubcategoryChange = (e) => {
    setForm({ ...form, subcategory: e.target.value });
  };

  // ✅ Tag handlers
  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
      // toast.info(`Tag "${trimmedTag}" added`);
      console.log(`Tag "${trimmedTag}" added`);
    } else {
      // toast.warning("Duplicate or empty tag");
      console.log("Duplicate or empty tag");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    // toast.info(`Removed tag "${tagToRemove}"`);
    console.log(`Removed tag "${tagToRemove}"`);
  };

  // ✅ Hashtag handlers
  const handleHashtagAdd = () => {
    const trimmed = hashtagInput.trim();
    if (trimmed && !hashtags.includes(trimmed)) {
      setHashtags([...hashtags, trimmed]);
      setHashtagInput("");
      // toast.info(`Hashtag "#${trimmed}" added`);
      console.log(`Hashtag "#${trimmed}" added`);
    } else {
      // toast.warning("Duplicate or empty hashtag");
      console.log("Duplicate or empty hashtag");
    }
  };

  const handleHashtagRemove = (tag) => {
    setHashtags(hashtags.filter((t) => t !== tag));
    // toast.info(`Removed hashtag "#${tag}"`);
    console.log(`Removed hashtag "#${tag}"`);
  };
  const handleChannelChange = (e) => setForm({ ...form, channelId: e.target.value });

  
  // ---------- Media Handling ----------
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
            onChange={(e) => setFiles((prev) => ({ ...prev, link: e.target.value }))}
          />
        )}
        {Array.isArray(files) && files.length > 0 && (
          <div className="file-preview">
            {files.map((f, i) => (
              <div key={i} className="file-item">
                {f.name} <X onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };


    const uploadToCloudinary = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await axios.post(CLOUDINARY_URL, formData);
      return res.data.secure_url;
    };
  

    const handleCoverImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    };
  

    const handleMultipleImages = async (e) => {
      const files = Array.from(e.target.files);
      const urls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      }
      setImages((prev) => [...prev, ...urls]);
    };
  

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

  const handlePreview = async () => {
    const data = await editorRef.current.save();
    setPreviewData({
      title,
      tags,
      slug,
      description,
      imagePreview,
      blocks: data.blocks,
      content: text,
      audioFile,
      audioLink,
      videoFile,
      videoLink,
      images,
    });
    setShowPreview(true);
  };


  // ---------- Publish / Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    let data;
    try {
      data = await editorInstanceRef.current?.save?.();
    } catch (err) {
      // toast.error("EditorJS failed");
      return;
    }

    if (!form.title || !form.description || !form.channelId || !data?.blocks?.length)  {
      alert("Title, description, and channel, blocks are required!");
      return;
    }

    console.log(form);

    

    try {
      const blocks = await getEditorData(); // Always get latest EditorJS blocks
      const baseSlug = slugify(form.title || "untitled", { lower: true, strict: true });
      const slug = `${baseSlug}-${Date.now()}`;
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("slug", slug);
      formData.append("description", form.description);
      formData.append("content", text || "");
      formData.append("blocks", JSON.stringify(data.blocks));
      formData.append("trending", form.trending || "no");
      formData.append("status", isDraft ? "draft" : form.status);
      formData.append("scheduledDate", form.scheduledDate || "");
      formData.append("author", user._id);
      formData.append("userId", user._id);

      if (form.channelId) formData.append("channelId", form.channelId);
      if (form.categoryId) formData.append("categoryId", form.categoryId);
      if (form.subcategoryId) formData.append("subcategoryId", form.subcategoryId);
      formData.append("tags", JSON.stringify(tags));
      formData.append("hashtags", JSON.stringify(hashtags));

      images.forEach((img) => formData.append("images", img));
      if (audioFile?.file) formData.append("audio", audioFile.file);
      else if (form.audioLink) formData.append("audioUrl", form.audioLink);
      if (videoFile?.file) formData.append("video", videoFile.file);
      else if (form.videoLink) formData.append("videoUrl", form.videoLink);

      // const response = await newRequest.post("/posts", formData);
      const res = await newRequest.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post created successfully!");
      console.log(res.data);
      resetForm();
    } catch (err) {
      console.error("Failed to save post:", err);
      alert("Failed to save post.");
    }
  };

  const resetForm = () => {
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
  };

  // ---------- Render ----------
  return (
    <div className="add-post-container">
      <h2>Create New Post</h2>
      <form className="add-post-form" 
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        method="post" 
      >
      
        <div className="form-group">
          <label>Post Title *</label>
          <input
            className="input-field"
            placeholder="Post Title"
            value={form.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setForm({ ...form, title: newTitle });

              // auto slugify
              if (newTitle.trim()) {
                const newSlug = slugify(newTitle, { lower: true, strict: true });
                setSlug(newSlug);
                setUpdateBtn(false); // reset manual update mode
              } else {
                setSlug("");
              }
            }}
            required
          />
        </div>

    
        <div className="form-group slug-field">
          <label>Slug</label>
          <div className="slug-input-wrapper">
            <input
              type="text"
              className={`input-field ${
                slugUnique === false ? "slug-error" : slugUnique === true ? "slug-ok" : ""
              }`}
              value={slug}
              onChange={(e) => {
                const clean = e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9\-]/g, "");
                setSlug(clean);
                setUpdateBtn(true);
              }}
              onBlur={() => checkSlug(slug)}
            />

            {slugChecking ? (
              <span className="slug-status checking">Checking...</span>
            ) : slugUnique === true ? (
              <span className="slug-status success">
                <Check size={16} /> Available
              </span>
            ) : slugUnique === false ? (
              <span className="slug-status error">
                <XCircle size={16} /> Already exists
              </span>
            ) : null}
          </div>
          <small>URL-friendly unique slug. You can edit manually.</small>

          {updateBtn && (
            <button
              type="button"
              className="slug-update-btn"
              onClick={(e) => {
                e.preventDefault();
                const newSlug = slugify(slug, { lower: true, strict: true });
                setSlug(newSlug);
                setUpdateBtn(false);
              }}
            >
              <Check size={14} /> Update Slug
            </button>
          )}
        </div>



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
              <option key={ch._id} value={ch._id}>{ch.name}</option>
            ))}
          </select>

          <select value={form.categoryId} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.filter((c) => !c.parentId).map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select value={form.subcategoryId} onChange={handleSubcategoryChange} disabled={!subcategories.length}>
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
        </div>

       
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
            <button type="button" className="icon-btn" onClick={handleTagAdd}><Plus size={16} /></button>
            <br/> 
          </div>
          <small>Press enter or click "Add" to add tag</small> 
          <div className="badges">
            {tags.map((t) => (
              <span key={t} className="tag-badge">{t} <X size={12} onClick={() => handleTagRemove(t)} /></span>
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
                if (e.key === "Enter") { e.preventDefault(); handleHashtagAdd(); }
              }}
            />
            <button type="button" className="icon-btn" onClick={handleHashtagAdd}><Plus size={16} /></button>
          </div>
          <small>Press enter or click "Add" to add hashtag</small> 
          <div className="badges">
            {hashtags.map((h) => (
              <span key={h} className="tag-badge">#{h} <X size={12} onClick={() => handleHashtagRemove(h)} /></span>
            ))}
          </div>
        </div>


        <div className="editorjs-container">
          <label>Blocks Editor</label>
          <div id="editorjs" style={{ minHeight: 400, border: "1px solid #ddd", borderRadius: 8, padding: 10 }}></div>
        </div>

        <div 
            // className="mt-2 mb-4 p-3 bg-light border rounded editor-box"
            style={{width:'100%', minHeight:'100%',marginTop:'30px'}}
          ><label>Content</label>
            <div className="mb-3 "  >
            <JoditEditor
                value={text}
                tabIndex = {1}
                ref = {editor}
                config={config}
                onBlur={newText => setText(newText)}
                onChange={newText => {}}
            />
            </div>
        </div>

       
        <MediaDropZone label="Images" files={images} setFiles={setImages} />
        <MediaDropZone label="Audio File" files={audioFile || {}} setFiles={setAudioFile} placeholder="Or paste audio link" />
        <MediaDropZone label="Video File" files={videoFile || {}} setFiles={setVideoFile} placeholder="Or paste video link" />

        <div className="action-buttons" style={{ marginBottom: "10%" }}>
          <button type="button" className="btn primary" onClick={() => setShowPreview(true)}><Eye size={16} /> Preview</button>
          <button type="button" className="btn primary" onClick={() => handleSubmit(false)}>Publish Post</button>
        </div>
      </form>

      <br/><br/><br/><br/><br/><br/><br/><br/>


      {showPreview && (
        <div className="preview-modal">
          <div className="preview-overlay" onClick={() => setShowPreview(false)}></div>
          <div className="preview-box">
            <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
            <h3>{form?.title}</h3>
            <div className="preview-description" dangerouslySetInnerHTML={{ __html: form.description }} />
            {form?.imagePreview && <img src={form.imagePreview} alt="cover" />}
            {form?.audioFile && <audio controls src={form.audioFile} />}
            {form?.videoFile && <video controls src={form.videoFile} width="400" />}
            <div className="preview-tags">
              {previewData?.tags?.map((tag) => (
                <span key={tag} className="tag-item">{tag}</span>
              ))}
            </div>
            <div className="preview-content">
              {form?.blocks?.map((block, index) => {
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
*/




