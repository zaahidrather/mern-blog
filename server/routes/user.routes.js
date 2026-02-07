import express from "express";
import { test, updateProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/test", test);

router.patch(
  "/profile",
  verifyToken,
  upload.single("profileImage"),
  updateProfile,
);

export default router;
