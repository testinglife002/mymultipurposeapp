// 1️⃣ Content.jsx – EditorJS Renderer
// src/pages/PostContent.jsx
// src/pages/PostContent.jsx
import React, { useState } from "react";

function PostContent({ block }) {
  const [expanded, setExpanded] = useState(false);

  if (!block || !block.type || !block.data) return null;

  let content = "";
  let text = "";
  let align = "left";
  let listItems = "";
  let caption = "";

  switch (block.type) {
    case "paragraph":
      text = block.data.text || "";
      align = block.tunes?.textAlignment?.alignment || "left";
      content = `<p style='text-align:${align}'>${text}</p>`;
      break;

    case "header":
      const level = block.data.level || 2;
      text = block.data.text || "";
      align = block.tunes?.textAlignment?.alignment || "left";
      content = `<h${level} style='text-align:${align}'>${text}</h${level}>`;
      break;

    case "alert":
      text = block.data.message || "";
      align = block.data.align || "left";
      const type = block.data.type || "info";
      content = `<div class='alert alert-${type}' style='text-align:${align}'>${text}</div>`;
      break;

    case "list": {
      const items = Array.isArray(block.data.items) ? block.data.items : [];
      listItems = items.map(item => `<li class='list-group-item'>${item}</li>`).join("");
      content = block.data.style === "unordered"
        ? `<ul class='list-group mb-3'>${listItems}</ul>`
        : `<ol class='list-group list-group-numbered mb-3'>${listItems}</ol>`;
      break;
    }

    case "checklist": {
      const items = Array.isArray(block.data.items) ? block.data.items : [];
      listItems = items.map(item => `
        <li class='list-group-item'>
          <input class='form-check-input me-2' type='checkbox' ${item.checked ? "checked" : ""} disabled />
          <label class='form-check-label'>${item.text || ""}</label>
        </li>`).join("");
      content = `<ul class='list-group mb-3'>${listItems}</ul>`;
      break;
    }

    case "image": {
      const url = block.data.url || block.data.file?.url || "";
      caption = block.data.caption || "";
      if (!url) return null;
      return (
        <div key={block.id} className="editor-image-block mb-3 text-center">
          <img
            src={url}
            alt={caption || "image"}
            style={{ maxWidth: "100%", borderRadius: "10px", cursor: "pointer" }}
            onClick={() => window.open(url, "_blank")}
          />
          {caption && <p className="text-muted">{caption}</p>}
        </div>
      );
    }

    case "embed": {
      const embedUrl = block.data.embed || "";
      caption = block.data.caption || "";
      if (!embedUrl) return null;

      return (
        <div
          key={block.id}
          className="editor-embed-block mb-3 d-flex justify-content-center flex-column align-items-center"
        >
          <div
            className="embed-preview"
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            style={{ cursor: "pointer", width: "100%", maxWidth: "560px" }}
          >
            {expanded ? (
              <iframe
                src={embedUrl}
                width="560"
                height="315"
                allowFullScreen
                style={{ border: "none", borderRadius: "10px" }}
                title={caption || "embed"}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                }}
              >
                Hover to preview embed
              </div>
            )}
          </div>
          {caption && <small className="fst-italic mt-1">{caption}</small>}
        </div>
      );
    }

    case "video": {
      const videoUrl = block.data.file?.url || block.data.url || "";
      caption = block.data.caption || "";
      if (!videoUrl) return null;

      return (
        <div
          key={block.id}
          className="editor-video-block mb-3 text-center"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          {expanded ? (
            <video
              src={videoUrl}
              controls
              style={{ maxWidth: "100%", borderRadius: "10px" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: "560px",
                height: "140px",
                border: "2px dashed #ccc",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontStyle: "italic",
                cursor: "pointer",
              }}
            >
              Hover to play video
            </div>
          )}
          {caption && <p className="text-muted mt-1">{caption}</p>}
        </div>
      );
    }

    default:
      content = `<p>${block.type} block not supported</p>`;
  }

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

export default PostContent;

