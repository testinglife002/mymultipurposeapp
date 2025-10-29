// src/appcomponents/ContentModal.jsx
// src/appcomponents/ContentModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { X, Pencil } from "lucide-react";
import Content from "./Content";
import "./ContentModal.css";

function ContentModal({ open, onClose, title, blocks, idx, onEdit }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="contentmodal-header">
        {title}
        <IconButton onClick={onClose} size="small" className="close-btn">
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="contentmodal-body">
        {blocks?.map((block) => (
          <Content block={block} key={block.id} />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" startIcon={<X />}>
          Close
        </Button>
        <Button
          onClick={() => onEdit(idx)}
          variant="contained"
          color="primary"
          startIcon={<Pencil />}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ContentModal;

