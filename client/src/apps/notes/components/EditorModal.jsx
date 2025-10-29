// src/appcomponents/EditorModal.jsx
// src/appcomponents/EditorModal.jsx
// src/appcomponents/EditorModal.jsx
import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import { Save, X } from "lucide-react";
import newRequest from "../../../api/newRequest";
import { EditorContext } from "./EditorContext";
import "./EditorModal.css";

const EditorModal = ({
  open,
  handleClose,
  onSave,
  initialTitle = "",
  initialProject = "",
  initialIsPublic = false,
  initialTags = [],
  initialBlocks = [],
  initialSharedWith = [],
}) => {
  const { initEditor, editorInstanceRef } = useContext(EditorContext);

  const [title, setTitle] = useState(initialTitle);
  const [project, setProject] = useState(initialProject);
  const [tags, setTags] = useState(initialTags);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [projects, setProjects] = useState([]);
  const [sharedWith, setSharedWith] = useState(initialSharedWith);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects");
        const list = Array.isArray(res.data) ? res.data : res.data.projects || [];
        const formatted = list.map((p) => ({
          value: p._id,
          label: p.name || "Untitled Project",
        }));
        setProjects(formatted);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    if (open) fetchProjects();
  }, [open]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await newRequest.get("/notes/allusers");
        const opts = res.data.map((u) => ({
          value: u._id,
          label: `${u.username} (${u.email})`,
        }));
        setUserOptions(opts);
      } catch (err) {
        console.error("Failed to load users for sharing:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (open) fetchUsers();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setTitle(initialTitle);
    setProject(initialProject);
    setIsPublic(initialIsPublic);
    setTags(initialTags);

    const formattedSharedWith =
      Array.isArray(initialSharedWith) && initialSharedWith.length > 0
        ? initialSharedWith.map((u) => ({
            value: u._id || u.value,
            label: u.username || u.label,
          }))
        : [];
    setSharedWith(formattedSharedWith);

    initEditor("editorjs-holder", { blocks: initialBlocks || [] });
  }, [open]);

  const handleSaveClick = async () => {
    try {
      const editorData = editorInstanceRef.current
        ? await editorInstanceRef.current.save()
        : { blocks: [] };
      const blocks = editorData.blocks || [];
      const sharedUserIds = sharedWith.map((u) => u.value);
      onSave(title, project, isPublic, tags, blocks, sharedUserIds);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const value = e.target.value.trim();
      if (!tags.includes(value)) setTags([...tags, value]);
      e.target.value = "";
    }
  };

  const handleTagDelete = (tagToDelete) =>
    setTags((prev) => prev.filter((t) => t !== tagToDelete));

  if (!open) return null;

  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal">
        <div className="editor-modal-header">
          <h2>Edit Note</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
          />
        </div>

        {/* Project Dropdown */}
        <div className="form-group">
          <label>Project</label>
          <Select
            options={projects}
            value={projects.find((p) => p.value === project) || null}
            onChange={(selected) => setProject(selected ? selected.value : "")}
            placeholder="Select project..."
          />
        </div>

        {/* Share with users */}
        <div className="form-group" style={{marginBottom:'5%'}} >
          <label>Share with users</label>
          <Select
            isMulti
            isClearable
            isLoading={loadingUsers}
            options={userOptions}
            value={sharedWith}
            onChange={(selected) => setSharedWith(selected || [])}
            placeholder="Select users to share with..."
          />
        </div>

        {/* Public toggle */}
        <div className="form-group toggle-group">
          <label>Public</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label>Tags</label>
          <div className="tag-container">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
                <FiX className="tag-remove" onClick={() => handleTagDelete(tag)} />
              </span>
            ))}
          </div>
          <input
            type="text"
            className="input"
            placeholder="Press Enter to add tag"
            onKeyDown={handleTagAdd}
          />
        </div>


        {/* EditorJS */}
        <div id="editorjs-holder" className="editor-area" />

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSaveClick}>
            <Save size={16} style={{ marginRight: "6px" }} />
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorModal;







