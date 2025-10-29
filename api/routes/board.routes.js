// server/routes/board.routes.js
import express from "express";
import {
     createBoard,
    getBoards,
    getBoardById,
    updateBoard,
    deleteBoard,
    addBoardMember,
    removeBoardMember,
    getListsForBoard,
    createListForBoard,
    getBoardByTheId,
    createList,
    updateListOrder,
    getListsByBoardId,
    updateBoardMembers
} from "../controllers/board.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All board routes will be protected, requiring a valid JWT

router.post('/',verifyToken, createBoard) // Create a new board
router.get('/',verifyToken, getBoards);   // Get all boards for the authenticated user


// ** LisyColumns & CardItems  ** //
// new approach to get alternate solution
// router.get('/:id', verifyToken, getBoardByTheId); // GET single board with lists/cards

router.post('/:boardId/lists', verifyToken, createList);
// Existing routes...
router.post('/:id/lists', verifyToken, createListForBoard); // <-- Add this
 router.patch('/:boardId/lists/reorder', verifyToken, updateListOrder);

 router.get("/:boardId/lists", verifyToken, getListsByBoardId);


// router.post('/:boardId/lists/:listId/cards', createCard);
// router.post('/:boardId/lists/:listId/cards/reorder', updateCardOrder);

// router.put('/cards/:cardId', updateCard);
// router.delete('/cards/:cardId', deleteCard);
// router.delete('/lists/:listId', deleteList);



// as before
router.get("/:id", verifyToken, getBoardById);
router.get('/:id/lists', verifyToken, getListsForBoard);


    
router.route('/:id')
   // .get(verifyToken, getBoardById)    // Get a specific board by ID
    .put(verifyToken, updateBoard)     // Update a specific board by ID
    .delete(verifyToken, deleteBoard); // Delete a specific board by ID

// Routes for managing board members
router.route('/:id/members')
    .put(verifyToken, addBoardMember); // Add a member to a board

router.route('/:id/members/:memberId')
    .delete(verifyToken, removeBoardMember); // Remove a member from a board

router.put("/:id/members/bulk", verifyToken, updateBoardMembers);

export default router;
