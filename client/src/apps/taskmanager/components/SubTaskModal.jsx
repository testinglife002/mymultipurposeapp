import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import newRequest from "../../../api/newRequest";

const SubTaskModal = ({ open, handleClose, taskId, onSubtaskAdded }) => {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSubtask = async () => {
    if (!title.trim()) return alert("Subtask title is required");
    setLoading(true);
    try {
      // Send request to backend
      const res = await newRequest.post(`/tasks/${taskId}/subtasks`, { title, tag });
      
      // Update parent component instantly
      if (res.data?.subTasks) onSubtaskAdded(res.data.subTasks);

      // Reset form
      setTitle("");
      setTag("");
      handleClose();
    } catch (err) {
      console.error("Add subtask error:", err);
      alert("Failed to add subtask.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Subtask
        </Typography>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Tag (optional)"
          fullWidth
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          margin="normal"
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSubtask}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Add Subtask"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SubTaskModal;
