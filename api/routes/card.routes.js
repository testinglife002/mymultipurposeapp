// server/routes/card.routes.js
import express from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // NEW: Import fs for mkdirSync
import {
    createCard,
    getCardById,
    updateCard,
    deleteCard,
    reorderCardsInList,
    moveCardBetweenLists,
    addCommentToCard,
    deleteCommentFromCard,
    addChecklistToCard,
    deleteChecklistFromCard,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    uploadAttachment,
    deleteAttachment,
    createNewCard,
    // updateCardOrder,
    updateEditCard,
    deleteDeleteCard,
    moveCard,
    moveCardController,
    addChecklist,
    deleteChecklist,
    addChecklistItems,
    deleteChecklistItems,
    toggleChecklistItems,
    addComment,
    deleteComment,
    getCardsByList
} from "../controllers/card.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/ --- Multer Configuration for File Uploads --- /
// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create the 'public/uploads' directory if it doesn't exist
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
        // Ensure the directory exists synchronously (or handle asynchronously)
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename to prevent collisions
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter to allow only certain file types (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Only images, PDFs, and common document types are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: fileFilter
});



// Get all cards for a specific list
router.get("/list/:listId", verifyToken, getCardsByList);

 router.post('/:listId/cards', verifyToken, createNewCard);
// router.post('/:boardId/lists/:listId/cards/reorder', verifyToken, updateCardOrder);

 router.put('/cards/:cardId', verifyToken, updateEditCard);
 router.delete('/cards/:cardId', verifyToken, deleteDeleteCard);

 // card.route.js
// router.put('/:id/move-card', verifyToken, moveCard);
router.put('/move', verifyToken, moveCard);
router.put("/:cardId/move", verifyToken, moveCardController);



 // router.delete('/lists/:listId', deleteList);





// Card creation within a specific list
// router.post('/lists/:listId/cards', verifyToken, createCard);

// Individual card operations
router.route('/:id')
    .get(verifyToken, getCardById)    // Get a single card
    .put(verifyToken, updateCard)     // Update a card
    .delete(verifyToken, deleteCard); // Delete a card

// Reorder cards within a list
router.put('/lists/:listId/cards/reorder', verifyToken, reorderCardsInList);

// Move card between lists
router.put('/:cardId/move', verifyToken, moveCardBetweenLists);

// Comments on cards
router.post('/:id/comments', verifyToken, addCommentToCard);
router.delete('/:cardId/comments/:commentId', verifyToken, deleteCommentFromCard);

// Checklists on cards
router.post('/:id/checklists', verifyToken, addChecklistToCard);
router.delete('/:cardId/checklists/:checklistId', verifyToken, deleteChecklistFromCard);

// Checklist items
router.post('/:cardId/checklists/:checklistId/items', verifyToken, addChecklistItem);
router.put('/:cardId/checklists/:checklistId/items/:itemId', verifyToken, updateChecklistItem);
router.delete('/:cardId/checklists/:checklistId/items/:itemId', verifyToken, deleteChecklistItem);

// NEW: Attachment routes
router.post('/:id/attachments', verifyToken, upload.single('attachment'), uploadAttachment); // 'attachment' is the field name for the file input
router.delete('/:cardId/attachments/:attachmentId', verifyToken, deleteAttachment);


// ---------- COMMENTS ----------

// Add a comment to a card
router.post("/:cardId/comments", verifyToken, addComment);

// Delete a comment from a card
router.delete("/:cardId/comments/:commentId", verifyToken, deleteComment);

// ---------- CHECKLISTS ----------

// Add a checklist to a card
router.post("/:cardId/checklists", verifyToken, addChecklist);

// Delete a checklist from a card
router.delete("/:cardId/checklists/:checklistId", verifyToken, deleteChecklist);

// ---------- CHECKLIST ITEMS ----------

// Add an item to a checklist
router.post("/:cardId/checklists/:checklistId/items", verifyToken, addChecklistItems);
// Toggle checklist item completion
router.put("/:cardId/checklists/:checklistId/items/:itemId/toggle", verifyToken, toggleChecklistItems);

// Delete a checklist item
router.delete("/:cardId/checklists/:checklistId/items/:itemId", verifyToken, deleteChecklistItems);


export default router;
