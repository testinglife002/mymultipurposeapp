// routes/category.routes.js
import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryTree,
  updateCategory,
  deleteCategory,
  updateCategoryBySlug,
  deleteCategoryBySlug,
  getCategoryBySlug
} from '../controllers/category.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();



// ✅ Only admin can create, update, delete
// Create category (Admin only)
router.post("/", verifyToken, createCategory);
// Update category by slug (Admin only)
router.put("/:slug", verifyToken, updateCategory);
// Delete category by slug (Admin only)
router.delete("/:slug", verifyToken, deleteCategory);


// POST /api/categories - Create category
// router.post('/', createCategory);

// GET /api/categories - Get all (flat)
router.get('/', getAllCategories);

// GET /api/categories/tree - Get category tree
router.get('/tree', getCategoryTree);

// Use slug instead of id in URL param
router.get('/:slug', getCategoryBySlug); // Get single category by slug
// router.put('/:slug', updateCategory);    // Update by slug
// router.delete('/:slug', deleteCategory); // Delete by slug


// PUT /api/categories/:slug - Update category by slug
router.put('/edit/:slug',  updateCategoryBySlug);

// DELETE /api/categories/:slug - Delete category by slug
router.delete('/delete/:slug',  deleteCategoryBySlug);


export default router;
