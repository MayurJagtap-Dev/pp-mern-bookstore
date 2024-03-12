import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";
import bcrypt from "bcryptjs";

export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    }).select("-password");
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    createToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res
    .clearCookie("ecomm_jwt")
    .status(200)
    .json({ message: "User logged out successfully" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }
  const updatedUser = await user.save().select("-password");
  res.status(200).json(updatedUser);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

export const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;
  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }
  const updatedUser = await user.save().select("-password");
  res.status(200).json(updatedUser);
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error("Admin cannot be deleted");
  }
  await User.deleteOne({ _id: user._id });
  res.status(200).json({ message: "User deleted successfully" });
});
