// routes/channel.routes.js
// backend/routes/channel.routes.js
import express from 'express';
import {
  createChannel,
  getChannels,
  getChannelById,
  updateChannel,
  deleteChannel
} from '../controllers/channel.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes
router.post('/', verifyToken, createChannel);        // Create channel
router.get('/', getChannels);          // Get all channels
router.get('/:id', getChannelById);    // Get single channel by ID or slug
router.put('/:id', verifyToken, updateChannel);     // Update channel
router.delete('/:id', verifyToken, deleteChannel);  // Delete channel

export default router;