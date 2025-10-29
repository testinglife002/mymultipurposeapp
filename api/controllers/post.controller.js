// controllers/post.controller.js
// controllers/post.controller.js
// controllers/post.controller.js
// backend/controllers/post.controller.js
import Post from "../models/post.model.js";
import Category from "../models/category.model.js";
import Channel from "../models/channel.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";
import slugify from "slugify";
import mongoose from "mongoose";

// ✅ Generate unique slug
// Helper: Generate unique slug
export const generateUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let count = 1;
  while (await Post.findOne({ slug })) {
    slug = `${baseSlug}-${String(count).padStart(2, "0")}`;
    count++;
  }
  return slug;
};

// Helper: Safe JSON parse
const safeParse = (val) => {
  if (!val) return [];
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return [];
  }
};

// Helper: Upload file to Cloudinary and remove temp
const uploadFile = async (filePath, folder, resourceType = "image") => {
  try {
    const upload = await cloudinary.uploader.upload(filePath, { folder, resource_type: resourceType });
    await fs.unlink(filePath).catch((err) => console.warn("Failed to unlink temp file:", err));
    return upload.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Failed to upload file");
  }
};

// ✅ Check if slug is unique
export const checkSlugUnique = async (req, res) => {
  try {
    const { slug } = req.params;
    const existing = await Post.findOne({ slug });
    res.json({ unique: !existing });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create Post
// ✅ Create Post
export const createPost = async (req, res) => {
  try {
    const {
      title, description, content, blocks, trending,
      categoryId, subcategoryId, tags, hashtags,
      author, userId, status, scheduledDate,
      channelId, audioUrl, videoUrl, images: imageBody,
    } = req.body;

    if (!title || !author || !channelId)
      return res.status(400).json({ message: "Title, author, and channel required" });

    const baseSlug = slugify(title, { lower: true, strict: true });
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const category = categoryId ? await Category.findById(categoryId) : null;
    const subcategory = subcategoryId ? await Category.findById(subcategoryId) : null;

    // Images
    let images = [];
    if (req.files?.images?.length) {
      for (const [i, file] of req.files.images.entries()) {
        const url = await uploadFile(file.path, "blogImages");
        images.push({ url, isPrimary: i === 0 });
      }
    } else if (imageBody) {
      const parsed = typeof imageBody === "string" ? JSON.parse(imageBody || "[]") : imageBody;
      images = parsed.map((url, i) => ({ url: typeof url === "string" ? url : url.url, isPrimary: i === 0 }));
    }

    const primaryImg = images.find((img) => img.isPrimary)?.url || "";
    const featuredImage = primaryImg || "";

    // Audio
    let finalAudioUrl = audioUrl || "";
    if (req.files?.audio?.length) {
      finalAudioUrl = await uploadFile(req.files.audio[0].path, "blogAudio", "video");
    }

    // Video
    let finalVideoUrl = videoUrl || "";
    if (req.files?.video?.length) {
      finalVideoUrl = await uploadFile(req.files.video[0].path, "blogVideo", "video");
    }

    const post = new Post({
      title, slug: uniqueSlug, description, content, blocks: safeParse(blocks),
      trending, categoryId, categoryTitle: category?.name || "",
      subcategoryId, subcategoryTitle: subcategory?.name || "",
      tags: safeParse(tags), hashtags: safeParse(hashtags),
      images, primaryImg, featuredImage,
      audioUrl: finalAudioUrl, videoUrl: finalVideoUrl,
      channel: channel._id, author, userId,
      status: status || "draft",
      scheduledDate,
      publishedByAdmin: status === "published",
    });

    const saved = await post.save();
    res.status(201).json({ success: true, post: saved });

  } catch (err) {
    console.error("❌ Create Post Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update Post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Post.findById(id);
    if (!existing) return res.status(404).json({ message: "Post not found" });

    const updateData = { ...req.body };

    if (updateData.title) {
      const baseSlug = slugify(updateData.title, { lower: true, strict: true });
      updateData.slug = await generateUniqueSlug(baseSlug);
    }

    // Images
    if (req.files?.images?.length) {
      if (existing.images?.length) {
        for (const img of existing.images) {
          if (img.url.includes("res.cloudinary.com")) {
            const publicId = img.url.split("/").pop().split(".")[0];
            cloudinary.uploader.destroy(`blogImages/${publicId}`).catch(console.warn);
          }
        }
      }

      const imgs = [];
      for (const [i, file] of req.files.images.entries()) {
        const url = await uploadFile(file.path, "blogImages");
        imgs.push({ url, isPrimary: i === 0 });
      }
      updateData.images = imgs;
      updateData.primaryImg = imgs[0]?.url || "";
      updateData.featuredImage = imgs[0]?.url || "";
    }

    // Audio
    if (req.files?.audio?.length) {
      if (existing.audioUrl && existing.audioUrl.includes("res.cloudinary.com")) {
        const publicId = existing.audioUrl.split("/").pop().split(".")[0];
        cloudinary.uploader.destroy(`blogAudio/${publicId}`, { resource_type: "video" }).catch(console.warn);
      }
      updateData.audioUrl = await uploadFile(req.files.audio[0].path, "blogAudio", "video");
    }

    // Video
    if (req.files?.video?.length) {
      if (existing.videoUrl && existing.videoUrl.includes("res.cloudinary.com")) {
        const publicId = existing.videoUrl.split("/").pop().split(".")[0];
        cloudinary.uploader.destroy(`blogVideo/${publicId}`, { resource_type: "video" }).catch(console.warn);
      }
      updateData.videoUrl = await uploadFile(req.files.video[0].path, "blogVideo", "video");
    }

    const post = await Post.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, post });

  } catch (err) {
    console.error("❌ Update Post Error:", err);
    res.status(500).json({ message: "Error updating post", error: err.message });
  }
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Delete images
    if (post.images?.length) {
      for (const img of post.images) {
        if (img.url?.includes("res.cloudinary.com")) {
          try {
            const publicId = img.url.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`blogImages/${publicId}`);
          } catch (err) {
            console.warn("Failed to delete image from Cloudinary:", err);
          }
        }
      }
    }

    // Delete audio
    if (post.audioUrl?.includes("res.cloudinary.com")) {
      try {
        const publicId = post.audioUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`blogAudio/${publicId}`, { resource_type: "video" });
      } catch (err) {
        console.warn("Failed to delete audio from Cloudinary:", err);
      }
    }

    // Delete video
    if (post.videoUrl?.includes("res.cloudinary.com")) {
      try {
        const publicId = post.videoUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`blogVideo/${publicId}`, { resource_type: "video" });
      } catch (err) {
        console.warn("Failed to delete video from Cloudinary:", err);
      }
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post and associated media deleted successfully" });

  } catch (err) {
    console.error("❌ Delete Post Error:", err);
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
};

