// middleware/auth.middleware.js
// middleware/auth.middleware.js
// import jwt from "jsonwebtoken";
// import createError from "../utils/createError.js";
// import User from "../models/user.model.js";

// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    // get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.header("Authorization")?.startsWith("Bearer ")
        ? req.header("Authorization").replace("Bearer ", "")
        : null);

    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }

    // verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      return next(createError(401, "Invalid or expired token"));
    }

    // find the user in DB
    const user = await User.findById(payload.id).select("+password");
    if (!user) {
      return next(createError(401, "User not found"));
    }

    // attach to request object
    // store id as string for easier comparisons everywhere
    req.user = {
      id: String(user._id),
      username: user.username,
      role: user.role,
      isAdmin: user.isAdmin,
      isAuthor: user.isAuthor,
    };

    // keep full mongoose user if controllers need it
    req.currentUser = user;

    next();
  } catch (err) {
    next(createError(500, "Authentication middleware error"));
  }
};



/*
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next(createError(401, "Not authenticated"));

    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.user = payload;
    // optionally attach full user
    const user = await User.findById(payload.id).lean();
    if (!user) return next(createError(401, "User not found"));
    req.currentUser = user;
    next();
  } catch (err) {
    next(createError(401, "Invalid token"));
  }
};
*/
