// routes/project.routes.js
import express from "express";
import { createProject, getProjects, shareProject, updateProject, deleteProject } from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Secure routes
router.get("/", verifyToken, getProjects);
router.post("/", verifyToken, createProject);
router.post("/share", verifyToken, shareProject);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);

export default router;
