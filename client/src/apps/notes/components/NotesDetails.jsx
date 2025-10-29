// src/appcomponents/NotesDetails.jsx
// src/appcomponents/NotesDetails.jsx
import { useEffect, useState, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CircularProgress, Button, Alert } from "@mui/material";
import { Pencil, Trash } from "lucide-react";
import newRequest from "../../../api/newRequest";
import Content from "./Content";
import EditorContextProvider, { EditorContext } from "./EditorContext";
import "./NotesDetails.css";
import EditorModal from "./EditorModal";



function NoteDetailsWrapper({ user }) {
  return (
    <EditorContextProvider>
      <NotesDetails user={user} />
    </EditorContextProvider>
  );
}

function NotesDetails({ user }) {
  const { id } = useParams();
  const context = useContext(EditorContext);
  const editorInstanceRef = context?.editorInstanceRef ?? { current: null };

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const updatedId = useRef(null);
  const [modalData, setModalData] = useState({
    title: "",
    projectId: "",
    isPublic: false,
    tags: [],
    blocks: [],
  });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await newRequest.get(`/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleEdit = () => {
    updatedId.current = note._id;
    setModalData({
      title: note.title,
      projectId: note.project?._id || "",
      isPublic: note.isPublic,
      tags: note.tags || [],
      blocks: note.blocks || [],
    });
    setShowModal(true);
  };

  const handleSave = async (title, projectId, isPublic, tags) => {
    if (!editorInstanceRef.current) return console.error("Editor not ready");
    try {
      const output = await editorInstanceRef.current.save();
      const payload = {
        title,
        projectId,
        isPublic,
        tags,
        blocks: output.blocks,
      };
      await newRequest.put(`/notes/${updatedId.current}`, payload);
      const res = await newRequest.get(`/notes/${updatedId.current}`);
      setNote(res.data);
      setShowModal(false);
      alert("Note updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update note");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await newRequest.delete(`/notes/${note._id}`);
      alert("Note deleted successfully!");
      window.location.href = "/notes";
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );

  if (!note) return <Alert severity="error">Note not found</Alert>;

  return (
    <div className="note-container">
      <div className="note-back-btn">
        <Link to="/apps/notesapp" className="btn-link">
          ← Back to Notes
        </Link>
      </div>

      <h2 className="note-title">{note.title}</h2>
      <div className="note-meta">
        Project: {note.project?.name || "No Project"} |{" "}
        {note.isPublic ? "Public" : "Private"}
      </div>

      <p className="note-author">
        <small>By: {note.createdBy?.username || "Unknown"}</small>
      </p>

      {note.canEdit && (
        <div className="note-actions">
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleEdit}
            startIcon={<Pencil size={16} />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDelete}
            startIcon={<Trash size={16} />}
          >
            Delete
          </Button>
        </div>
      )}

      {note.isCopy && note.sharedOriginal && (
        <Alert severity="info" className="note-alert">
          This note is a copy.{" "}
          <Link to={`/notes/${note.sharedOriginal._id}`}>
            View Original: {note.sharedOriginal.title}
          </Link>
        </Alert>
      )}

      {/* Scrollable note content */}
      <div className="note-content">
        {note.blocks?.length > 0 ? (
          note.blocks.map((block, i) => (
            <Content key={block.id || i} block={block} />
          ))
        ) : (
          <p className="note-empty">No content available</p>
        )}
      </div>

      {/* EditorModal for edit */}
      <EditorModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={handleSave}
        initialTitle={modalData.title}
        initialProject={modalData.projectId}
        initialIsPublic={modalData.isPublic}
        initialTags={modalData.tags}
        initialBlocks={modalData.blocks}
      />
    </div>
  );
}

export default NoteDetailsWrapper;

