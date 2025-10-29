// server/controllers/note.controller.js
import Note from "../models/note.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { pushNotification } from "../utils/pushNotification.js";

// Configure Cloudinary (if env set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility to format notes consistently
const formatNotes = (notes, userId) => {
  return notes.map((note) => {
    const n = note.toObject ? note.toObject() : note;
    // support both populated createdBy (object) and raw ObjectId
    const createdById = (note.createdBy && note.createdBy._id) ? note.createdBy._id : note.createdBy;
    return {
      ...n,
      canEdit: String(createdById) === String(userId),
      isCopy: !!n.sharedOriginal,
    };
  });
};

/* ---------------------------- USERS (helper) ---------------------------- */
// Get all users except current user
export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    const users = await User.find({ _id: { $ne: currentUserId } }).select("username email role isAdmin");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};


// POST /notes/users-by-ids
export const getUsersByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const users = await User.find({ _id: { $in: ids } })
      .select("_id username email");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




/* ------------------------------- READ ---------------------------------- */
/**
 * listNotes (legacy / general): own + public + sharedWithMe
 * kept for backward compatibility with your routes
 */
export const listNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [own, publicNotes, sharedWithMe] = await Promise.all([
      Note.find({ createdBy: userId }).populate("createdBy", "username").populate("project", "name"),
      Note.find({ isPublic: true }).populate("createdBy", "username").populate("project", "name"),
      Note.find({ sharedWith: userId }).populate("createdBy", "username").populate("project", "name"),
    ]);

    const map = new Map();
    [...own, ...publicNotes, ...sharedWithMe].forEach((n) => map.set(String(n._id), n));
    const notes = Array.from(map.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((note) => {
        const n = note.toObject();
        // createdUsername fallback
        n.createdUsername = note.createdBy?.username || n.createdUsername || "Unknown";
        return n;
      });

    res.json(notes);
  } catch (e) {
    console.error("Error listing notes:", e);
    res.status(500).json({ message: e.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notes = await Note.find({
      $or: [{ createdBy: userId }, { isPublic: true }, { sharedWith: userId }],
    })
      .populate("project", "name")
      .populate("createdBy", "_id username email")
      .populate("sharedOriginal", "title createdBy")
      .populate("copiedFrom", "_id username email")
      .populate("sharedWith", "_id username email");


    const notesWithFlags = notes.map((note) => {
      const obj = note.toObject();
      const createdById = (note.createdBy && note.createdBy._id) ? note.createdBy._id : note.createdBy;
      obj.canEdit = String(createdById) === String(userId);
      obj.isCopy = !!note.sharedOriginal;
      return obj;
    });

    res.json(notesWithFlags);
  } catch (err) {
    console.error("Error getting notes:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ------------------------------- CREATE -------------------------------- */
export const createNote = async (req, res) => {
  console.log("Reached createNote"); // <--- temporary debug
  console.log("Authenticated user:", req.user);

  try {
    const userId = req.user?.id;
    const username = req.user?.username || "";
    const {
      title,
      projectId = null,
      blocks = [],
      isPublic = false,
      tags = [],
      sharedWith = [],
    } = req.body;

    console.log(req.body)
    console.log("Incoming createNote payload:", req.body);


    if (!userId) return res.status(401).json({ message: "Authentication required" });
    // if (!title || !Array.isArray(blocks) || blocks.length === 0) {
    //   return res.status(400).json({ message: "Title and content blocks are required." });
    // }

    if (!title) {
       return res.status(400).json({ message: "Title blocks are required." });
     }

     if (!Array.isArray(sharedWith)) note.sharedWith = [];


    const note = await Note.create({
      title,
      project: projectId || null,
      blocks,
      isPublic,
      tags,
      createdBy: userId,
      createdUsername: username,
      sharedOriginal: null,
      copiedFrom: null,
      sharedWith, // save sharedWith properly
    });

    // Push notification to shared users
    // inside createNote (after creating the note)
    if (sharedWith.length > 0) {
      try {
        const sharedUsers = await User.find({ _id: { $in: sharedWith } }).select("username");
        const sharedUsernames = sharedUsers.map(u => u.username).join(", ");

        // Notification to creator
        await pushNotification({
          actor: userId,
          user: userId,
          type: "note_shared_self",
          title: `You shared a note "${title}"`,
          message: `📝 You shared a new note "${title}" with ${sharedUsernames}.`,
          referenceId: note._id,
          url: `/notes/${note._id}`,
        });

        // Notification to each shared user
        await pushNotification({
          actor: userId,
          userIds: sharedWith,
          type: "note_shared_with_user",
          title: `New note shared with you`,
          message: `📝 ${username} shared a new note "${title}" with you.`,
          referenceId: note._id,
          url: `/notes/${note._id}`,
        });
      } catch (pushErr) {
        console.error("Push notification failed (createNote sharedWith):", pushErr);
      }
    } else {
      // If no sharing, only notify self about creation
      try {
        await pushNotification({
          actor: userId,
          user: userId,
          type: "note_created",
          title: `Note "${title}" created`,
          message: `📝 You created a new note "${title}".`,
          referenceId: note._id,
          url: `/notes/${note._id}`,
        });
      } catch (pushErr) {
        console.error("Push notification failed (createNote self):", pushErr);
      }
    }

    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: err.message });
  }
};



/* ------------------------------- GET single ----------------------------- */
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const note = await Note.findById(id)
      .populate("project", "name")
      .populate("createdBy", "_id username email")
      .populate("sharedWith", "_id username email") // ✅ add this
      .populate("sharedOriginal", "title createdBy");

    if (!note) return res.status(404).json({ message: "Not found" });

    const createdById = (note.createdBy && note.createdBy._id) ? String(note.createdBy._id) : String(note.createdBy);
    const sharedWithIds = (note.sharedWith || []).map(String);

    const allowed = createdById === String(userId) || note.isPublic || sharedWithIds.includes(String(userId));
    if (!allowed) return res.status(403).json({ message: "Forbidden" });

    const noteObj = note.toObject();
    noteObj.canEdit = createdById === String(userId);
    noteObj.isCopy = !!note.sharedOriginal;

    res.json(noteObj);
  } catch (err) {
    console.error("Error fetching single note:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId).populate("createdBy", "_id username");
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error("Error in getNoteById:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ------------------------------- ALL / FILTERED ------------------------- */
export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notes = await Note.find({
      $or: [{ createdBy: userId }, { isPublic: true }, { sharedWith: userId }],
    })
      .populate("createdBy", "_id username email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(formatNotes(notes, userId));
  } catch (err) {
    console.error("Error getAllNotes:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notes = await Note.find({ createdBy: userId })
      .populate("createdBy", "_id username email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(formatNotes(notes, userId));
  } catch (err) {
    console.error("Error getMyNotes:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getPublicNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notes = await Note.find({ isPublic: true })
      .populate("createdBy", "_id username email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(formatNotes(notes, userId));
  } catch (err) {
    console.error("Error getPublicNotes:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getCopiedNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notes = await Note.find({ createdBy: userId, sharedOriginal: { $ne: null } })
      .populate("createdBy", "_id username email")
      .populate("project", "name")
      .populate("sharedOriginal", "title createdBy")
      .sort({ createdAt: -1 });

    res.json(formatNotes(notes, userId));
  } catch (err) {
    console.error("Error getCopiedNotes:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getSharedWithMeNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notes = await Note.find({ sharedWith: userId })
      .populate("createdBy", "_id username email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(formatNotes(notes, userId));
  } catch (err) {
    console.error("Error getSharedWithMeNotes:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getNotesByProject = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;

    const notes = await Note.find({
      project: projectId,
      $or: [{ createdBy: userId }, { isPublic: true }, { sharedWith: userId }],
    })
      .populate("createdBy", "_id username email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(formatNotes(notes, userId));
  } catch (err) {
    console.error("Error getNotesByProject:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ------------------------------- UPDATE --------------------------------- */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const {
      title,
      projectId = "",
      blocks = [],
      isPublic = false,
      tags = [],
      sharedWith = [], // <-- properly accept updated sharedWith
    } = req.body;

    console.log(req.body);

    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const note = await Note.findById(id).populate("createdBy", "_id username");
    if (!note) return res.status(404).json({ message: "Note not found" });

    const canEdit = String(note.createdBy._id) === String(userId);
    if (!canEdit) return res.status(403).json({ message: "Forbidden: not your note" });

    if (title !== undefined) note.title = title;
    note.project = projectId || null;
    if (Array.isArray(blocks) && blocks.length) note.blocks = blocks;
    if (Array.isArray(tags)) note.tags = tags;
    note.isPublic = typeof isPublic === "boolean" ? isPublic : note.isPublic;

    // Update sharedWith properly
    if (Array.isArray(sharedWith)) {
      const cleanIds = sharedWith.map(u => (typeof u === "object" ? u.value : u));
      note.sharedWith = Array.from(new Set(cleanIds.map(String)));
    }


    console.log("Updating sharedWith:", sharedWith);
    

    await note.save();

    // Notify all shared users
    if (note.sharedWith?.length > 0) {
      try {
        const sharedUsers = await User.find({ _id: { $in: note.sharedWith } }).select("username");
        const sharedUsernames = sharedUsers.map(u => u.username).join(", ");

        // Notify creator (self)
        await pushNotification({
          actor: userId,
          user: userId,
          type: "note_updated_self",
          title: `You updated a shared note`,
          message: `📝 You updated the note "${note.title}" shared with ${sharedUsernames}.`,
          referenceId: note._id,
          url: `/notes/${note._id}`,
        });

        // Notify shared users
        await pushNotification({
          actor: userId,
          userIds: note.sharedWith,
          type: "note_updated_shared",
          title: `Shared note updated`,
          message: `📝 ${note.createdBy.username} updated the shared note "${note.title}".`,
          referenceId: note._id,
          url: `/notes/${note._id}`,
        });
      } catch (pushErr) {
        console.error("Push notification (updateNote) failed:", pushErr);
      }
    }


    const noteObj = note.toObject();
    noteObj.canEdit = canEdit;
    res.json(noteObj);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: err.message });
  }
};



/* ------------------------------- DELETE --------------------------------- */
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const note = await Note.findById(id).populate("createdBy", "_id username");
    if (!note) return res.status(404).json({ message: "Note not found" });

    const canEdit = String(note.createdBy._id) === String(userId);
    if (!canEdit) return res.status(403).json({ message: "Forbidden: not your note" });

    await Note.findByIdAndDelete(id);

    if (note.sharedWith?.length > 0) {
      try {
        await pushNotification({
          actor: userId,
          userIds: note.sharedWith,
          type: "note_deleted",
          title: `Note "${note.title}" deleted`,
          message: `🗑️ The shared note "${note.title}" has been deleted.`,
          referenceId: note._id,
        });
      } catch (pushErr) {
        console.error("Push notification (deleteNote) failed:", pushErr);
      }
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

/* ------------------------------- SHARE ---------------------------------- */
/* ---------------- SHARE ---------------- */
export const shareNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetUserIds } = req.body;
    const userId = req.user?.id;

    if (!Array.isArray(targetUserIds) || targetUserIds.length === 0)
      return res.status(400).json({ message: "No users selected" });

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (String(note.createdBy) !== String(userId)) return res.status(403).json({ message: "Forbidden" });

    note.sharedWith = Array.from(new Set([...(note.sharedWith || []), ...targetUserIds]));
    await note.save();

    await pushNotification({
      actor: userId,
      userIds: targetUserIds,
      type: "note_shared_with_user",
      title: "Note shared",
      message: `📝 ${req.user?.username} shared "${note.title}" with you.`,
      referenceId: note._id,
      url: `/notes/${note._id}`,
    });

    res.json({ message: "Note shared successfully", note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------------------- COPY ----------------------------------- */
export const copyNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const original = await Note.findById(id).populate("createdBy", "_id username");
    if (!original) return res.status(404).json({ message: "Note not found" });

    const newNote = new Note({
      title: original.title,
      project: original.project,
      blocks: original.blocks,
      isPublic: false,
      createdBy: userId,
      createdUsername: req.user.username || "",
      tags: original.tags,
      sharedOriginal: original._id,
      copiedFrom: original.createdBy,
      sharedWith: [],
    });

    await newNote.save();

    // notify original author asynchronously
    try {
      if (String(original.createdBy._id) !== String(userId)) {
        await pushNotification({
          actor: userId,
          user: original.createdBy._id,
          type: "note_copied",
          title: `Your note "${original.title}" was copied`,
          message: `📋 ${req.user?.username || "Someone"} made a copy of your note "${original.title}".`,
          referenceId: newNote._id,
          url: `/notes/${newNote._id}`,
        });
      }
    } catch (pushErr) {
      console.error("Push notification (copyNote) failed:", pushErr);
    }

    const noteObj = newNote.toObject();
    noteObj.canEdit = true;

    res.status(201).json(noteObj);
  } catch (err) {
    console.error("Error copying note:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ------------------------------- UPLOADS -------------------------------- */
export const uploadNoteImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: 0, message: "No file uploaded" });

    let fileUrl;

    if (process.env.USE_CLOUDINARY === "true") {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "notes",
        resource_type: "image",
      });
      fileUrl = result.secure_url;
      await fs.promises.unlink(req.file.path).catch(() => {});
    } else {
      fileUrl = `/public/uploads/notes/${req.file.filename}`;
    }

    res.json({
      success: 1,
      file: {
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error("Error uploading note image:", error);
    if (req.file) await fs.promises.unlink(req.file.path).catch(() => {});
    res.status(500).json({ success: 0, message: "Upload failed" });
  }
};

export const uploadNoteFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: 0, message: "No file uploaded" });

    let fileUrl;

    if (process.env.USE_CLOUDINARY === "true") {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "notes/files",
        resource_type: "raw",
      });
      fileUrl = result.secure_url;
      await fs.promises.unlink(req.file.path).catch(() => {});
    } else {
      fileUrl = `/public/uploads/notes/${req.file.filename}`;
    }

    res.json({
      success: 1,
      file: {
        url: fileUrl,
        name: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Error uploading note file:", error);
    if (req.file) await fs.promises.unlink(req.file.path).catch(() => {});
    res.status(500).json({ success: 0, message: "Upload failed" });
  }
};



/**
 * POST /notes/fetch-url
 * Fetch webpage metadata for Editor.js LinkTool preview
 */
export const fetchUrl = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: 0, message: "Missing URL" });

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const getMeta = (name) =>
      $(`meta[property='${name}']`).attr("content") ||
      $(`meta[name='${name}']`).attr("content");

    const data = {
      success: 1,
      meta: {
        title: getMeta("og:title") || $("title").text() || url,
        description: getMeta("description") || getMeta("og:description") || "",
        image: { url: getMeta("og:image") || "" },
      },
    };

    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching URL preview:", err.message);
    res.json({ success: 0 });
  }
};


