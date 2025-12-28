import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

const signUp = async (req, res, next) => {
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

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(createError(400, "All fields are required"));
  }

  const validUser = await User.findOne({ email });

  if (!validUser) {
    return next(createError(400, "Invalid credentials"));
  }

  const { password: hashedPassword, ...userDetails } = validUser._doc;

  const validPassword = await bcryptjs.compare(password, hashedPassword);

  if (!validPassword) {
    return next(createError(400, "Invalid credentials"));
  }

  const payload = {
    id: validUser._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5s" });

  res
    .status(200)
    .cookie("token", token, { httpOnly: true, maxAge: 5 * 1000 })
    .json({ userDetails });
};

export { signUp, signIn };
