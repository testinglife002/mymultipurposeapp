// src/pages/newsletter/CreateEmailTemplate.jsx
import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import presetNewsletter from "grapesjs-preset-newsletter";
import presetWebpage from "grapesjs-preset-webpage";
import { useNavigate } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./EmailTemplateEditors.css";

const CreateEmailTemplate = () => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [name, setName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

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
      const blocks = [
        {
          id: "header",
          label: "Header",
          category: "Layout",
          content: `<header style="background:#003366;color:#fff;padding:20px;text-align:center;"><h1>Header Title</h1></header>`,
        },
        {
          id: "text",
          label: "Text",
          category: "Text",
          content: `<p style="font-size:14px;line-height:1.5;">Your paragraph text here...</p>`,
        },
        {
          id: "image",
          label: "Image",
          category: "Media",
          content: `<img src="https://via.placeholder.com/600x200" style="width:100%;border-radius:8px;" />`,
        },
        {
          id: "button",
          label: "Button",
          category: "Components",
          content: `<a href="#" style="display:inline-block;padding:10px 20px;background:#ff6600;color:white;text-decoration:none;border-radius:4px;">Click Me</a>`,
        },
        {
          id: "footer",
          label: "Footer",
          category: "Layout",
          content: `<footer style="background:#222;color:#fff;text-align:center;padding:10px;">© 2025 Company</footer>`,
        },
      ];
      blocks.forEach(b => bm.add(b.id, b));

      // Make categories collapsible with rotating arrows
      setTimeout(() => {
        const cats = document.querySelectorAll(".gjs-block-category");
        cats.forEach(cat => {
          const title = cat.querySelector(".gjs-block-category-title");
          if (title) {
            const arrow = document.createElement("span");
            arrow.className = "cat-arrow";
            arrow.innerHTML = "▶";
            title.prepend(arrow);
            title.addEventListener("click", () => {
              cat.classList.toggle("collapsed");
            });
          }
        });
      }, 800);
    }
  }, [editor]);

  const handleSave = async () => {
    if (!name.trim()) return alert("Enter a template name");
    const html = editor.getHtml();
    const css = editor.getCss();
    const payload = { name, html: `${html}<style>${css}</style>` };
    try {
      const res = await newRequest.post("/templates", payload);
      alert("✅ Template saved");
      navigate(`/edit-email-template/${res.data.template._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save template.");
    }
  };

  return (
    <div className="editor-container">
      <div className="top-bar">
        <h3>Create Template</h3>
        <div className="action-buttons">
          <input
            type="text"
            className="template-name"
            placeholder="Template name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="buttons-inline">
            <button onClick={() => setShowPreview(true)}>Preview</button>
            <button onClick={handleSave}>Save Template</button>
          </div>
        </div>
      </div>

      <div ref={editorRef} className="editor-box"></div>

      {showPreview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowPreview(false)}>×</button>
            <iframe
              title="preview"
              srcDoc={`${editor.getHtml()}<style>${editor.getCss()}</style>`}
              sandbox="allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEmailTemplate;
