// src/components/ContentPost.jsx
import React from "react";

function ContentPost({ block }) {
  if (!block || !block.type) return null;

  let content = "";

  switch (block.type) {
    case "paragraph":
      const text = block.data?.text || block.text || "No text available.";
      content = `<p>${text}</p>`;
      break;

    case "header":
      const level = block.data?.level || 2;
      const headerText = block.data?.text || "Header";
      content = `<h${level}>${headerText}</h${level}>`;
      break;

    case "list":
      const style = block.data?.style || "unordered";
      const items = block.data?.items || [];
      if (items.length) {
        const listItems = items.map(i => `<li>${i}</li>`).join("");
        content = style === "unordered" ? `<ul>${listItems}</ul>` : `<ol>${listItems}</ol>`;
      } else content = "<p>Empty list</p>";
      break;

    case "checklist":
      const checklistItems = block.data?.items || [];
      if (checklistItems.length) {
        const listItems = checklistItems.map(
          i => `<li><input type="checkbox" ${i.checked ? "checked" : ""}/> ${i.text}</li>`
        ).join("");
        content = `<ul>${listItems}</ul>`;
      } else content = "<p>Empty checklist</p>";
      break;

    case "image":
      const url = block.data?.url || block.data?.file?.url;
      const caption = block.data?.caption || "";
      if (!url) return <p>Image block has no URL</p>;
      return (
        <div className="editor-image-block">
          <img src={url} alt={caption || "Image"} style={{ maxWidth: "100%", borderRadius: "10px" }} />
          {caption && <p className="text-muted">{caption}</p>}
        </div>
      );

    case "embed":
      const embed = block.data?.embed || "";
      const embedCaption = block.data?.caption || "";
      content = `
        <div class="embed-wrapper">
          <iframe src="${embed}" width="100%" height="350px" allowFullScreen></iframe>
          ${embedCaption ? `<small>${embedCaption}</small>` : ""}
        </div>
      `;
      break;

    case "code":
      const code = block.data?.code || "No code";
      content = `<pre><code>${code}</code></pre>`;
      break;

    default:
      content = `<p>Unsupported block type: ${block.type}</p>`;
      break;
  }

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

export default ContentPost;

