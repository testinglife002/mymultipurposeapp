// src/appcomponents/Notes.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import EditorModal from "./EditorModal";
import Card from "./Card";
import ShareModal from "./ShareModal";
import { EditorContext } from "./EditorContext";
import newRequest from "../../../api/newRequest";
import "./Notes.css";

const Notes = ({ user }) => {
  const [notesArr, setNotesArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [filter, setFilter] = useState({ text: "", project: "", type: "all" });
  const [projects, setProjects] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareNoteId, setShareNoteId] = useState(null);
  const [copiedNoteId, setCopiedNoteId] = useState(null);
  const [modalData, setModalData] = useState({
    title: "",
    projectId: "",
    isPublic: false,
    tags: [],
    blocks: [],
    sharedWith: [],
  });
  const updatedId = useRef(null);
  const { editorInstanceRef } = useContext(EditorContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const fetchNotes = async (filterType = "all", projectId = "") => {
    if (!user) return;
    setLoading(true);
    try {
      let url = "/notes/all";
      if (filterType === "my") url = "/notes/my";
      else if (filterType === "public") url = "/notes/public";
      else if (filterType === "copies") url = "/notes/copies";
      else if (filterType === "sharedwithme") url = "/notes/shared";
      else if (filterType === "project" && projectId)
        url = `/notes/project/${projectId}`;

      const res = await newRequest.get(url);
      setNotesArr(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotes();
    }
  }, [user]);

  const filteredNotes = notesArr.filter((note) => {
    const currentUserId = user._id?.toString();
    const noteOwnerId = note.createdBy?._id?.toString();
    const projectId = note.project?._id?.toString();
    const sharedWithIds = (note.sharedWith || []).map(String);

    const matchesText =
      !filter.text ||
      note.title?.toLowerCase().includes(filter.text.toLowerCase());
    const matchesProject = !filter.project || projectId === filter.project;

    let matchesType = true;
    switch (filter.type) {
      case "own":
        matchesType = noteOwnerId === currentUserId && !note.isCopy;
        break;
      case "copies":
        matchesType = noteOwnerId === currentUserId && note.isCopy;
        break;
      case "public":
        matchesType = note.isPublic;
        break;
      case "sharedwithme":
        matchesType = sharedWithIds.includes(currentUserId);
        break;
      default:
        matchesType = true;
    }

    return matchesText && matchesProject && matchesType;
  });

  const handleAdd = () => {
    updatedId.current = null;
    setModalData({
      title: "",
      projectId: "",
      isPublic: false,
      tags: [],
      blocks: [],
      sharedWith: [],
    });
    setShowEditorModal(true);
  };

  const handleEdit = (id) => {
    updatedId.current = id;
    const note = notesArr.find((n) => n._id === id);
    if (!note) return;
    setModalData({
      title: note.title,
      projectId: note.project?._id || "",
      isPublic: note.isPublic,
      blocks: note.blocks || [],
      initialSharedWith: (note.sharedWith || []).map((u) => ({
        value: u._id,
        label: u.username || u._id,
      })),
    });
    setShowEditorModal(true);
  };

  const handleSave = async (title, projectId, isPublic, tags, blocks, sharedWith) => {
    if (!editorInstanceRef.current) return;
    try {
      const output = await editorInstanceRef.current.save();
      const payload = { title, projectId, isPublic, blocks: output.blocks, tags, sharedWith };
      if (updatedId.current) {
        await newRequest.put(`/notes/${updatedId.current}`, payload);
      } else {
        await newRequest.post("/notes", payload);
      }
      fetchNotes();
      setShowEditorModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await newRequest.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareClick = (id) => {
    setShareNoteId(id);
    setShowShareModal(true);
  };

  const handleConfirmShare = (targetUserIds) => {
    setNotesArr((prevNotes) =>
      prevNotes.map((note) =>
        note._id === shareNoteId
          ? {
              ...note,
              sharedWith: [
                ...new Set([...(note.sharedWith || []), ...targetUserIds]),
              ],
            }
          : note
      )
    );
    setShowShareModal(false);
    setShareNoteId(null);
  };

  const handleCopyToDashboard = async (noteId) => {
    try {
      const res = await newRequest.post(`/notes/${noteId}/copy`);
      const newNote = res.data;
      setCopiedNoteId(newNote._id);
      setTimeout(() => setCopiedNoteId(null), 3000);
      fetchNotes();
    } catch (err) {
      console.error("Failed to copy note:", err);
    }
  };

  if (!user) {
    return (
      <div className="notes-empty">
        <p>Please log in to view your notes.</p>
      </div>
    );
  }

  return (
    <div className="notes-container">
      {/* Modals */}
      <EditorModal
        show={showEditorModal}
        handleClose={() => setShowEditorModal(false)}
        onSave={handleSave}
        initialTitle={modalData.title}
        initialProject={modalData.projectId}
        initialIsPublic={modalData.isPublic}
        initialTags={modalData.tags}
        initialBlocks={modalData.blocks}
        initialSharedWith={modalData.sharedWith}
      />

      {showShareModal && (
        <ShareModal
          show={showShareModal}
          noteId={shareNoteId}
          onClose={() => setShowShareModal(false)}
          onShareSuccess={handleConfirmShare}
        />
      )}

      {/* Header */}
      <div className="notes-header">
        <h2>Notes</h2>
        <button className="btn-primary" onClick={handleAdd}>
          <FiPlus size={18} /> New Note
        </button>
      </div>

      {/* Filters */}
      <div className="notes-filters">
        <input
          type="text"
          placeholder="Search..."
          value={filter.text}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, text: e.target.value }))
          }
        />
        <select
          value={filter.project}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, project: e.target.value }))
          }
        >
          <option value="">All Projects</option>
          {projects.map((proj) => (
            <option key={proj._id} value={proj._id}>
              {proj.name}
            </option>
          ))}
        </select>
        <select
          value={filter.type}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, type: e.target.value }))
          }
        >
          <option value="all">All</option>
          <option value="own">My Notes</option>
          <option value="copies">Copied</option>
          <option value="public">Public</option>
          <option value="sharedwithme">Shared With Me</option>
        </select>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="loading">
          <Loader2 className="spin" size={32} />
        </div>
      ) : filteredNotes.length === 0 ? (
        <p className="no-notes">No notes found.</p>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <Card
              key={note._id}
              idx={note._id}
              title={note.title}
              blocks={note.blocks}
              projectId={note.project?._id}
              projectName={note.project?.name}
              isPublic={note.isPublic}
              createdBy={note.createdBy}
              canEdit={note.canEdit}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShareClick}
              onCopyToDashboard={handleCopyToDashboard}
              isCopy={note.isCopy}
              sharedOriginal={note.sharedOriginal}
              sharedWith={note.sharedWith}
              copiedNoteId={copiedNoteId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;

