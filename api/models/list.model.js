// server/models/list.model.js
import mongoose from "mongoose";

const listSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    board: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Board this list belongs to
        ref: 'Board',
        required: true
    },
    // 'cards' will store ObjectIds of Card documents.
    // When querying a List, you can populate this field to get the actual Card documents.
    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card'
        }
    ],
    order: {
        type: Number, // Used for ordering lists within a board (e.g., 0, 1, 2...)
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

export default mongoose.model('List', listSchema);

// export default List;
