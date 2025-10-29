// ✅ CreateBoardModalUI.jsx
// CreateBoardModalUI.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import newRequest from "../../../api/newRequest";
import "./CreateBoardModalUI.css";

function CreateBoardModalUI({ isOpen, onClose, onBoardCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [background, setBackground] = useState("#0079bf");
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setBackground("#0079bf");
      setFilePreview(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalBackground = filePreview || background;
      const res = await newRequest.post("/boards", {
        name,
        description,
        background: finalBackground,
      });
      onBoardCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to create board:", err);
    }
  };

  const previewStyle = {
    backgroundColor: background?.startsWith("#") && !filePreview ? background : undefined,
    backgroundImage: filePreview
      ? `url(${filePreview})`
      : background?.startsWith("http")
      ? `url(${background})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content create-board-modal">
        <div className="modal-header">
          <h3>Create Board</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="dark-input"
            placeholder="Enter board name"
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="dark-input"
            placeholder="Optional description"
          />

          <label>Background Color / Image</label>
          <div className="modal-controls">
            <input
              type="color"
              value={background?.startsWith("#") ? background : "#0079bf"}
              onChange={(e) => setBackground(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="background-preview" style={previewStyle}>
            {!filePreview && !background.startsWith("http") && "Preview"}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBoardModalUI;


