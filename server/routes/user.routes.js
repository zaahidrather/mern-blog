import express from "express";
import {
  test,
  updateProfile,
  deleteUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/test", test);

router.patch(
  "/update/:userId",
  verifyToken,
  upload.single("profileImage"),
  updateProfile,
);

router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
