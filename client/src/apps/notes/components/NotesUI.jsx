// src/appcomponents/NotesUI.jsx
import { useEffect, useState, useRef, useContext } from "react";
import {
  FiGrid,
  FiList,
  FiTable,
  FiSquare,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiClipboard,
} from "react-icons/fi";
import { Snackbar, Alert, Button, IconButton, Box, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import newRequest from "../../../api/newRequest";
import "./NotesUI.css";
import { Link } from "react-router-dom";
import EditorModal from "./EditorModal";
import ShareModal from "./ShareModal";
import { EditorContext } from "./EditorContext";
import { FaPlus } from "react-icons/fa";
import { blueGrey } from "@mui/material/colors";

const NotesUI = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareNoteId, setShareNoteId] = useState(null);
  const [copiedNoteId, setCopiedNoteId] = useState(null);
  const [showToast, setShowToast] = useState(false);
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

  // fetch projects
  const fetchProjects = async () => {
    try {
      const res = await newRequest.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(projects)

  // fetch notes
  const fetchNotes = async (type, projectId = "") => {
    try {
      let url = "/notes/all";
      if (type === "my") url = "/notes/my";
      if (type === "public") url = "/notes/public";
      if (type === "copies") url = "/notes/copies";
      if (type === "shared") url = "/notes/shared";
      if (type === "project" && projectId) url = `/notes/project/${projectId}`;

      const res = await newRequest.get(url);
      const cleanData = (res.data || []).filter((n) => n && n._id);
      setNotes(cleanData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (filter === "project" && selectedProject) {
      fetchNotes("project", selectedProject);
    } else {
      fetchNotes(filter);
    }
  }, [filter, selectedProject]);

  // Handlers
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
    setShowModal(true);
  };

  const handleEdit = async (id) => {
    updatedId.current = id;
    const note = notes.find((n) => n._id === id);
    if (!note) return;

    try {
      // Fetch user info for sharedWith IDs (if any)
      let sharedUserDetails = [];
      if (note.sharedWith && note.sharedWith.length > 0) {
        const res = await newRequest.post("/notes/users-by-ids", {
          ids: note.sharedWith,
        });

        sharedUserDetails = res.data.map((u) => ({
          value: u._id,
          label: `${u.username} (${u.email})`,
        }));
      }

      setModalData({
        title: note.title,
        projectId: note.project?._id || "",
        isPublic: note.isPublic,
        tags: note.tags || [],
        blocks: note.blocks || [],
        initialSharedWith: sharedUserDetails || [],
      });

      setShowModal(true);
    } catch (err) {
      console.error("Failed to load shared users:", err);
    }
  };



  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await newRequest.delete(`/notes/${noteId}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (noteId) => {
    setShareNoteId(noteId);
    setShowShareModal(true);
  };

  const handleConfirmShare = (targetUserIds) => {
    console.log("🧩 handleConfirmShare got:", targetUserIds);

    const ids = Array.isArray(targetUserIds)
      ? targetUserIds
      : targetUserIds
      ? [targetUserIds]
      : [];

    setNotes((prev) =>
      prev.map((n) =>
        n._id === shareNoteId
          ? {
              ...n,
              sharedWith: [...new Set([...(n.sharedWith || []), ...ids])],
            }
          : n
      )
    );
    setShowShareModal(false);
    setShareNoteId(null);
  };




  const handleCopy = async (noteId) => {
    try {
      await newRequest.post(`/notes/${noteId}/copy`);
      setCopiedNoteId(noteId);
      setShowToast(true);
      fetchNotes();

      setTimeout(() => {
        setCopiedNoteId(null);
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // inside NotesUI.jsx
  // inside NotesUI.jsx
  const handleSave = async (title, project, isPublic, tags, blocks, sharedWith) => {
    try {
      const savedBlocks = blocks.length ? blocks : [{ type: "paragraph", data: { text: "" } }]; 
      const projectId = typeof project === "string" ? project : project?.value || null;
      const sharedUserIds = sharedWith.map(u => u?.value || u);

      const payload = { title: title.trim(), projectId, isPublic, tags, blocks: savedBlocks, sharedWith: sharedUserIds };

      console.group("📝 handleSave Debug Info");
      console.log("Updating note ID:", updatedId.current || "New Note");
      console.log("Payload being sent:", payload);
      console.log("SharedWith IDs:", sharedUserIds);
      console.groupEnd();

      let res;
      if (updatedId.current) {
        res = await newRequest.put(`/notes/${updatedId.current}`, payload);
        console.log("Update response:", res.data);
      } else {
        res = await newRequest.post("/notes", payload);
        console.log("Create response:", res.data);
      }

      await fetchNotes(filter === "project" && selectedProject ? "project" : filter, selectedProject);
      console.log("Notes refreshed after save.");

      setShowModal(false);
      updatedId.current = null;
    } catch (err) {
      console.error("Error in handleSave:", err);
    }
  };



  return (
    <div className="notes-ui">
      <EditorModal
        open={showModal}   // ✅ corrected
        handleClose={() => setShowModal(false)}
        onSave={handleSave}
        initialTitle={modalData.title}
        initialProject={modalData.projectId}
        initialIsPublic={modalData.isPublic}
        initialTags={modalData.tags}
        initialBlocks={modalData.blocks}
        initialSharedWith={modalData.initialSharedWith}
      />
    

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          open={showShareModal}                // ✅ fixed
          noteId={shareNoteId}
          onClose={() => setShowShareModal(false)}
          onShared={handleConfirmShare}        // ✅ matches ShareModal.jsx
        />
      )}


      {/* Toolbar */}
      <div className="toolbar">
        <div className="filters">
          <Button onClick={() => setFilter("all")}>All</Button>
          <Button onClick={() => setFilter("my")}>My Notes</Button>
          <Button onClick={() => setFilter("public")}>Public</Button>
          <Button onClick={() => setFilter("copies")}>Copies</Button>
          <Button onClick={() => setFilter("shared")}>Shared with Me</Button>

          {/* Project Dropdown */}
          <div
            className={`project-dropdown ${
              filter === "project" ? "active" : ""
            }`}
          >
            <Button className="dropdown-toggle">
              {selectedProject
                ? projects.find((p) => p._id === selectedProject)?.name
                : "Filter by Project"}
            </Button>
            <div className="dropdown-menu">
              {projects.map((p) => (
                <div
                  key={p._id}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedProject(p._id);
                    setFilter("project");
                  }}
                >
                  {p.name}
                </div>
              ))}
              <div
                className="dropdown-item clear"
                onClick={() => {
                  setSelectedProject("");
                  setFilter("all");
                }}
              >
                Clear Filter
              </div>
            </div>
          </div>
        </div>

        <div className="view-toggle">
          <IconButton onClick={() => setView("grid")}  >
            <FiGrid style={{color: 'blue'}} />
          </IconButton>
          <IconButton onClick={() => setView("list")}>
            <FiList style={{color: 'blue'}} />
          </IconButton>
          <IconButton onClick={() => setView("card")}>
            <FiSquare style={{color: 'blue'}} />
          </IconButton>
          <IconButton onClick={() => setView("table")}>
            <FiTable style={{color: 'blue'}} />
          </IconButton>
        </div>
      </div>

      {/* Render Notes */}
      <div className={`notes-container ${view}`} style={{ marginTop: "5%" }}>
        {notes
          .filter((n) => n && n._id)
          .map((note) => {
            const canEdit =
              user?._id &&
              note?.createdBy?._id &&
              user._id === note.createdBy._id;
            return (
              <div key={note._id} className="note-item">
                <h4>{note.title}</h4>
                <p className="meta">
                  {note.createdBy?.username || "Unknown"} ·{" "}
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="project">
                  {note.project?.name ? `Project: ${note.project.name}` : ""}
                </p>
                <div className="actions">
                  {canEdit && (
                    <Button size="small" onClick={() => handleEdit(note._id)}>
                      <FiEdit2 />
                    </Button>

                  )}
                  {canEdit && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(note._id)}
                    >
                      <FiTrash2 />
                    </Button>
                  )}
                  {canEdit && (
                    <Button size="small" onClick={() => handleShare(note._id)}>
                      <FiShare2 />
                    </Button>
                  )}
                  {note._id && (
                    <Link to={`/apps/note/${note._id}`} className="btn-link">
                      <FiClipboard /> View
                    </Link>
                  )}
                  {note._id && (
                    <Button size="small" onClick={() => handleCopy(note._id)}>
                      <FiClipboard />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Floating Button */}
      <Button className="floating-btn" onClick={handleAdd}>
         <FaPlus size={16} />
      </Button>
      

      

      {/* Snackbar (Toast replacement) */}
      <Snackbar
        open={showToast}
        autoHideDuration={2000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Copied to My Notes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NotesUI;
