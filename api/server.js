// api/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";


dotenv.config();
connectDB();

const app = express();

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// app.use(express.json());
app.use(express.json({ limit: "10mb" })); // for exported base64 payload // handle large editor.js payload
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set("trust proxy", 1); // if behind proxy like Render


import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import appRoutes from "./routes/app.routes.js";
import categoryRoute from './routes/category.routes.js';
import channelRoute from './routes/channel.routes.js';
import postRoute from './routes/post.routes.js';
import commentRoutes from "./routes/comment.routes.js";
import noteRoute from './routes/note.routes.js';
import todoRoute from './routes/todo.routes.js';
import taskRoute from './routes/task.routes.js';
import boardRoute from './routes/board.routes.js';
import listRoute from './routes/list.routes.js';
import cardRoute from './routes/card.routes.js';
import notificationRoute from './routes/notification.routes.js';

import emailTemplateRoutes from "./routes/emailTemplateRoutes.js";
import textTemplateRoutes from './routes/textTemplate.routes.js';

import newsletterRoutes from "./routes/newsletterRoutes.js";

import whatsappRoutes from "./routes/whatsapp.routes.js";
import whatsappMessageRoutes from "./routes/whatsappMessageRoutes.js";
import whatsappSenderRoutes from "./routes/whatsappSender.routes.js";

import designRoutes from './routes/designRoute.js';

import uploadRoutes from "./routes/upload.routes.js";
import uploadingRoutes from "./routes/uploads.routes.js";
import bannerRoutes from "./routes/banner.routes.js";

import ogRoutes from "./routes/ogRoutes.js";
import ogFetchRoutes from "./routes/ogFetchRoutes.js";

import sendPulseRoutes from "./routes/sendPulseRoutes.js";




// CORS: allow localhost during dev and the CLIENT_URL / VERCEL url in production
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);
if (process.env.VERCEL_URL) {
  // Vercel provides VERCEL_URL without protocol; accept https
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // for Postman or server-to-server requests
    if(allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


/*
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});
*/

app.use(helmet());

// Rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});
app.use(limiter);

// serve static uploaded banners folder
// app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// serve uploaded static files (if you keep uploads in api/public/uploads)
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/apps", appRoutes);
app.use('/api/categories', categoryRoute);
app.use("/api/channels", channelRoute);
app.use('/api/posts', postRoute);
app.use("/api/comments", commentRoutes);
app.use('/api/notes', noteRoute);
app.use('/api/todos', todoRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/boards', boardRoute);
app.use('/api/lists', listRoute);
app.use('/api/cards', cardRoute);
app.use('/api/notifications', notificationRoute);

app.use("/api/templates", emailTemplateRoutes);
// routes
app.use('/api/text-templates', textTemplateRoutes);


app.use("/api/newsletter", newsletterRoutes);

// Routes
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/whatsapp-messages", whatsappMessageRoutes);
// ✅ WhatsApp route
app.use("/api/whatsapp-sender", whatsappSenderRoutes);


app.use('/api', designRoutes );


app.use("/api/uploads", uploadRoutes);
app.use("/api/upload", uploadingRoutes);
app.use("/api/banner", bannerRoutes);


app.use("/og", ogRoutes); // ✅ OG meta route
app.use("/og", ogFetchRoutes);


// API routes
app.use('/api/sendpulse', sendPulseRoutes);



// Default status check
// app.get('/', (req, res) => {
//  res.send('MERN Backend is Live! API is running...');
// });

// health check
app.get("/", (req, res) => res.send("MERN Backend is Live! API is running..."));


// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ success: false, status, message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
