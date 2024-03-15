import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

const router = express.Router();
router.post("/", isAuthenticated, isAdmin, createCategory);
router.put("/:categoryId", isAuthenticated, isAdmin, updateCategory);
router.delete("/:categoryId", isAuthenticated, isAdmin, deleteCategory);
router.get("/categories", listCategory);
router.get("/:id", readCategory);

export default router;
