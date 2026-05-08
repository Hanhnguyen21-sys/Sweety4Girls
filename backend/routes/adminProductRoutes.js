import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

// all routes below require admin token
router.use(protectAdmin);

router.post("/", upload.array("images", 5), createProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

export default router;