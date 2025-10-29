// Step 5. Create routes/whatsapp.routes.js
import express from "express";
import {
  sendWhatsAppMessage,
  saveDraft,
  getAllMessages,
  deleteMessage,
  sendWhatsAppMessages,
  sendTextMessage,
} from "../controllers/whatsapp.controller.js";
import { sendEmailAsWhatsApp } from "../utils/whatsappEmailMessage.js";

const router = express.Router();

router.post("/send", sendWhatsAppMessage);
router.post("/draft", saveDraft);
router.get("/all", getAllMessages);
router.delete("/:id", deleteMessage);

router.post("/send-message", sendWhatsAppMessages);

router.post("/send-text", sendTextMessage);


router.post("/send-email-template", async (req, res, next) => {
  try {
    const { htmlTemplate, user } = req.body;
    await sendEmailAsWhatsApp(user, htmlTemplate);
    res.status(200).json({ success: true, message: "Template sent to WhatsApp!" });
  } catch (err) {
    next(err);
  }
});


export default router;