// server/models/board.model.js
import mongoose from "mongoose";

const boardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from both ends of a string
        minlength: 1,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    background: {
        type: String, // Can be a URL for an image or a hex color code
        default: '#0079BF' // Default Trello blue
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User who created the board
        ref: 'User',
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId, // Array of Users who are members of this board
            ref: 'User'
        }
    ],
    // 'lists' will store ObjectIds of List documents.
    // When querying a Board, you can populate this field to get the actual List documents.
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List'
        }
    ],
    activity: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
        }
    ],
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Board = mongoose.model('Board', boardSchema);

 export default Board;
