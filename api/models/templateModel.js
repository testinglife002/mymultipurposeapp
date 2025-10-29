// /models/templateModel.js
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    components: {
        type: Array,
        default: [] // e.g., "created", "moved", "commented on"
    },
    image_url: {
        type: String,
        default: '' // e.g., "created", "moved", "commented on"
    },
}, { timestamps: true });

const Template = mongoose.model('Template', templateSchema);
 export default Template;