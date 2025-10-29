// src/pages/newsletter/EmailTemplateEditor.jsx
// src/pages/newsletter/EmailTemplateEditor.jsx
// src/pages/newsletter/EmailTemplateEditor.jsx
// src/pages/newsletter/EmailTemplateEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import presetNewsletter from "grapesjs-preset-newsletter";
import presetWebpage from "grapesjs-preset-webpage";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./EmailTemplateEditor.css";

const EmailTemplateEditor = () => {
  const editorRef = useRef(null);
  const carouselRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [name, setName] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [activeTab, setActiveTab] = useState("design");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const templateId = id || searchParams.get("templateId");
  const navigate = useNavigate();

  // Initialize GrapesJS
  useEffect(() => {
    if (editorRef.current && !editor) {
      const e = grapesjs.init({
        container: editorRef.current,
        height: "75vh",
        fromElement: false,
        plugins: [presetNewsletter, presetWebpage],
        storageManager: false,
        panels: { defaults: [] },
      });
      setEditor(e);

      const bm = e.BlockManager;
      [
        { id: "header", label: "Header", category: "Layout", content: `<header style="background:#003366;color:white;padding:20px;text-align:center;"><h1>Newsletter Header</h1></header>` },
        { id: "text", label: "Text", category: "Text", content: `<p style="font-size:14px;line-height:1.5;">Your paragraph text here...</p>` },
        { id: "image", label: "Image", category: "Media", content: `<img src="https://via.placeholder.com/600x200" style="width:100%;border-radius:8px;" />` },
        { id: "button", label: "Button", category: "Components", content: `<a href="#" style="display:inline-block;padding:10px 20px;background:#ff6600;color:white;text-decoration:none;border-radius:4px;">Click Me</a>` },
        { id: "footer", label: "Footer", category: "Layout", content: `<footer style="background:#222;color:white;text-align:center;padding:10px;">© 2025 Company</footer>` },
      ].forEach(b => bm.add(b.id, b));

      // Drop multiple images
      e.on("canvas:drop", (dataTransfer) => {
        if (!dataTransfer?.files) return;
        const files = Array.from(dataTransfer.files).filter(f => f.type.startsWith("image/"));
        files.forEach(file => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const url = ev.target.result;
            e.addComponents(`<img src="${url}" style="max-width:100%; border-radius:8px; margin-bottom:10px;" />`);
            setImageFiles(prev => [...prev, file]);
            setImagePreviews(prev => [...prev, url]);
          };
          reader.readAsDataURL(file);
        });
      });

      const syncCode = () => {
        setHtmlCode(e.getHtml());
        setCssCode(e.getCss());
      };
      e.on("update", syncCode);
      e.on("component:add", syncCode);
      e.on("component:remove", syncCode);
    }
  }, [editor]);

  // Load template if editing
  useEffect(() => {
    if (!templateId || !editor) return;
    const loadTemplate = async () => {
      try {
        setLoadingTemplate(true);
        const res = await newRequest.get(`/templates/${templateId}`);
        const tpl = res.data.template;
        setName(tpl.name || "");
        if (tpl.image) setImagePreviews([tpl.image]);
        const html = tpl.html || "";
        const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const css = match ? match[1] : "";
        const cleanHtml = match ? html.replace(match[0], "") : html;

        setHtmlCode(cleanHtml);
        setCssCode(css);
        editor.setComponents(cleanHtml || "<div></div>");
        editor.setStyle(css || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load template");
      } finally {
        setLoadingTemplate(false);
      }
    };
    loadTemplate();
  }, [templateId, editor]);

  // Handle file input
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const urls = files.map(f => URL.createObjectURL(f));
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...urls]);
  };

  // Remove image
  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Drag-and-drop rearrange
  const onDragStart = (index) => setDraggedIndex(index);
  const onDragOver = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const tempPreviews = [...imagePreviews];
    const tempFiles = [...imageFiles];
    const draggedFile = tempFiles[draggedIndex];
    const draggedPreview = tempPreviews[draggedIndex];
    tempFiles.splice(draggedIndex, 1);
    tempPreviews.splice(draggedIndex, 1);
    tempFiles.splice(index, 0, draggedFile);
    tempPreviews.splice(index, 0, draggedPreview);
    setDraggedIndex(index);
    setImageFiles(tempFiles);
    setImagePreviews(tempPreviews);
  };

  // Scroll handlers
  const scrollNext = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  const scrollPrev = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  // Save/update template
  const handleSaveOrUpdate = async () => {
    if (!name.trim()) return alert("Enter a template name");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("html", `${htmlCode}<style>${cssCode}</style>`);
    formData.append("css", cssCode || "");
    imageFiles.forEach(f => formData.append("image", f));
    try {
      if (templateId) {
        await newRequest.put(`/templates/${templateId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        alert("✅ Template updated");
        navigate("/templates");
      } else {
        const res = await newRequest.post("/templates", formData, { headers: { "Content-Type": "multipart/form-data" } });
        alert("✅ Template saved");
        navigate(`/edit-email-template/${res.data.template._id}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  // Apply code to design
  const handleApplyToDesign = () => {
    if (!editor) return;
    editor.setComponents(htmlCode || "<div></div>");
    editor.setStyle(cssCode || "");
    imagePreviews.forEach(url => {
      editor.addComponents(`<img src="${url}" style="max-width:100%; border-radius:8px; margin-bottom:10px;" />`);
    });
    alert("✅ Design updated from code!");
  };

  // Apply code to design tab
  const handleApplyCode = () => {
    if (!editor) return;
    editor.setComponents(htmlCode || "<div></div>");
    editor.addStyle(cssCode || "");
    alert("✅ Design updated from code!");
    setActiveTab("design");
  };

  const handleSendWhatsApp = async () => {
    try {
      // 🧠 Parse stored user properly
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return alert("User not logged in");

      const user = JSON.parse(storedUser);
      const userId = user?._id;

      if (!userId) return alert("User ID not found in localStorage");

      const confirmSend = window.confirm("Send this email as WhatsApp message?");
      if (!confirmSend) return;

      const res = await newRequest.post("/templates/send-template", {
        userId,
        templateId,
      });

      if (res.data.success) {
        alert(`✅ Template sent to WhatsApp (${res.data.to})`);
      } else {
        alert(`❌ Failed: ${res.data.error}`);
      }
    } catch (err) {
      console.error("❌ Error sending WhatsApp:", err);
      alert("Error sending WhatsApp message");
    }
  };



  return (
    <div className="editor-container">
      <div className="top-bar">
        <h3>{templateId ? "Edit Template" : "Create Template"}</h3>
        <div className="action-buttons">
          <input type="text" placeholder="Template name" value={name} onChange={e => setName(e.target.value)} />

          {/* Professional Image Carousel */}
          {imagePreviews.length > 0 && (
            <div className="carousel-wrapper">
              <button className="carousel-nav prev" onClick={scrollPrev}>‹</button>
              <div className="carousel" ref={carouselRef}>
                {imagePreviews.map((url, i) => (
                  <div
                    key={i}
                    className="carousel-item"
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragOver={() => onDragOver(i)}
                  >
                    <img src={url} alt={`preview-${i}`} />
                    <button className="remove-btn" onClick={() => removeImage(i)}>×</button>
                  </div>
                ))}
              </div>
              <button className="carousel-nav next" onClick={scrollNext}>›</button>
            </div>
          )}

          <input type="file" accept="image/*" multiple onChange={handleImageChange} />

          <div className="buttons-inline">
            <button onClick={() => setActiveTab("design")} className={activeTab === "design" ? "active" : ""}>Design</button>
            <button onClick={() => setActiveTab("code")} className={activeTab === "code" ? "active" : ""}>Code</button>
            <button onClick={() => setShowPreviewModal(true)}>Preview</button>
            <button onClick={() => editor?.UndoManager.undo()}>Undo</button>
            <button onClick={() => editor?.UndoManager.redo()}>Redo</button>
            <button onClick={handleSaveOrUpdate}>{templateId ? "Update Template" : "Save Template"}</button>
            <button onClick={handleSendWhatsApp}>📱 Send as WhatsApp</button>
          </div>
        </div>
      </div>

      <div className="editor-main">
        {activeTab === "design" && <div ref={editorRef} className="editor-box" />}
        {activeTab === "code" && (
          <div className="code-box">
            <textarea value={htmlCode} onChange={e => setHtmlCode(e.target.value)} placeholder="HTML" />
            <textarea value={cssCode} onChange={e => setCssCode(e.target.value)} placeholder="CSS" />
            
            {/*<button onClick={handleApplyToDesign}>↻ Apply to Design</button>*/}
            <button className="apply-code-btn" onClick={handleApplyCode}>
                ↻ Apply to Design
              </button>
          </div>
        )}
      </div>

      {showPreviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowPreviewModal(false)}>×</button>
            <iframe title="preview" srcDoc={`${htmlCode}<style>${cssCode}</style>`} sandbox="allow-same-origin allow-popups allow-forms" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplateEditor;





