// controllers/auth.controller.js
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendingVerifyEmail } from "../utils/sendingVerifyEmail.js";





const VERIFICATION_TTL_MS = 10 * 60 * 1000; // 10 min

export const register = async (req, res, next) => {
  try {
    const { username, email, password, img, isAuthor, role, phone } = req.body;

    if (!username || !email || !password) {
      return next(createError(400, "username, email and password are required"));
    }

    if (phone && !/^\+?\d{10,15}$/.test(phone)) {
      return next(createError(400, "Invalid phone number format"));
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] }).lean();
    if (existing) return next(createError(400, "User with that email/username already exists"));

    const hash = bcrypt.hashSync(password, 10);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpires = new Date(Date.now() + VERIFICATION_TTL_MS);

    const userRole = role || (isAuthor ? "author" : "user");

    const user = new User({
      username,
      email,
      password: hash,
      phone: phone || "",
      img: img || "",
      isAuthor: !!isAuthor,
      role: userRole,
      isAdmin: userRole === "admin",
      verifyCode,
      verifyCodeExpires,
      isVerified: false,
    });

    await user.save();

    // ✅ SendPulse REST API call wrapped in safe try-catch
    try {
      await sendingVerifyEmail(email, verifyCode);
      console.log(`✅ SendPulse: verification email sent → ${email}`);
    } catch (mailErr) {
      console.error("❌ SendPulse failed to send verification:", mailErr.message);
    }

    res.status(201).json({
      message: "User created. Check email for verification code.",
      email,
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    next(err);
  }
};



export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(createError(400, "Email required"));

    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));
    if (user.isVerified) return next(createError(400, "Already verified"));

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCodeExpires = new Date(Date.now() + VERIFICATION_TTL_MS);
    user.verifyCode = verifyCode;
    await user.save();

    try {
      await sendingVerifyEmail(email, verifyCode);
      console.log(`✅ Resent verification code → ${email}`);
    } catch (mailErr) {
      console.error("❌ Failed to resend verification:", mailErr.message);
    }

    res.status(200).json({ message: "Verification code resent" });

  } catch (err) {
    console.error("❌ resendVerification error:", err);
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return next(createError(400, "Email and code required"));

    const user = await User.findOne({ email }).select("+verifyCode +verifyCodeExpires");
    if (!user) return next(createError(404, "User not found"));
    if (user.isVerified) return next(createError(400, "Email already verified"));

    if (!user.verifyCode || user.verifyCode !== code)
      return next(createError(400, "Invalid verification code"));

    if (user.verifyCodeExpires && user.verifyCodeExpires < new Date())
      return next(createError(400, "Verification code expired"));

    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    
    // console.log("Login payload:", req.body);  // 👈 log incoming data
    const { email, password } = req.body;
    if (!email || !password) return next(createError(400, "Email and password required"));

    const user = await User.findOne({ email }).select("+password");
    // console.log("Found user:", user);         // 👈 log user fetched
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong email or password"));

    if (!user.isVerified) return next(createError(403, "Email not verified. Please verify your account."));

    const token = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin,
      isAuthor: user.isAuthor,
      role: user.role,
    }, process.env.JWT_KEY, { expiresIn: "7d" });

     console.log("Signed JWT:", token);


    const { password: pwd, ...info } = user._doc || user;

    console.log(info);

    /*
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "none", // or "lax" if front and back are on same origin
      secure: process.env.NODE_ENV === "production",
    });
    */

    // console.log("Cookies:", req.cookies);
    res.status(200).json({ user: info, token });


  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    // ✅ Clear token cookie if used
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ Just respond success (since JWT is stateless)
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};




export const getCurrentUser = async (req, res) => {
  try {
    // ✅ Read JWT token from cookies or header
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) return res.status(401).json({ message: "No active session" });

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Return user data
    res.status(200).json(user);
  } catch (err) {
    console.error("Error verifying session:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};





