// src/appcomponents/Card.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card as MUICard,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import {
  Share2,
  Pencil,
  Trash2,
  Clipboard,
  Eye,
} from "lucide-react";
import ContentModal from "./ContentModal";
import "./Card.css";

function Card({
  title,
  blocks,
  projectId,
  projectName,
  isPublic,
  createdBy,
  user,
  idx,
  canEdit,
  onEdit,
  onDelete,
  onShare,
  onCopyToDashboard,
  isCopy,
  sharedOriginal,
  sharedWith,
}) {
  const [showModal, setShowModal] = useState(false);

  let previewText = "";
  blocks?.forEach((block) => {
    switch (block.type) {
      case "paragraph":
      case "header":
      case "alert":
        previewText += (block.data?.text || block.data?.message || "") + " ";
        break;
      case "list":
      case "checklist":
        if (block.data?.items)
          previewText += block.data.items
            .map((i) => i.text || i)
            .join(" ") + " ";
        break;
      default:
        break;
    }
  });
  previewText = previewText.trim();

  return (
    <>
      <Card
        className="note-card"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
      <MUICard className="note-card-mui">
        <CardHeader
          title={
            <Typography variant="subtitle2" noWrap>
              {createdBy?.username || "Unknown"}
            </Typography>
          }
          action={
            <Chip
              size="small"
              label={isPublic ? "Public" : "Private"}
              color={isPublic ? "success" : "default"}
            />
          }
          className="card-header"
        />

        <CardContent>
          <Typography
            variant="h6"
            className="note-title"
            title={title}
            gutterBottom
          >
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Project: {projectName || projectId?.name || "N/A"}
          </Typography>
          <Box className="note-preview">
            {previewText.length > 55
              ? previewText.substring(0, 55) + "..."
              : previewText}
          </Box>
          {sharedWith?.length > 0 && (
            <Chip
              size="small"
              label={`${sharedWith.length} shared`}
              color="info"
              className="shared-chip"
            />
          )}
        </CardContent>

        <CardActions className="card-actions">
          {canEdit && (
            <Button size="small" onClick={() => onEdit(idx)} startIcon={<Pencil />}>
              Edit
            </Button>
          )}
          {canEdit && (
            <Button
              size="small"
              onClick={() => onDelete(idx)}
              startIcon={<Trash2 />}
              color="error"
            >
              Delete
            </Button>
          )}
          {canEdit && (
            <Button
              size="small"
              onClick={() => onShare(idx)}
              startIcon={<Share2 />}
              color="info"
            >
              Share
            </Button>
          )}

          <Button
            size="small"
            component={Link}
            to={`/notes/${idx}`}
            startIcon={<Eye />}
          >
            View
          </Button>

          {canEdit && (
            <Button
              size="small"
              onClick={() => onCopyToDashboard?.(idx)}
              startIcon={<Clipboard />}
              color="success"
            >
              Copy
            </Button>
          )}

          {isCopy && sharedOriginal && (
            <Button
              size="small"
              component={Link}
              to={`/notes/${sharedOriginal._id}`}
              color="info"
            >
              View Original
            </Button>
          )}
        </CardActions>
      </MUICard>

      <ContentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={title}
        blocks={blocks}
        idx={idx}
        onEdit={onEdit}
      />
    </Card>
    </>
  );
}

export default Card;
