// src/components/PostBlocks.jsx
import React from "react";
import ContentPost from "./ContentPost";

const PostBlocks = ({ blocks = [], fallbackContent = "" }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return fallbackContent ? (
      <div dangerouslySetInnerHTML={{ __html: fallbackContent }} />
    ) : (
      <p className="no-content">No content available.</p>
    );
  }

  const validBlocks = blocks.filter(block => {
    if (!block || !block.type) return false;
    if (block.type === "paragraph" && !block.data?.text?.trim() && !block.text?.trim()) return false;
    if (block.type === "header" && !block.data?.text?.trim()) return false;
    if ((block.type === "list" || block.type === "checklist") && (!block.data?.items || block.data.items.length === 0)) return false;
    if (block.type === "image" && !block.data?.url && !block.data?.file?.url) return false;
    if (block.type === "embed" && !block.data?.embed) return false;
    if (block.type === "code" && !block.data?.code) return false;
    return true;
  });

  if (validBlocks.length === 0) {
    return fallbackContent ? (
      <div dangerouslySetInnerHTML={{ __html: fallbackContent }} />
    ) : (
      <p className="no-content">This post currently has no meaningful content.</p>
    );
  }

  return (
    <div className="post-blocks">
      {validBlocks.map((block, i) => (
        <ContentPost key={i} block={block} />
      ))}
    </div>
  );
};

export default PostBlocks;


