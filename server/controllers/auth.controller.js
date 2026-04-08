import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { devLogger } from "../utils/logger.js";
import admin from "../firebaseAdmin.js";

// --------------- @SIGN_UP ------------------

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(createError(400, "All fields are required"));
  }
  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(createError(409, `${field} already exists`));
    }
    next(error);
  }
};

// ------------------ @SIGN_IN ------------------------

export const signIn = async (req, res, next) => {
  // console.log("Inside SignIn controller");
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(createError(400, "All fields are required"));
  }

  // Check email
  const validUser = await User.findOne({ email });

  if (!validUser) {
    return next(createError(400, "Invalid credentials"));
  }

  // Strip sensitive info
  const {
    password: hashedPassword,
    refreshToken: token,
    ...rest
  } = validUser.toObject();

  // Check password
  const validPassword = await bcryptjs.compare(password, hashedPassword);
  if (!validPassword) {
    return next(createError(400, "Invalid credentials"));
  }

  const payload = {
    id: validUser._id,
    isAdmin: validUser.isAdmin,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m", // Short-lived
  });

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }, // Long-lived
  );

  // Hashing token before saving to db
  const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
  validUser.refreshToken = hashedRefreshToken;
  await validUser.save();

  res
    .status(200)
    .cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(rest);
};

// ------------------ @GOOGLE_SIGN_UP_SIGN_IN ------------------------
export const google = async (req, res, next) => {
  // const { name, email, googlePhotoURL } = req.body;
  try {
    const { idToken } = req.body;
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not found
      const generatedPassword = Math.random().toString(36).slice(-16);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      user = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        avatar: picture,
      });
      await user.save();
    }

    // --- Token Generation ---
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // Save hashed version to DB
    user.refreshToken = await bcryptjs.hash(refreshToken, 10);
    await user.save();

    // Strip sensitive info
    const userObject = user.toObject();
    const { password, refreshToken: unused, ...rest } = userObject;

    res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, // 15 mins
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// -------------------- Refresh token ----------------------
export const refreshToken = async (req, res, next) => {
  const token = req.cookies.refresh_token;

  if (!token) return next(createError(401, "You are not authenticated!"));

  try {
    // 1. Verify the JWT signature
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 2. Find user and get the HASHED refresh token from DB
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshToken)
      return next(createError(403, "Token is invalid!"));

    // 3. Compare plain-text cookie token with hashed DB token
    const isMatch = await bcryptjs.compare(token, user.refreshToken);
    if (!isMatch) return next(createError(403, "Token mismatch."));

    // 4. Generate a fresh Access Token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15s" },
    );

    // 5. Send new access token as cookie
    res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .json({ success: true });
  } catch (err) {
    next(err);
  }
};
