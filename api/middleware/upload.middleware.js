// ### backend/middleware/upload.middleware.js
import multer from 'multer';


// use memory storage and stream to Cloudinary (no local disk)
const storage = multer.memoryStorage();
export const upload = multer({ storage });
