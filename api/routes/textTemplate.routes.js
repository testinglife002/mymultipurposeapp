// ### backend/routes/textTemplate.routes.js
import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  listTemplates,
  updateTemplate,
  uploadImageOnly,
} from "../controllers/textTemplate.controller.js";

const router = express.Router();

// ✅ Create a new text template (with optional image upload)
router.post("/", upload.single("file"), createTemplate);

// ✅ Upload an image only (for layer backgrounds or previews)
router.post("/upload", upload.single("file"), uploadImageOnly);

// ✅ Read operations
router.get("/", listTemplates);
router.get("/:id", getTemplate);

// ✅ Update & delete
router.put("/:id", upload.single("file"), updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
