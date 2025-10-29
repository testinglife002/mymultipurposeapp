// client/src/apps/trello/components/BoardListUI.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import newRequest from "../../../api/newRequest";
import "./BoardListUI.css";

function BoardListUI({ boards, onDeleteBoard }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBoard, setEditBoard] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBackground, setEditBackground] = useState("#0079BF");
  const [filePreview, setFilePreview] = useState(null);

  const handleEditClick = (board) => {
    setEditBoard(board);
    setEditName(board.name);
    setEditDescription(board.description || "");
    setEditBackground(board.background || "#0079BF");
    setFilePreview(null);
    setShowEditModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFilePreview(URL.createObjectURL(file));
  };

  const handleColorPick = (e) => {
    setEditBackground(e.target.value);
    setFilePreview(null);
  };

  const handleTextBackgroundChange = (e) => {
    setEditBackground(e.target.value);
    setFilePreview(null);
  };

  const handleSaveEdit = async () => {
    if (!editBoard) return;
    try {
      const finalBackground = filePreview || editBackground;
      await newRequest.put(`/boards/${editBoard._id}`, {
        name: editName,
        description: editDescription,
        background: finalBackground,
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to update board:", err);
    } finally {
      setShowEditModal(false);
    }
  };

  const previewStyle = {
    height: "100px",
    backgroundColor:
      editBackground?.startsWith("#") && !filePreview ? editBackground : undefined,
    backgroundImage: filePreview
      ? `url(${filePreview})`
      : editBackground?.startsWith("http")
      ? `url(${editBackground})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "6px",
    marginTop: "10px",
  };

  return (
    <div className="board-list">
      {boards.map((board) => (
        <div key={board._id} className="board-card">
          <div
            className="board-card-header"
            style={{
              backgroundColor: board.background?.startsWith("#")
                ? board.background
                : undefined,
              backgroundImage: board.background?.startsWith("http")
                ? `url(${board.background})`
                : undefined,
            }}
          >
            {!board.background && <span>No Background</span>}
          </div>

          <div className="board-card-body">
            <Link to={`/apps/board/${board._id}`} className="board-title">
              {board.name}
            </Link>

            <p className="board-description">
              {board.description || "No description provided."}
            </p>
            <div className="board-members">👥 {board.members?.length || 0} Members</div>

            <div className="board-actions">
              <button className="btn-outline-primary" onClick={() => handleEditClick(board)}>
                <Pencil size={16} /> Edit
              </button>
              <button
                className="btn-outline-danger"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this board?")) {
                    onDeleteBoard(board._id);
                  }
                }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Board</h3>
            <label>Name</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />

            <label>Description</label>
            <textarea
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <label>Background (Hex, URL, or File)</label>
            <input type="text" value={editBackground} onChange={handleTextBackgroundChange} />
            <div className="modal-controls">
              <input
                type="color"
                value={editBackground?.startsWith("#") ? editBackground : "#0079BF"}
                onChange={handleColorPick}
              />
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div style={previewStyle} className="background-preview">
              {!editBackground?.startsWith("#") &&
                !editBackground?.startsWith("http") &&
                !filePreview &&
                "Background Preview"}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardListUI;
