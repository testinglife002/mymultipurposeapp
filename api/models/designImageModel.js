// /models/designImageModel.js
import mongoose from "mongoose";

const designImageSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
        // default: '' // e.g., "created", "moved", "commented on"
    },
}, { timestamps: true });

const DesignImage = mongoose.model('DesignImage', designImageSchema);
 export default DesignImage;