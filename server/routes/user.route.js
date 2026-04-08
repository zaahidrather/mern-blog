import express from "express";
import {
  test,
  updateProfile,
  deleteUser,
  signout,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyUser from "../middlewares/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.patch(
  "/update/:userId",
  verifyUser,
  upload.single("profileImage"),
  updateProfile,
);

router.delete("/delete/:userId", verifyUser, deleteUser);

router.post("/signout", signout);

export default router;
