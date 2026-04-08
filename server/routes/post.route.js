import express from "express";
import verifyUser from "../middlewares/verifyUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  create,
  deletePost,
  generateSignature,
  getPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyUser, isAdmin, create);
router.get("/sign-upload", verifyUser, generateSignature);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyUser, deletePost);

export default router;
