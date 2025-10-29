// middleware/uploading.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "my_design_app", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const uploading = multer({ storage });

export default uploading;
