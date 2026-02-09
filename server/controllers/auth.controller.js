import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { devLog } from "../utils/logger.js";
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

  const validUser = await User.findOne({ email });

  if (!validUser) {
    return next(createError(400, "Invalid credentials"));
  }

  const { password: hashedPassword, ...rest } = validUser._doc;

  const validPassword = await bcryptjs.compare(password, hashedPassword);

  if (!validPassword) {
    return next(createError(400, "Invalid credentials"));
  }

  const payload = {
    id: validUser._id,
    isAdmin: validUser.isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .cookie("access_token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
    .json(rest);
};

// ------------------ @GOOGLE_SIGN_UP_SIGN_IN ------------------------

export const google = async (req, res, next) => {
  // const { name, email, googlePhotoURL } = req.body;
  try {
    const { idToken } = req.body;
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decoded;

    const user = await User.findOne({ email });

    // If user exists in db -> Sign in
    if (user) {
      devLog("google api -> user already existing branch");
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        })
        .json(rest);
    } else {
      // If user doesn't exist -> create one
      devLog("google api -> create new user branch");

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4), // split to last 4
        email,
        password: hashedPassword,
        avatar: picture,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser.id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
