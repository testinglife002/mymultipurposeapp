// routes/auth.routes.js
import express from "express";
import { register, verifyEmail, login, logout, resendVerification, getCurrentUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verify", resendVerification);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current-user", getCurrentUser);

export default router;


