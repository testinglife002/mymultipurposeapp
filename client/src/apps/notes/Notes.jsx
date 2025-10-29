// apps/notes/Notes.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { Grid, TextField, Button, MenuItem, FormControlLabel, Switch } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import newRequest from "../../api/newRequest";
import "./components/Notes.css";
import "./notes.css";
import EditorModal from "./components/EditorModal";
import ShareModal from "./components/ShareModal";
import Cards from "./components/Cards";
import { EditorContext } from "./components/EditorContext";

export default function Notes({ user }) {

  const [notesArr, setNotesArr] = useState([]);
  const [filter, setFilter] = useState({ text: "", project: "", type: "all" });
  const [projects, setProjects] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareNoteId, setShareNoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedNoteId, setCopiedNoteId] = useState(null);
  const [modalData, setModalData] = useState({ title: "", projectId: "", isPublic: false, blocks: [] });
  const [clampPreview, setClampPreview] = useState(true);
  const updatedId = useRef(null);
  const { editorInstanceRef } = useContext(EditorContext);

  // Fetch projects
  useEffect(() => {
      const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects");
        setProjects(res.data.projects);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  // Fetch all notes
  const fetchAllNotes = async () => {
    if (!user) return;
    try {
      const res = await newRequest.get("/notes");
      setNotesArr(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, [user]);

  // Filtered notes
  const filtered = notesArr.filter((note) => {
    const noteOwnerId = note.createdBy?._id?.toString();
    const currentUserId = user._id?.toString();
    const projectId = note.project?._id?.toString();
    const sharedWithIds = (note.sharedWith || []).map(String);

    const matchText = !filter.text || note.title?.toLowerCase().includes(filter.text.toLowerCase());
    const matchProject = !filter.project || projectId === filter.project;

    let matchType = true;
    switch (filter.type) {
      case "own":
        matchType = noteOwnerId === currentUserId && !note.isCopy;
        break;
      case "copies":
        matchType = noteOwnerId === currentUserId && note.isCopy;
        break;
      case "public":
        matchType = !!note.isPublic;
        break;
      case "sharedwithme":
        matchType = sharedWithIds.includes(currentUserId);
        break;
      case "all":
      default:
        matchType = true;
    }

    return matchText && matchProject && matchType;
  });

  // Note actions
  const handleSave = async (title, projectId, isPublic, tags) => {
    if (!editorInstanceRef.current) return console.error("Editor not ready");
    try {
      const output = await editorInstanceRef.current.save();
      const payload = { title, projectId, isPublic, tags, blocks: output.blocks };
      if (updatedId.current) {
        await newRequest.put(`/notes/${updatedId.current}`, payload);
      } else {
        await newRequest.post("/notes", payload);
      }
      fetchAllNotes();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    updatedId.current = null;
    setModalData({ title: "", projectId: "", isPublic: false, tags: [], blocks: [] });
    setShowModal(true);
  };

  const handleEdit = (id) => {
    updatedId.current = id;
    const note = notesArr.find((n) => n._id === id);
    if (note) {
      setModalData({
        title: note.title,
        projectId: note.project?._id || "",
        isPublic: note.isPublic,
        tags: note.tags || [],
        blocks: note.blocks || [],
      });
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await newRequest.delete(`/notes/${id}`);
      fetchAllNotes();
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
          ? { ...note, sharedWith: [...new Set([...(note.sharedWith || []), ...targetUserIds])] }
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
      fetchAllNotes();
    } catch (err) {
      console.error("Failed to copy note", err);
    }
  };
  return 
    <div className="app-notes">
      {/* Editor Modal */}
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

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          show={showShareModal}
          noteId={shareNoteId}
          onClose={() => setShowShareModal(false)}
          onShareSuccess={handleConfirmShare}
        />
      )}

      {/* Filters */}
      <div className="filters-container">
        <Button variant="outlined" onClick={handleAdd} startIcon={<FiPlus />}>
          New Note
        </Button>

        <TextField
          size="small"
          label="Search Titles"
          value={filter.text}
          onChange={(e) => setFilter((f) => ({ ...f, text: e.target.value }))}
        />

        <TextField
          select
          size="small"
          label="Project"
          value={filter.project}
          onChange={(e) => setFilter((f) => ({ ...f, project: e.target.value }))}
        >
          <MenuItem value="">All Projects</MenuItem>
          {projects.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={clampPreview}
              onChange={(e) => setClampPreview(e.target.checked)}
            />
          }
          label="Clamp Preview"
        />
      </div>

      {/* Notes Grid */}
      <Grid container spacing={2}>
        {filtered.map((note) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={note._id}>
            <Cards
              idx={note._id}
              title={note.title}
              blocks={note.blocks}
              projectId={note.project}
              projectName={note.project?.name}
              createdBy={note.createdBy}
              sharedWith={note.sharedWith || []}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShareClick}
              onCopyToDashboard={handleCopyToDashboard}
              isPublic={note.isPublic}
              isCopy={note.isCopy}
              sharedOriginal={note.sharedOriginal}
              copiedNoteId={copiedNoteId}
              clamp={clampPreview}
            />
          </Grid>
        ))}
      </Grid>
    </div>;
}