// ✅ Get Post by Slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate("author", "username email")
      .populate("channel", "name slug")
      .populate("categoryId", "name")
      .populate("subcategoryId", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err.message });
  }
};

// ✅ Get All Posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .populate("channel", "name slug")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const getUserDraft = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const draft = await Post.findOne({
      userId: new mongoose.Types.ObjectId(userId), // ✅ fix here
      status: "draft",
    })
      .sort({ updatedAt: -1 })
      .populate("channel", "name")
      .populate("categoryId", "name")
      .populate("subcategoryId", "name");

    if (!draft) return res.status(404).json({ message: "No draft found" });

    res.json(draft);
  } catch (error) {
    console.error("getUserDraft error:", error);
    res.status(500).json({ message: "Failed to fetch draft", error: error.message });
  }
};






// Get all posts for a specific user
export const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .lean(); // convert Mongoose documents to plain JS objects
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Get single post by slug
/*
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate('author', 'username email')
      .populate('channel', 'name slug')
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const formattedPost = {
      ...post.toObject(),
      channelTitle: post.channel?.name || "-",
      categoryTitle: post.categoryId?.name || "-",
      subcategoryTitle: post.subcategoryId?.name || "-",
    };

    res.status(200).json(formattedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
*/


// GET POST BY ID
// Get single post by ID or slug
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate('author', 'username email')
      .populate('channel', 'name slug')
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET POSTS BY CHANNEL
export const getPostsByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const posts = await Post.find({ channel: channel._id })
      .populate('author', 'username email')
      .populate('channel', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE POST
/*
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      categoryId,
      subcategoryId,
      tags,
      hashtags,
      channelId,
      status,
      featuredImage,
      audioUrl,
      videoUrl,
      trending,
      scheduledDate
    } = req.body;

    const updatedData = {
      content,
      tags,
      hashtags,
      featuredImage,
      status,
      audioUrl,
      videoUrl,
      trending,
      scheduledDate
    };

    if (title) updatedData.title = title;
    if (title) updatedData.slug = slugify(title, { lower: true, strict: true });

    if (categoryId) {
      const category = await Category.findById(categoryId);
      updatedData.categoryId = categoryId;
      updatedData.categoryTitle = category?.name || '';
    }

    if (subcategoryId) {
      const subcat = await Category.findById(subcategoryId);
      updatedData.subcategoryId = subcategoryId;
      updatedData.subcategoryTitle = subcat?.name || '';
    }

    if (channelId) {
      const channel = await Channel.findById(channelId);
      if (!channel) return res.status(404).json({ message: 'Channel not found' });
      updatedData.channel = channel._id;
    }

    // if author wants to publish, only allow admin
    if (status === 'published') updatedData.publishedByAdmin = true;

    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, { new: true })
      .populate('author', 'username email')
      .populate('channel', 'name slug');

    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(updatedPost);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/



// controllers/postController.js
// import Post from "../models/Post.js";

// Update a post (for inline editing)
export const updateUserPost = async (req, res) => {
  const { postId } = req.params;
  const updateData = req.body; // can contain title, description, content, etc.

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};



// ✅ Publish post (admin action)
// ✅ Publish Post (admin action)
export const publishPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Optional: Handle new media upload during publish
    if (req.files?.images?.length) {
      // Delete old images
      if (post.images?.length) {
        for (const img of post.images) {
          if (img.url?.includes("res.cloudinary.com")) {
            const publicId = img.url.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`blogImages/${publicId}`).catch(console.warn);
          }
        }
      }
      // Upload new images
      const newImages = [];
      for (const [i, file] of req.files.images.entries()) {
        const url = await uploadFile(file.path, "blogImages");
        newImages.push({ url, isPrimary: i === 0 });
      }
      post.images = newImages;
      post.primaryImg = newImages[0]?.url || "";
      post.featuredImage = newImages[0]?.url || "";
    }

    if (req.files?.audio?.length) {
      if (post.audioUrl && post.audioUrl.includes("res.cloudinary.com")) {
        const publicId = post.audioUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`blogAudio/${publicId}`, { resource_type: "video" }).catch(console.warn);
      }
      post.audioUrl = await uploadFile(req.files.audio[0].path, "blogAudio", "video");
    }

    if (req.files?.video?.length) {
      if (post.videoUrl && post.videoUrl.includes("res.cloudinary.com")) {
        const publicId = post.videoUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`blogVideo/${publicId}`, { resource_type: "video" }).catch(console.warn);
      }
      post.videoUrl = await uploadFile(req.files.video[0].path, "blogVideo", "video");
    }

    // Set status
    post.status = "published";
    post.publishedByAdmin = true;
    await post.save();

    res.status(200).json({
      message: "Post published successfully",
      post,
    });

  } catch (err) {
    console.error("❌ Publish Post Error:", err);
    res.status(500).json({ message: "Failed to publish post", error: err.message });
  }
};



