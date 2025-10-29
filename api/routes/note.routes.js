// server/routes/note.routes.js
import { Router } from 'express';
import multer from "multer";
import fs from "fs";
import path from "path";
// import { requireUser } from '../middleware/auth.js';
import { verifyToken } from "../middleware/auth.middleware.js";
import { 
  copyNote,
  createNote, 
  deleteNote, 
  fetchUrl, 
  getAllNotes, 
  getAllUsers, 
  getCopiedNotes, 
  getMyNotes, 
  getNote, 
  getNoteById, 
  getNotes, 
  getNotesByProject, 
  getPublicNotes, 
  getSharedWithMeNotes, 
  getUsersByIds, 
  listNotes, 
  shareNote, 
  updateNote,
  uploadNoteFile,
  uploadNoteImage
} from '../controllers/note.controller.js';

const router = Router();


// --- Multer Configuration for Image Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "public", "uploads", "notes");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// --- Filters ---
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) cb(null, true);
  else cb(new Error("Only document files allowed"), false);
};

// --- Upload Middleware ---
const uploadImage = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: imageFilter,
});

const uploadFile = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 20 }, // 20MB for docs
  fileFilter,
});



// router.use(requireUser);

// Specific route first
router.get("/allusers", verifyToken, getAllUsers);
router.post("/users-by-ids", getUsersByIds);

router.get('/', verifyToken, listNotes);
router.post('/', verifyToken, createNote);
router.get('/notes', verifyToken, getNotes); // modern


// Link preview route for Editor.js LinkTool
router.post("/fetch-url", fetchUrl);

// Notes filters
router.get("/all", verifyToken, getAllNotes);
router.get("/my", verifyToken, getMyNotes);
router.get("/public", verifyToken, getPublicNotes);
router.get("/copies", verifyToken, getCopiedNotes);
router.get("/shared", verifyToken, getSharedWithMeNotes);
router.get("/project/:projectId", verifyToken, getNotesByProject);

router.get('/:id', verifyToken, getNote); // <-- added
router.get("/single-note/:noteId", verifyToken, getNoteById);

// 🔹 new route for fetching my notes

router.put('/:id', verifyToken, updateNote);

router.post("/:id/share", verifyToken, shareNote);
router.post("/:id/copy", verifyToken, copyNote);

// --- Image Upload for Editor.js ---
// --- Upload Routes ---
router.post("/upload-image", verifyToken, uploadImage.single("image"), uploadNoteImage);
router.post("/upload-file", verifyToken, uploadFile.single("file"), uploadNoteFile);

router.delete('/:id', verifyToken, deleteNote);


export default router;