// routes/comment.routes.js
import express from "express";
import {
  addComment,
  getCommentsByPost,
  approveComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, addComment);
router.get("/:postId", verifyToken, getCommentsByPost);

// Unified route style (PATCH for approve)
router.patch("/:commentId/approve", verifyToken, approveComment);
router.delete("/:commentId", verifyToken, deleteComment);

export default router;

