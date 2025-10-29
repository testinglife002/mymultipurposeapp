// 3️⃣ src/pages/newsletter/TemplateEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import newRequest from "../../api/newRequest";

const TemplateEditor = () => {
  const editorRef = useRef(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const editor = grapesjs.init({
      container: editorRef.current,
      height: "700px",
      width: "auto",
      storageManager: { autoload: 0 },
      plugins: [],
      pluginsOpts: {},
    });

    // 🏎️ Demo Car Showroom Newsletter Template (HTML + CSS)
    const demoHtml = `
      <div style="font-family:Arial, sans-serif; background-color:#f7f7f7; padding:20px;">
        <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">
          <tr>
            <td style="background:#000; color:#fff; text-align:center; padding:20px;">
              <h1 style="margin:0; font-size:28px;">Velocity Motors</h1>
              <p style="margin:0; font-size:14px;">Experience the Future of Driving</p>
            </td>
          </tr>
          <tr>
            <td>
              <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a" 
                alt="Car Banner" 
                width="600" 
                style="display:block; width:100%; height:auto;">
            </td>
          </tr>
          <tr>
            <td style="padding:20px; text-align:center;">
              <h2 style="color:#333;">Introducing the All-New Velocity X5</h2>
              <p style="color:#666; font-size:15px; line-height:1.6;">
                Unmatched performance, superior design, and smart AI integration — the new Velocity X5 redefines what a modern car can do.
              </p>
              <a href="#" style="background:#e63946; color:#fff; text-decoration:none; padding:12px 24px; border-radius:30px; display:inline-block; margin-top:10px;">
                Book a Test Drive
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:#f0f0f0; padding:20px; text-align:center;">
              <h3>🔥 Special Offer This Month</h3>
              <p style="color:#555;">Get <strong>0% APR Financing</strong> for 36 months on select models.</p>
              <a href="#" style="color:#e63946; font-weight:bold;">Learn More →</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px;">
              <table width="100%">
                <tr>
                  <td align="center" style="width:33%;">
                    <img src="https://images.unsplash.com/photo-1549924231-f129b911e442" width="180" alt="Car 1" style="border-radius:10px;">
                    <p>Velocity S3 Sedan</p>
                  </td>
                  <td align="center" style="width:33%;">
                    <img src="https://images.unsplash.com/photo-1511914265871-b82bce8d3dbf" width="180" alt="Car 2" style="border-radius:10px;">
                    <p>Velocity X5 SUV</p>
                  </td>
                  <td align="center" style="width:33%;">
                    <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf" width="180" alt="Car 3" style="border-radius:10px;">
                    <p>Velocity Roadster</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#000; color:#fff; text-align:center; padding:15px; font-size:13px;">
              © 2025 Velocity Motors | 123 Auto Drive, Los Angeles, CA
              <br/>
              <a href="#" style="color:#e63946;">Unsubscribe</a>
            </td>
          </tr>
        </table>
      </div>
    `;

    // Load demo template into GrapesJS canvas
    editor.setComponents(demoHtml);

    // 💾 Save button logic
    const saveBtn = document.getElementById("save-template");
    saveBtn.addEventListener("click", async () => {
      const html = editor.getHtml();
      const css = editor.getCss();
      if (!name.trim()) return alert("Enter a template name before saving.");

      await newRequest.post("/templates", {
        name,
        html: `${html}<style>${css}</style>`,
      });

      alert("✅ Template saved successfully!");
    });
  }, [name]);

  return (
    <div className="container py-3">
      <h3 className="mb-3">Create Newsletter Template</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Template name (e.g., Velocity Motors Newsletter)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div ref={editorRef} style={{ border: "1px solid #ddd", borderRadius: "8px" }}></div>
      <button id="save-template" className="btn btn-primary mt-3">
        💾 Save Template
      </button>
    </div>
  );
};

export default TemplateEditor;




// src/pages/newsletter/TemplateEditor.jsx
/*
import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs/dist/grapes.min.js";
import "grapesjs-blocks-basic";
import newRequest from "../../api/newRequest";

const TemplateEditor = () => {
  const editorRef = useRef(null);
  const [name, setName] = useState("");

  useEffect(() => {
    // Initialize GrapesJS editor
    const editor = grapesjs.init({
      container: editorRef.current,
      height: "90vh",
      width: "auto",
      storageManager: { autoload: 0 },
      fromElement: false,
      plugins: ["gjs-blocks-basic"], // text, image, button blocks
      pluginsOpts: {
        "gjs-blocks-basic": { flexGrid: true },
      },
      canvas: {
        styles: [
          "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
        ],
      },
    });

    // Save the editor instance in ref
    editorRef.current.editor = editor;

    // Add example blocks for a car newsletter
    editor.BlockManager.add("newsletter-header", {
      label: "Header",
      category: "Newsletter",
      content: `<section style="background:#002244; color:white; padding:20px; text-align:center;">
        <h2>🚗 AutoDrive Newsletter</h2>
        <p>Latest Car News & Reviews</p>
      </section>`,
    });

    editor.BlockManager.add("newsletter-cta", {
      label: "CTA Button",
      category: "Newsletter",
      content: `<div style="text-align:center; padding:20px;">
        <a href="#" style="background-color:#ff6600; color:white; padding:12px 24px; border-radius:6px; text-decoration:none;">
          Learn More
        </a>
      </div>`,
    });

    // Add default content (optional starting template)
    const defaultHtml = `<div style="font-family:Arial, sans-serif;">
      <h1 style="text-align:center;">🚗 Welcome to AutoDrive Weekly</h1>
      <p style="text-align:center;">Drag blocks to build your newsletter!</p>
    </div>`;
    editor.setComponents(defaultHtml);
  }, []);

  // React-friendly save handler
  const handleSave = async () => {
    const editor = editorRef.current.editor;
    if (!editor) return;

    const html = editor.getHtml();
    const css = editor.getCss();

    if (!name.trim()) return alert("Enter a template name");

    try {
      const res = await newRequest.post("/templates", {
        name,
        html: `${html}<style>${css}</style>`,
      });
      alert("✅ Template saved successfully!");
      console.log("Saved template:", res.data);
    } catch (err) {
      console.error("❌ Save error:", err);
      alert(`Save failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="container-fluid py-3">
      <h3 className="mb-3">📰 Create Newsletter Template</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Template name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div
        ref={editorRef}
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          minHeight: "500px",
        }}
      ></div>
      <button className="btn btn-primary mt-3" onClick={handleSave}>
        💾 Save Template
      </button>
    </div>
  );
};

export default TemplateEditor;
*/

