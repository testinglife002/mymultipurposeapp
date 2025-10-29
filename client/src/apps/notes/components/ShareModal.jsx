  // src/appcomponents/ShareModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import newRequest from "../../../api/newRequest";
  import "./ShareModal.css";

  const ShareModal = ({ open, onClose, noteId, onShared }) => {
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);

    // Load users
    useEffect(() => {
      if (!open) return;
      setLoading(true);
      newRequest
        .get("/notes/allusers")
        .then((res) => setUsers(res.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [open]);

    const toggleUser = (id) => {
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };


    const handleShare = async () => {
      if (selected.length === 0) return alert("Select users to share with.");
      setSharing(true);
      try {
        setLoading(true);
        const res = await newRequest.post(`/notes/${noteId}/share`, { targetUserIds: selected });
        // onShareSuccess(selectedUserIds);
        if (res.status === 200) {
          onShared?.(res.data.note);
          onClose();
        }
      } catch (err) {
        console.error(err);
        alert("Failed to share note");
      } finally {
        setLoading(false);
        setSharing(false);
      }
    };

    return (
      <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
          maxHeight: "80vh",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          mx: "auto",
          mt: "10vh",
          boxShadow: 6,
        }}
      >
        <Typography variant="h6" mb={2}>
          Share Note
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <List dense>
            {users.map((u) => (
              <ListItem key={u._id} button onClick={() => toggleUser(u._id)}>
                <ListItemIcon>
                  <Checkbox edge="start" checked={selected.includes(u._id)} />
                </ListItemIcon>
                <ListItemText primary={u.username} secondary={u.email} />
              </ListItem>
            ))}
          </List>
        )}

        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            disabled={sharing}
            onClick={handleShare}
          >
            {sharing ? "Sharing..." : "Share"}
          </Button>
        </Box>
      </Box>
    </Modal>
    );
  };

  export default ShareModal;
