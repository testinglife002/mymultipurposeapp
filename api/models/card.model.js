// server/models/card.model.js
import mongoose from "mongoose";


// Sub-schema for checklist items
const checklistItemSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Sub-schema for checklists
const checklistSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    items: [checklistItemSchema] // Array of checklist items
});

// Sub-schema for comments
const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User who made the comment
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Sub-schema for attachments
const attachmentSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String, // URL where the file is stored (e.g., Cloudinary URL, local server URL)
        required: true
    },
    mimetype: {
        type: String // e.g., 'image/jpeg', 'application/pdf'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const cardSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    list: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the List this card belongs to
        ref: 'List',
        required: false
    },
    board: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Board this card belongs to (for easier querying)
        ref: 'Board',
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId, // Array of Users assigned to this card
            ref: 'User'
        }
    ],
    // labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    labels: [
        {
            type: String, // e.g., ['Urgent', 'Bug', 'Feature', 'Documentation']
            trim: true
        }
    ],
    dueDate: {
        type: Date // Optional due date for the card
    },
    completed: {
        type: Boolean, // Indicates if the card itself is considered 'completed'
        default: false
    },
    attachments: [attachmentSchema], // Array of attachment sub-documents
    checklists: [checklistSchema],   // Array of checklist sub-documents
    comments: [commentSchema],       // Array of comment sub-documents
    order: {
        type: Number, // Used for ordering cards within a list
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Card = mongoose.model('Card', cardSchema);
export default Card;
// module.exports = Card;
