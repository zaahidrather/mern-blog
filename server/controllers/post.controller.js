import Post from "../models/post.model.js";
import { createError } from "../utils/error.js";
import { v2 as cloudinary } from "cloudinary";

export const create = async (req, res, next) => {
  // console.log("Create post body", req.body);
  if (!req.user.isAdmin) {
    return next(createError(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(createError(400, "Please provide all required fields"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
    category: "uncategorized",
    image:
      req.body.secure_url ||
      "https://www.pexels.com/photo/grass-hill-under-a-clear-blue-sky-16452613/",
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// Generating signature for cloudinary signed upload (required on frontend)
export const generateSignature = (req, res, next) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = req.query.folder || "mern-blog/posts";
  // The signature must include all parameters you plan to send from the frontend
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET, // Using the secret already configured above
  );
  // console.log("Signature........", signature);
  res.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
};
