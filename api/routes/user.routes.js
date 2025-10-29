// routes/user.routes.js

// routes/user.routes.js
import express from "express";
import { getAllUsers, getUserPhone } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllUsers);


// ✅ Get user phone number
router.get("/:userId/phone", verifyToken, getUserPhone);

export default router;