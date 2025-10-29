// routes/  
// routes/post.routes.js
// backend/routes/post.routes.js
import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserDraft,
  getUserPosts,
  updateUserPost,
  getPostBySlug,
  publishPost,
  checkSlugUnique,
} from "../controllers/post.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/uploads.middleware.js";

const router = express.Router();

/* ✅ ROUTE SUMMARY
   POST   /api/posts/                      → Create new post
   GET    /api/posts/                      → Get all posts
   GET    /api/posts/id/:id                → Get post by ID
   GET    /api/posts/slug/:slug            → Get post by slug
   GET    /api/posts/check-slug/:slug      → Check slug uniqueness
   GET    /api/posts/user/:userId          → Get posts by user
   GET    /api/posts/draft/:userId         → Get user's draft
   PUT    /api/posts/:id/publish           → Publish post (admin)
   PUT    /api/posts/:id                   → Update post (full)
   PUT    /api/posts/inline/:postId        → Inline user edit
   DELETE /api/posts/:id                   → Delete post
*/

// ✅ Slug check
router.get("/check-slug/:slug", checkSlugUnique);

// ✅ Create post with multi-file upload (images/audio/video)
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);


// ✅ Get all posts
router.get("/", getPosts);

// ✅ Get single post by ID
router.get("/id/:id", getPostById);

// ✅ Get single post by slug
router.get("/slug/:slug", getPostBySlug);

// ✅ Get user-specific posts
router.get("/user/:userId", verifyToken, getUserPosts);

// ✅ Get user's draft
router.get("/draft/:userId", verifyToken, getUserDraft);

// ✅ Publish post (admin/moderator)
router.put("/:id/publish", verifyToken, publishPost);

// ✅ Update post (full form + file uploads)
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updatePost
);

// ✅ Inline quick edit for user (title, content, etc.)
router.put("/inline/:postId", verifyToken, updateUserPost);

// ✅ Delete post
router.delete("/:id", verifyToken, deletePost);

export default router;

