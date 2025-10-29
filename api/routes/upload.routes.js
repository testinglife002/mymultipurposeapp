// routes/upload.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadImage } from "../controllers/uploadController.js";




const router = express.Router();
const upload = multer({ dest: "temp/" }); // temp folder for incoming uploads

router.post("/", upload.single("image"), uploadImage);

export default router;