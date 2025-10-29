// src/appcomponents/EditorModalUI.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Chip,
  Box,
} from "@mui/material";

import "./EditorModalUI.css";

function EditorModalUI({
  open,
  handleClose,
  onSave,
  initialTitle = "",
  initialProject = "",
  initialIsPublic = false,
  initialTags = [],
  initialBlocks = [],
  initialSharedWith = [],
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [projectId, setProjectId] = useState(initialProject || "");
  const [isPublic, setIsPublic] = useState(initialIsPublic || false);
  const [tags, setTags] = useState(initialTags || []);

  useEffect(() => {
    setTitle(initialTitle || "");
    setProjectId(initialProject || "");
    setIsPublic(initialIsPublic || false);
    setTags(initialTags || []);
  }, [initialTitle, initialProject, initialIsPublic, initialTags]);

  const handleSaveClick = () => {
    onSave(title, projectId, isPublic, tags);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((t) => t !== tagToDelete));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Note</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          fullWidth
          margin="dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          }
          label="Public"
        />
        <Box className="tags-input">
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              color="primary"
              size="small"
              className="tag-chip"
            />
          ))}
          <TextField
            placeholder="Add tag and press Enter"
            onKeyDown={handleAddTag}
            variant="standard"
            className="tag-textfield"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditorModalUI;
