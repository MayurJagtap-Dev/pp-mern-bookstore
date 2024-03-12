import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", createUser);
router.get("/", isAuthenticated, isAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);
router.get("/:id", isAuthenticated, isAdmin, getUserById);
router.put("/:id", isAuthenticated, isAdmin, updateUserById);
router.delete("/:id", isAuthenticated, isAdmin, deleteUserById);

export default router;
