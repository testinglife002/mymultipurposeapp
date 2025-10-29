// routes/app.routes.js
import express from "express";
import { createApp, getAppsByProject, updateApp, deleteApp } from "../controllers/app.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createApp);
router.get("/project/:projectId", verifyToken, getAppsByProject);
router.put("/:id", verifyToken, updateApp);
router.delete("/:id", verifyToken, deleteApp);

export default router;
