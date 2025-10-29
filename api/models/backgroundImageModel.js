// /models/backgroundImageModel.js
import mongoose from "mongoose";

const backgroundImageSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
        // default: '' // e.g., "created", "moved", "commented on"
    },
}, { timestamps: true });

const BackgroundImage = mongoose.model('BackgroundImage', backgroundImageSchema);
 export default BackgroundImage;