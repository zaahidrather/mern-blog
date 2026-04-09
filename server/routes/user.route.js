import express from "express";
import {
  test,
  updateProfile,
  deleteUser,
  signout,
  getUsers,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyUser from "../middlewares/verifyUser.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/test", test);
router.patch(
  "/update/:userId",
  verifyUser,
  upload.single("profileImage"),
  updateProfile,
);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.get("/getusers", verifyUser, isAdmin, getUsers);
router.post("/signout", signout);

export default router;
