// 8️⃣ server/routes/newsletterRoutes.js
import express from "express";
import { sendNewsletter } from "../controllers/newsletterController.js";



const router = express.Router();
router.post("/send", sendNewsletter);

export default router;



