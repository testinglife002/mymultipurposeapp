// routes/ogFetchRoutes.js

import express from "express";
import { fetchOGMeta } from "../controllers/ogFetchController.js";

const router = express.Router();

router.get("/fetch", fetchOGMeta);

export default router;