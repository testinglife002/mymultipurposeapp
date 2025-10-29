// routes/sendPulseRoutes.js
// routes/sendPulseRoutes.js
import express from "express";
import { sendEmail } from "../controllers/sendPulseController.js";

const router = express.Router();

router.post("/send-email", sendEmail);

export default router;

