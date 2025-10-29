// 1. /api/users endpoint

// controllers/user.controller.js

// controllers/user.controller.js
import User from "../models/user.model.js";
import createError from "../utils/createError.js";


// Return all users with only _id and email
// Return all users with _id, username, email
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id username email role isActive"); 
    // explicitly include _id, username, email

    // console.log("Users from DB:", users);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};





export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
};


export const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
}

// controllers/user.controller.js
export const getUserListButMe = async (req, res) => {
  try {
    // const users = await User.find({ _id: { $ne: req.user._id } })
    const users = await User.find({ _id: { $ne: req.userId } })  
      .select("username role email isActive");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


// controllers/user.controller.js
// import User from "../models/user.model.js";

// ✅ Get user's WhatsApp phone number
export const getUserPhone = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("phone username email");
    if (!user) return next(createError(404, "User not found"));

    // Return only what’s necessary
    res.status(200).json({
      username: user.username,
      phone: user.phone,
    });
  } catch (err) {
    next(err);
  }
};


