// (routes/ogRoutes.js)

import express from "express";
import { getOGMeta } from "../controllers/ogController.js";

const router = express.Router();

// Example: /og/post/my-awesome-article
router.get("/post/:slug", getOGMeta);

export default router;