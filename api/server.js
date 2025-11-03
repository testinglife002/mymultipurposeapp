// api/server.js
// api/server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

dotenv.config();
connectDB(); // assumes config/db.js exports an async connect function

const app = express();

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================
// Body parsers, cookies, proxy
// ========================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set("trust proxy", 1);

// ========================
// CORS: robust handling (preflight + error responses)
// ========================
// Build allowed origins (no trailing slashes)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,                      // e.g. https://mymultipurposeapp.vercel.app
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined // e.g. https://mymultipurposeapp.vercel.app
].filter(Boolean);

// Default CORS middleware (will call our origin function)
app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests (e.g., Postman, server-to-server) with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Id",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Always respond to OPTIONS preflight with proper headers (defensive)
app.options("*", (req, res) => {
  const origin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] ||
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(204);
});

// ========================
// Security & rate limiting
// ========================
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // adjust up for production traffic if needed
  })
);

// ========================
// Static files (uploads)
// ========================
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// ========================
// Routes (keep your imports/structure)
// ========================
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import appRoutes from "./routes/app.routes.js";
import categoryRoute from "./routes/category.routes.js";
import channelRoute from "./routes/channel.routes.js";
import postRoute from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import noteRoute from "./routes/note.routes.js";
import todoRoute from "./routes/todo.routes.js";
import taskRoute from "./routes/task.routes.js";
import boardRoute from "./routes/board.routes.js";
import listRoute from "./routes/list.routes.js";
import cardRoute from "./routes/card.routes.js";
import notificationRoute from "./routes/notification.routes.js";
import emailTemplateRoutes from "./routes/emailTemplateRoutes.js";
import textTemplateRoutes from "./routes/textTemplate.routes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import whatsappMessageRoutes from "./routes/whatsappMessageRoutes.js";
import whatsappSenderRoutes from "./routes/whatsappSender.routes.js";
import designRoutes from "./routes/designRoute.js";
import uploadRoutes from "./routes/upload.routes.js";
import uploadingRoutes from "./routes/uploads.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import ogRoutes from "./routes/ogRoutes.js";
import ogFetchRoutes from "./routes/ogFetchRoutes.js";
import sendPulseRoutes from "./routes/sendPulseRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/apps", appRoutes);
app.use("/api/categories", categoryRoute);
app.use("/api/channels", channelRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoutes);
app.use("/api/notes", noteRoute);
app.use("/api/todos", todoRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/boards", boardRoute);
app.use("/api/lists", listRoute);
app.use("/api/cards", cardRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/templates", emailTemplateRoutes);
app.use("/api/text-templates", textTemplateRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/whatsapp-messages", whatsappMessageRoutes);
app.use("/api/whatsapp-sender", whatsappSenderRoutes);
app.use("/api", designRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/upload", uploadingRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/og", ogRoutes);
app.use("/og", ogFetchRoutes);
app.use("/api/sendpulse", sendPulseRoutes);

// ========================
// Health check
// ========================
app.get("/", (req, res) => res.send("✅ MERN Backend is Live! API is running..."));

// ========================
// Serve client production build if present
// ========================
if (process.env.NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientPath));
  app.get("*", (req, res) => res.sendFile(path.join(clientPath, "index.html")));
}

// ========================
// Global error handler — ensure CORS headers on error responses
// ========================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err?.message || err);
  const origin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ success: false, status, message });
});

// ========================
// Start server
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV})`);
});
