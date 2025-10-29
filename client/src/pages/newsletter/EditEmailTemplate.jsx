// src/pages/newsletter/EditEmailTemplate.jsx
// src/pages/newsletter/EditEmailTemplate.jsx
// src/pages/newsletter/EditEmailTemplate.jsx
import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import presetNewsletter from "grapesjs-preset-newsletter";
import presetWebpage from "grapesjs-preset-webpage";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./EmailTemplateEditors.css";

const EditEmailTemplate = () => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("design");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { id } = useParams();
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

      // Load template
      const loadTemplate = async () => {
        setLoading(true);
        try {
          const res = await newRequest.get(`/templates/${id}`);
          const tpl = res.data.template || res.data || {};
          if (!tpl || !tpl.html) throw new Error("Invalid template data");

          setName(tpl.name || "");
          const html = tpl.html || "";
          const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          const extractedCss = styleMatch ? styleMatch[1] : "";
          const extractedHtml = styleMatch ? html.replace(styleMatch[0], "") : html;

          setHtmlCode(extractedHtml);
          setCssCode(extractedCss);

          e.setComponents(extractedHtml || "<div></div>");
          e.addStyle(extractedCss);
        } catch (err) {
          console.error("Failed loading template:", err);
          alert("Could not load template for editing.");
        } finally {
          setLoading(false);
        }
      };
      loadTemplate();
    }
  }, [editor, id]);

  // Sync editor when switching back to design tab
  useEffect(() => {
    if (activeTab === "design" && editor) {
      editor.setComponents(htmlCode || "<div></div>");
      editor.addStyle(cssCode || "");
    }
  }, [activeTab, editor]);

  // Update template
  const handleUpdate = async () => {
    if (!name.trim()) return alert("Enter a template name");
    setUpdating(true);
    try {
      const html = editor.getHtml();
      const css = editor.getCss();
      const payload = { name, html: `${html}<style>${css}</style>` };
      await newRequest.put(`/templates/${id}`, payload);
      alert("✅ Template updated!");
      navigate("/templates");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Delete template
  const handleDelete = async () => {
    if (!window.confirm("🗑️ Delete this template permanently?")) return;
    setDeleting(true);
    try {
      await newRequest.delete(`/templates/${id}`);
      alert("✅ Template deleted successfully");
      navigate("/templates");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Apply code to design tab
  const handleApplyCode = () => {
    if (!editor) return;
    editor.setComponents(htmlCode || "<div></div>");
    editor.addStyle(cssCode || "");
    alert("✅ Design updated from code!");
    setActiveTab("design");
  };

  return (
    <div className="editor-container">
      <div className="top-bar">
        <h3>Edit Template</h3>
        <div className="action-buttons">
          <input
            type="text"
            className="template-name"
            placeholder="Template name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="buttons-inline">
            <button
              onClick={() => setActiveTab("design")}
              className={activeTab === "design" ? "active" : ""}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={activeTab === "code" ? "active" : ""}
            >
              Code
            </button>
            <button onClick={() => setShowPreview(true)}>Preview</button>
            <button onClick={handleUpdate} disabled={updating}>
              {updating ? "Updating…" : "Update"}
            </button>
            <button onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-3 text-center">Loading template…</div>
      ) : (
        <>
          {activeTab === "design" && <div ref={editorRef} className="editor-box"></div>}
          {activeTab === "code" && (
            <div className="code-box">
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="HTML code"
              />
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                placeholder="CSS code"
              />
              <button className="apply-code-btn" onClick={handleApplyCode}>
                ↻ Apply to Design
              </button>
            </div>
          )}
        </>
      )}

      {showPreview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowPreview(false)}>
              ×
            </button>
            <iframe
              title="preview"
              srcDoc={`${htmlCode}<style>${cssCode}</style>`}
              sandbox="allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEmailTemplate;

