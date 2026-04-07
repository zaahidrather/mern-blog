import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import {
  create,
  generateSignature,
  getposts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyUser, create);
router.get("/sign-upload", verifyUser, generateSignature);
router.get("/getposts", getposts);

export default router;
