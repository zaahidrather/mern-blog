import express from "express";
import {
  google,
  refreshToken,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", google);

router.post("/refresh", refreshToken);
export default router;
