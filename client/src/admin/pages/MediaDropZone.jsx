// 🧩 src/components/MediaDropZone.jsx
import React, { useState, useRef } from "react";
import { Upload, X, Link as LinkIcon, Image, Music, Video } from "lucide-react";
import "./MediaDropZone.css";

const MediaDropZone = ({ multiple = true, onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [mediaType, setMediaType] = useState("image");
  const [inputLink, setInputLink] = useState("");
  const inputRef = useRef(null);

  // ✅ Handle file input
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const newFiles = multiple ? [...files, ...selected] : selected.slice(0, 1);
    setFiles(newFiles);
    onFilesChange?.(newFiles, externalLinks);
  };

  // ✅ Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = multiple ? [...files, ...droppedFiles] : droppedFiles.slice(0, 1);
    setFiles(newFiles);
    onFilesChange?.(newFiles, externalLinks);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ✅ Remove single file
  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles, externalLinks);
  };

  // ✅ Clear all
  const clearAll = () => {
    setFiles([]);
    setExternalLinks([]);
    setInputLink("");
    onFilesChange?.([], []);
  };

  // ✅ Handle external link addition
  const addExternalLink = () => {
    if (!inputLink.trim()) return;
    const newLinks = multiple ? [...externalLinks, inputLink.trim()] : [inputLink.trim()];
    setExternalLinks(newLinks);
    setInputLink("");
    onFilesChange?.(files, newLinks);
  };

  // ✅ Remove single link
  const removeExternalLink = (index) => {
    const newLinks = externalLinks.filter((_, i) => i !== index);
    setExternalLinks(newLinks);
    onFilesChange?.(files, newLinks);
  };

  // ✅ Render preview depending on media type
  const renderPreview = (fileOrUrl) => {
    const isURL = typeof fileOrUrl === "string";
    const src = isURL ? fileOrUrl : URL.createObjectURL(fileOrUrl);

    switch (mediaType) {
      case "audio":
        return <audio controls src={src} />;
      case "video":
        return <video controls src={src} />;
      default:
        return <img src={src} alt="preview" />;
    }
  };

  return (
    <div className="media-dropzone">
      <div className="media-type-selector">
        <button
          className={mediaType === "image" ? "active" : ""}
          onClick={() => setMediaType("image")}
        >
          <Image size={18} /> Images
        </button>
        <button
          className={mediaType === "audio" ? "active" : ""}
          onClick={() => setMediaType("audio")}
        >
          <Music size={18} /> Audio
        </button>
        <button
          className={mediaType === "video" ? "active" : ""}
          onClick={() => setMediaType("video")}
        >
          <Video size={18} /> Video
        </button>
      </div>

      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={36} />
        <p>Drag & drop your {mediaType}s here or click to browse</p>
        <input
          type="file"
          accept={
            mediaType === "image"
              ? "image/*"
              : mediaType === "audio"
              ? "audio/*"
              : "video/*"
          }
          multiple={multiple}
          ref={inputRef}
          onChange={handleFileChange}
          hidden
        />
      </div>

      <div className="link-input">
        <input
          type="url"
          placeholder={`Paste ${mediaType} URL...`}
          value={inputLink}
          onChange={(e) => setInputLink(e.target.value)}
        />
        <button onClick={addExternalLink}>
          <LinkIcon size={18} /> Add Link
        </button>
      </div>

      {(files.length > 0 || externalLinks.length > 0) && (
        <div className="preview-section">
          <div className="preview-header">
            <h4>Preview</h4>
            <button className="clear-btn" onClick={clearAll}>
              <X size={16} /> Clear All
            </button>
          </div>

          <div className="preview-grid">
            {files.map((file, i) => (
              <div className="preview-item" key={i}>
                {renderPreview(file)}
                <button className="remove-btn" onClick={() => removeFile(i)}>
                  <X size={14} />
                </button>
              </div>
            ))}
            {externalLinks.map((link, i) => (
              <div className="preview-item" key={i}>
                {renderPreview(link)}
                <button className="remove-btn" onClick={() => removeExternalLink(i)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDropZone;
