// routes/banner.routes.js

import express from "express";
import { deleteBanner, getAllBanners, saveExportedBanner, updateBanner } from "../controllers/bannerController.js";


const router = express.Router();

// POST /api/banner/export → Save banner locally and upload to Cloudinary
router.post("/export", saveExportedBanner);

// Read all banners
router.get("/", getAllBanners);

// Update a banner
router.put("/:id", updateBanner);

// Delete a banner
router.delete("/:id", deleteBanner);

export default router;