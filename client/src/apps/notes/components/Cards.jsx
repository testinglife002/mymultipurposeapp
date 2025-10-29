import { useState } from "react";
import {
  Card as MUICard,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FiShare2, FiEdit2, FiTrash2, FiClipboard, FiEye } from "react-icons/fi";
import ContentModal from "./ContentModal";
import "./Cards.css";

function Cards({
  idx,
  title,
  blocks,
  projectId,
  projectName,
  createdBy,
  user,
  canEdit = true,
  onEdit,
  onDelete,
  onShare,
  onCopyToDashboard,
  isPublic,
  isCopy,
  sharedOriginal,
  sharedWith,
  copiedNoteId,
  clamp = true, // ✅ clamp toggle prop
}) {
  const [showModal, setShowModal] = useState(false);

  const generatePreviewText = () => {
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
          if (block.data?.items) previewText += block.data.items.map((i) => i.text || i).join(" ") + " ";
          break;
        default:
          break;
      }
    });
    return previewText.trim();
  };

  const previewText = generatePreviewText();

  return (
    <>
      <MUICard
        className={`note-card ${copiedNoteId === idx ? "copied-highlight" : ""}`}
        sx={{
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <CardContent sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Tooltip title={createdBy?.username || "Unknown"}>
              <Typography variant="caption" noWrap>
                <strong>{createdBy?.username || "Unknown"}</strong>
              </Typography>
            </Tooltip>

            <Chip
              label={isPublic ? "Public" : "Private"}
              color={isPublic ? "success" : "default"}
              size="small"
            />
          </Stack>

          {sharedWith?.length > 0 && (
            <Chip
              label={`${sharedWith.length} Shared`}
              color="info"
              size="small"
              sx={{ mt: 0.5 }}
            />
          )}

          {/* Title */}
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mt: 1 }}
            title={title}
            noWrap
          >
            {title}
          </Typography>

          {/* Project */}
          <Typography variant="caption" color="text.secondary">
            Project: {projectName || projectId?.name || "N/A"}
          </Typography>

          {/* Content Preview */}
          <Typography
            variant="body2"
            color="text.secondary"
            className={clamp ? "clamp-preview" : ""}
            sx={{ mt: 1 }}
          >
            {previewText}
          </Typography>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ flexWrap: "wrap", gap: 0.5, pt: 0, px: 1 }}>
          {canEdit && (
            <Button size="small" variant="outlined" startIcon={<FiEdit2 />} onClick={() => onEdit(idx)}>
              Edit
            </Button>
          )}
          {canEdit && (
            <Button size="small" variant="outlined" color="error" startIcon={<FiTrash2 />} onClick={() => onDelete(idx)}>
              Delete
            </Button>
          )}
          {canEdit && (
            <Button size="small" variant="outlined" color="info" startIcon={<FiShare2 />} onClick={() => onShare(idx)}>
              Share
            </Button>
          )}

          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<FiEye />}
            component={Link}
            to={`/notes/${idx}`}
          >
            View
          </Button>

          {canEdit && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<FiClipboard />}
              onClick={() => onCopyToDashboard?.(idx)}
            >
              Copy
            </Button>
          )}

          {isCopy && sharedOriginal && (
            <Button
              size="small"
              variant="outlined"
              color="info"
              component={Link}
              to={`/notes/${sharedOriginal._id}`}
            >
              View Original
            </Button>
          )}
        </CardActions>
      </MUICard>

      {/* Content Modal */}
      <ContentModal title={title} blocks={blocks} idx={idx} onEdit={onEdit} />
    </>
  );
}

export default Cards;
