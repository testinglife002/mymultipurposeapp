// /models/designModel.js
import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    components: {
        type: Array,
        default: [] // e.g., "created", "moved", "commented on"
    },
    image_url: {
        type: String,
        default: '' // e.g., "created", "moved", "commented on"
    },
}, { timestamps: true });

const Design = mongoose.model('Design', designSchema);
 export default Design;