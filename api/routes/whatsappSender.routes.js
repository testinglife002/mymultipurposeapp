// server/routes/whatsappSender.routes.js
import express from "express";
import multer from "multer";
import { sendFixedWhatsAppMessage, sendWhatsApp, sendWhatsAppMessage } from "../controllers/whatsappSenderController.js";


const router = express.Router();
const upload = multer({ dest: "tmp/uploads/" });

router.post("/send", upload.array("files", 5), sendWhatsApp);
router.post("/send-message", upload.array("files", 5), sendWhatsAppMessage);

// ✅ POST /api/whatsapp/send
// ✅ POST /api/whatsapp/send-fix-message
router.post("/send-fix-message", upload.array("files", 5), sendFixedWhatsAppMessage);


export default router;
