import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import { create, generateSignature } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyUser, create);
router.get("/sign-upload", verifyUser, generateSignature);

export default router;
