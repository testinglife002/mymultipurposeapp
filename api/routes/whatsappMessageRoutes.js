// Routes – whatsappMessageRoutes.js
import express from "express";
import multer from "multer";
import { getAllMessages, getMessageById, sendMessage } from "../controllers/whatsappMessageController.js";


const router = express.Router();


// Multer config for file uploads
const upload = multer({ dest: "uploads/" });

// 📩 Send new WhatsApp message
router.post("/send", upload.single("file"), sendMessage);

// 📜 Get all messages
router.get("/", getAllMessages);

// 🔍 Get message by ID
router.get("/:id", getMessageById);


export default router;