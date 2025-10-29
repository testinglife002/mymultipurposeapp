// src/models/note.model.js
import mongoose from 'mongoose';


const BlockSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },  // "paragraph", "header", etc.
    data: { type: Object, required: true },  // flexible: text, level, items, url
    tunes: { type: Object }                  // optional editor plugins like alignment
  },
  { _id: false }
);


const noteSchema = new mongoose.Schema(
{
    title: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
    blocks: [BlockSchema],   // ✅ full editor.js blocks
    isPublic: { type: Boolean, default: false },
    createdBy:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdUsername: { type: String, default: '' },
    tags: [{ type: String }],
    // 🆕 Copying support
    sharedOriginal: { type: mongoose.Schema.Types.ObjectId, ref: "Note", default: null }, // original note id
    copiedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // who copied it
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    },
    { timestamps: true }
);


const Note = mongoose.model('Note', noteSchema);
export default Note;
