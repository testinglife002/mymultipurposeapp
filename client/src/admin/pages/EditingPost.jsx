// src/pages/post/EditingPost.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Edit2,
  Loader2,
  Eye,
} from "lucide-react";
import newRequest from "../../api/newRequest"; // same helper used in AddPost
import MDEditor, { commands } from "@uiw/react-md-editor";
import JoditEditor from "jodit-react";
import slugify from "slugify";
import { EditorContext } from "../../apps/notes/components/EditorContext";
import "./EditingPost.css";

const EditingPost = ({ user }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { initEditor, editorInstanceRef } = useContext(EditorContext) || {};

  // main form state
  const [postId, setPostId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    blocks: [],
    trending: "no",
    status: "draft",
    scheduledDate: "",
    categoryId: "",
    subcategoryId: "",
    channelId: "",
    tags: [],
    hashtags: [],
    allowComments: true,
    publishedByAdmin: false,
    audioLink: "",
    videoLink: "",
  });

  // UI / helpers
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [channels, setChannels] = useState([]);

  const [tagsInput, setTagsInput] = useState("");
  const [hashtagsInput, setHashtagsInput] = useState("");

  const [existingImages, setExistingImages] = useState([]); // images already stored on post {url,isPrimary}
  const [newImages, setNewImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // previews for new images

  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [text, setText] = useState(""); // jodit content
  const joditRef = useRef();
  const editorInitializedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // slug checking debounced
  const [slugUnique, setSlugUnique] = useState(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const slugTimerRef = useRef(null);

  // load categories & channels lists
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, chanRes] = await Promise.all([
          newRequest.get("/categories").catch(() => ({ data: [] })),
          newRequest.get("/channels").catch(() => ({ data: [] })),
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data?.data || []);
        setChannels(Array.isArray(chanRes.data) ? chanRes.data : chanRes.data?.data || []);
      } catch (err) {
        console.error("Failed to load meta lists", err);
      }
    };
    fetchMeta();
  }, []);

  // fetch post by slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await newRequest.get(`/posts/slug/${slug}`);
        const p = res.data;
        if (!p) {
          setLoading(false);
          return;
        }

        // prefill
        setPostId(p._id || p.id);
        setForm((f) => ({
          ...f,
          title: p.title || "",
          slug: p.slug || "",
          description: p.description || "",
          content: p.content || "",
          blocks: Array.isArray(p.blocks) ? p.blocks : [],
          trending: p.trending || "no",
          status: p.status || "draft",
          scheduledDate: p.scheduledDate ? new Date(p.scheduledDate).toISOString().slice(0, 16) : "",
          categoryId: p.categoryId?._id || p.categoryId || "",
          subcategoryId: p.subcategoryId?._id || p.subcategoryId || "",
          channelId: p.channel?._id || p.channel || "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
          allowComments: typeof p.allowComments === "boolean" ? p.allowComments : true,
          publishedByAdmin: !!p.publishedByAdmin,
          audioLink: p.audioUrl || "",
          videoLink: p.videoUrl || "",
        }));
        setExistingImages(Array.isArray(p.images) ? p.images : []);
        setImagePreviews([]);
        setNewImages([]);
        setText(p.content || "");
        // initialize EditorJS with existing blocks after a tick / when DOM exists
        setTimeout(() => {
          if (initEditor && !editorInitializedRef.current) {
            try {
              initEditor("editorjs", { blocks: p.blocks || [] });
              editorInitializedRef.current = true;
            } catch (err) {
              console.warn("Editor init failed:", err);
            }
          }
        }, 120);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, initEditor]);

  // auto-generate slug from title (unless user edited slug)
  const [manualSlug, setManualSlug] = useState(false);
  useEffect(() => {
    if (!form.title) return;
    if (!manualSlug) {
      setForm((f) => ({ ...f, slug: slugify(form.title || "", { lower: true, strict: true }) }));
    }
  }, [form.title, manualSlug]);

  // slug uniqueness check (debounced)
  useEffect(() => {
    const s = form.slug?.trim();
    if (!s) {
      setSlugUnique(null);
      return;
    }
    setSlugChecking(true);
    if (slugTimerRef.current) clearTimeout(slugTimerRef.current);
    slugTimerRef.current = setTimeout(async () => {
      try {
        const res = await newRequest.get(`/posts/check-slug/${s}`);
        // if fetched slug belongs to this post, ignore uniqueness failure
        const unique = Boolean(res.data?.unique) || s === (slug || "");
        setSlugUnique(unique);
      } catch (err) {
        console.warn("Slug check failed", err);
        setSlugUnique(null);
      } finally {
        setSlugChecking(false);
      }
    }, 400);
    return () => clearTimeout(slugTimerRef.current);
  }, [form.slug, slug]);

  // Helpers: tag handlers
  const addTag = () => {
    const t = tagsInput.trim();
    if (!t) return;
    if (!form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagsInput("");
  };
  const removeTag = (t) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));
  const addHashtag = () => {
    const h = hashtagsInput.trim();
    if (!h) return;
    if (!form.hashtags.includes(h)) setForm((f) => ({ ...f, hashtags: [...f.hashtags, h] }));
    setHashtagsInput("");
  };
  const removeHashtag = (h) => setForm((f) => ({ ...f, hashtags: f.hashtags.filter((x) => x !== h) }));

  // category -> populate subcategories (if your category objects include parentId)
  useEffect(() => {
    if (!form.categoryId || !categories.length) {
      setSubcategories([]);
      return;
    }
    const subs = categories.filter((c) => String(c.parentId) === String(form.categoryId));
    setSubcategories(subs);
  }, [form.categoryId, categories]);

  // file drop/choose for images
  const handleImageFiles = (files) => {
    const arr = Array.from(files || []);
    setNewImages((prev) => [...prev, ...arr]);
    const previews = arr.map((f) => URL.createObjectURL(f));
    setImagePreviews((p) => [...p, ...previews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // helper to collect EditorJS blocks
  const getEditorBlocks = async () => {
    try {
      if (editorInstanceRef?.current?.save) {
        const saved = await editorInstanceRef.current.save();
        return saved?.blocks || [];
      }
    } catch (err) {
      console.warn("Failed to get editor blocks:", err);
    }
    return form.blocks || [];
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postId) {
      alert("Post ID missing");
      return;
    }

    // validate basic fields
    if (!form.title || !form.channelId) {
      alert("Title and Channel are required");
      return;
    }

    setSaving(true);
    try {
      const blocks = await getEditorBlocks();
      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("slug", form.slug || slugify(form.title || "", { lower: true, strict: true }));
      fd.append("description", form.description || "");
      fd.append("content", joditRef.current?.value || form.content || "");
      fd.append("blocks", JSON.stringify(blocks || []));
      fd.append("trending", form.trending || "no");
      fd.append("status", form.status || "draft");
      fd.append("scheduledDate", form.scheduledDate || "");
      fd.append("author", user?._id || "");
      fd.append("userId", user?._id || "");
      if (form.channelId) fd.append("channelId", form.channelId);
      if (form.categoryId) fd.append("categoryId", form.categoryId);
      if (form.subcategoryId) fd.append("subcategoryId", form.subcategoryId);
      fd.append("tags", JSON.stringify(form.tags || []));
      fd.append("hashtags", JSON.stringify(form.hashtags || []));
      fd.append("allowComments", form.allowComments ? "true" : "false");
      fd.append("publishedByAdmin", form.publishedByAdmin ? "true" : "false");

      // existing images: if user removed all existing images, we send nothing (backend replaces if req.files.images present)
      // To preserve existing images when no new upload is provided, send a JSON field with existing image URLs
      fd.append("existingImages", JSON.stringify(existingImages || []));

      // append new image files
      newImages.forEach((file) => fd.append("images", file));

      // audio file OR audio link
      if (audioFile instanceof File) {
        fd.append("audio", audioFile);
      } else if (form.audioLink) {
        fd.append("audioUrl", form.audioLink);
      }

      // video file OR link
      if (videoFile instanceof File) {
        fd.append("video", videoFile);
      } else if (form.videoLink) {
        fd.append("videoUrl", form.videoLink);
      }

      // note: your backend has route: PUT /posts/:id (mounted under posts router)
      // That becomes newRequest.put(`/posts/posts/${postId}`, fd, ...)
      const res = await newRequest.put(`/posts/posts/${postId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        alert("Post updated");
        navigate(`/slug/${res.data.post.slug || form.slug}`);
      } else {
        console.warn("Update response:", res.data);
        alert("Update completed (check console).");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. See console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editpost-loading">
        <Loader2 className="spin" size={28} />
        <div>Loading post...</div>
      </div>
    );
  }

  return (
    <div className="editpost-page">
      <div className="editpost-container">
        <header className="editpost-header">
          <button className="back" onClick={() => navigate(-1)}>← Back</button>
          <h1>Edit Post</h1>
          <div className="header-actions">
            <button className="view-btn" onClick={() => navigate(`/slug/${form.slug}`)} title="View">
              <Eye size={16} /> View
            </button>
            <button className="save-btn" onClick={handleSubmit} disabled={saving}>
              {saving ? <Loader2 size={14} className="spin" /> : <Check size={14} />} Save
            </button>
          </div>
        </header>

        <form className="editpost-form" onSubmit={handleSubmit}>
          {/* Left column - content */}
          <div className="col col-left">
            <div className="card">
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Post title"
                required
              />
            </div>

            <div className="card two-cols">
              <div>
                <label>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, slug: e.target.value }));
                    setManualSlug(true);
                  }}
                />
                <div className="slug-status">
                  {slugChecking ? (
                    <small>Checking...</small>
                  ) : slugUnique === true ? (
                    <small className="ok">Available</small>
                  ) : slugUnique === false ? (
                    <small className="err">Taken</small>
                  ) : null}
                </div>
              </div>

              <div>
                <label>Trending</label>
                <select
                  value={form.trending}
                  onChange={(e) => setForm((f) => ({ ...f, trending: e.target.value }))}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="card">
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
              />
            </div>

            <div className="card">
              <label>Blocks Editor</label>
              <div id="editorjs" style={{ minHeight: 260, borderRadius: 8, border: "1px solid #eee", padding: 10 }} />
            </div>

            <div className="card">
              <label>Rich content (Jodit)</label>
              <JoditEditor
                ref={joditRef}
                value={text}
                tabIndex={1}
                onBlur={(newText) => setText(newText)}
                onChange={() => {}}
                config={{ readonly: false }}
              />
            </div>

            <div className="card">
              <label>Images (existing / upload)</label>
              <div className="existing-images">
                {existingImages.length === 0 && <small className="muted">No existing images</small>}
                {existingImages.map((img, i) => (
                  <div key={i} className="img-pill">
                    <img src={img.url} alt={`existing-${i}`} />
                    <button type="button" onClick={() => removeExistingImage(i)} title="Remove"> <X size={12} /> </button>
                  </div>
                ))}
              </div>

              <div className="new-images">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageFiles(e.target.files)}
                />
                <div className="image-previews">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="img-pill">
                      <img src={src} alt={`new-${i}`} />
                      <button type="button" onClick={() => removeNewImage(i)}><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <small className="muted">Uploading new images will replace or append depending on backend logic.</small>
              </div>
            </div>

            <div className="card">
              <label>Audio (file or link)</label>
              <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
              <input
                placeholder="Or paste audio URL"
                value={form.audioLink}
                onChange={(e) => setForm((f) => ({ ...f, audioLink: e.target.value }))}
              />
            </div>

            <div className="card">
              <label>Video (file or link)</label>
              <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
              <input
                placeholder="Or paste video URL"
                value={form.videoLink}
                onChange={(e) => setForm((f) => ({ ...f, videoLink: e.target.value }))}
              />
            </div>
          </div>

          {/* Right column - meta */}
          <aside className="col col-right">
            <div className="card">
              <label>Channel</label>
              <select value={form.channelId} onChange={(e) => setForm((f) => ({ ...f, channelId: e.target.value }))} required>
                <option value="">Select channel</option>
                {channels.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div className="card">
              <label>Category</label>
              <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
                <option value="">Select category</option>
                {categories.filter(c => !c.parentId).map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              <label style={{ marginTop: 8 }}>Subcategory</label>
              <select value={form.subcategoryId} onChange={(e) => setForm((f) => ({ ...f, subcategoryId: e.target.value }))} disabled={!subcategories.length}>
                <option value="">Select subcategory</option>
                {subcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>

            <div className="card">
              <label>Tags</label>
              <div className="tag-input">
                <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Add tag and press Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
                <button type="button" onClick={addTag}><Check size={14} /></button>
              </div>
              <div className="badges">
                {form.tags.map((t, i) => (
                  <span key={i} className="badge">{t} <button type="button" onClick={() => removeTag(t)}><X size={12} /></button></span>
                ))}
              </div>

              <label style={{ marginTop: 10 }}>Hashtags</label>
              <div className="tag-input">
                <input value={hashtagsInput} onChange={(e) => setHashtagsInput(e.target.value)} placeholder="Add hashtag and press Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHashtag(); } }} />
                <button type="button" onClick={addHashtag}><Check size={14} /></button>
              </div>
              <div className="badges">
                {form.hashtags.map((h, i) => (
                  <span key={i} className="badge">#{h} <button type="button" onClick={() => removeHashtag(h)}><X size={12} /></button></span>
                ))}
              </div>
            </div>

            <div className="card">
              <label>Scheduling</label>
              <input type="datetime-local" value={form.scheduledDate} onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))} />
              <label style={{ marginTop: 8 }}>Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="card">
              <label>Flags</label>
              <div className="flag-row">
                <label><input type="checkbox" checked={form.allowComments} onChange={(e) => setForm((f) => ({ ...f, allowComments: e.target.checked }))} /> Allow comments</label>
              </div>
              <div className="flag-row">
                <label><input type="checkbox" checked={form.publishedByAdmin} onChange={(e) => setForm((f) => ({ ...f, publishedByAdmin: e.target.checked }))} /> Published by admin</label>
              </div>
            </div>

            <div className="card">
              <label>Meta</label>
              <div className="meta-row">
                <div><strong>Author:</strong> {user?.username || user?.email || "—"}</div>
                <div><strong>Created:</strong> {new Date().toLocaleString()}</div>
              </div>
            </div>

            <div className="card actions-card">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? <Loader2 className="spin" size={14} /> : <Check size={14} />} Save Changes
              </button>
              <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </aside>
        </form>
      </div>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </div>
  );
};

export default EditingPost;
