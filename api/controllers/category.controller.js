// controllers/category.controller.js
import Category from '../models/category.model.js';
import slugify from "slugify";

// Utility to create slugs consistently
const createSlug = (name) => name.toLowerCase().trim().replace(/\s+/g, '-');

// Create a category
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentId } = req.body;
     const slug = createSlug(name);

    // Optionally, check if slug already exists to avoid duplicates
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'Category slug already exists' });
      const newSlug = slugify(name, { lower: true, strict: true });
      const category = new Category({ name, slug: newSlug, parentId: parentId || null });
      const saved = await category.save();
      res.status(201).json(saved);
    } else {
        const category = new Category({ name, slug, parentId: parentId || null });
        const saved = await category.save();
        res.status(201).json(saved);
    }
    // res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Category creation failed' });
  }
};

// Get all categories (flat)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/*
export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find();
    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => String(cat.parentId) === String(parentId))
        .map(cat => ({
          ...cat.toObject(),
          children: buildTree(cat._id),
        }));
    };
    res.json(buildTree());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
*/

// Build category tree recursively
const buildTree = (categories, parentId = null) => {
  return categories
    .filter(cat => String(cat.parentId) === String(parentId))
    .map(cat => ({
      ...cat._doc,
      children: buildTree(categories, cat._id),
    }));
};

// Get categories as tree structure
export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const tree = buildTree(categories);
    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: 'Failed to build category tree' });
  }
};

// Update category by slug
export const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, parentId } = req.body;
    const newSlug = createSlug(name);

    // Optionally check if the new slug conflicts with another category
    const slugConflict = await Category.findOne({ slug: newSlug, _id: { $ne: (await Category.findOne({ slug }))._id } });
    if (slugConflict) {
      return res.status(400).json({ error: 'Another category with this slug already exists' });
    }

    const updated = await Category.findOneAndUpdate(
      { slug },
      { name, slug: newSlug, parentId: parentId || null },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Update category by slug
export const updateCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description, parentId } = req.body;

    const updatedSlug = slugify(name, { lower: true, strict: true });
    const category = await Category.findOneAndUpdate(
      { slug },
      { name, slug: updatedSlug, description, parentId: parentId || null },
      { new: true }
    );

    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete category by slug
export const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const deleted = await Category.findOneAndDelete({ slug });
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// Delete category by slug
export const deleteCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const deleted = await Category.findOneAndDelete({ slug });
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

