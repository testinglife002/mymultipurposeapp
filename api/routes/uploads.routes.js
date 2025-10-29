// routes/uploads.routes.js)
// routes/uploads.routes.js
import express from "express";

import { uploadFile, getFilesByCategory } from "../controllers/upload.controller.js";
import uploading from "../middleware/uploading.js";

const router = express.Router();

router.post("/", uploading.single("file"), uploadFile);
router.get("/:category", getFilesByCategory);

export default router;