// src/appcomponents/NoteCard.jsx
import { Card, CardContent, CardHeader, Typography, IconButton } from "@mui/material";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./NoteCard.css";

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <Card className="note-card-item">
      <CardHeader
        title={note.title}
        subheader={new Date(note.createdAt).toLocaleDateString()}
        action={
          <div className="card-actions">
            <IconButton onClick={() => onEdit(note)} className="edit-btn">
              <FiEdit2 />
            </IconButton>
            <IconButton onClick={() => onDelete(note._id)} className="delete-btn">
              <FiTrash2 />
            </IconButton>
          </div>
        }
      />
      <CardContent>
        <Typography variant="body2" className="note-snippet">
          {note.content.length > 120
            ? note.content.substring(0, 120) + "..."
            : note.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
