// 7️⃣ server/routes/emailTemplateRoutes.js
// server/routes/emailTemplateRoutes.js
import express from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  getTemplates,
  sendTemplateWhatsApp,
  updateTemplate,
} from "../controllers/emailTemplateController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// CRUD endpoints
router.post("/", upload.single("image"), createTemplate); // Create with image
router.get("/", getTemplates); // List all
router.get("/:id", getTemplateById); // Get single
router.put("/:id", upload.single("image"), updateTemplate); // Update with image
router.delete("/:id", deleteTemplate); // Delete


// ✅ POST: Send Email Template as WhatsApp Message
router.post("/send-template", sendTemplateWhatsApp);

export default router;



