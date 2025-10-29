// /models/userImageModel.js
import mongoose from "mongoose";

const userImageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    image_url: {
        type: String,
        required: true
        // default: '' // e.g., "created", "moved", "commented on"
    },
}, { timestamps: true });

const UserImage = mongoose.model('UserImage', userImageSchema);
 export default UserImage;