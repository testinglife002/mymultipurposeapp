// controllers/comment.controller.js
import Comment from "../models/comment.model.js";

  
// ✅ Add a comment
export const addComment = async (req, res) => {
  try {
    const { postId, content, approved } = req.body;
    const userId = req.user?.id;

    // Admin/Author comments auto-approved
    const autoApproved =
      req.user?.role === "admin" || req.user?.role === "author" || approved;

    const comment = new Comment({ postId, userId, content, approved: autoApproved });
    await comment.save();

    res.status(201).json({
      message: autoApproved
        ? "Comment published successfully"
        : "Comment submitted for approval",
      comment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    let filter = { postId, approved: true };

    // Admin/Author can view all
    if (req.user?.role === "admin" || req.user?.role === "author") {
      filter = { postId };
    }

    const comments = await Comment.find(filter)
      .populate("userId", "username role")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Approve a comment
export const approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // only admin/author can approve
    if (!(req.user?.role === "admin" || req.user?.role === "author")) {
      return res.status(403).json({ message: "Not authorized to approve comments" });
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { approved: true },
      { new: true }
    );

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment approved", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Admin, author, or owner can delete
    if (
      !(req.user?.role === "admin" ||
        req.user?.role === "author" ||
        comment.userId?.toString() === req.user?.id)
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

