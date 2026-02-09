import User from "../models/user.model.js";
import { createError } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const test = (req, res) => {
  res.json({
    message: "API is working",
  });
};

export const updateProfile = async (req, res, next) => {
  const updateData = {};

  if (req.user.id !== req.params.userId) {
    return next(createError(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(createError(400, "Password must be at least 6 characters"));
    }
    updateData.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        createError(400, "Username must be between 7 and 20 characters"),
      );
    }
    if (req.body.username.includes(" ")) {
      return next(createError(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(createError(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        createError(400, "Username can only contain letters and numbers"),
      );
    }
    updateData.username = req.body.username;
  }

  if (req.body.email) {
    updateData.email = req.body.email;
  }

  try {
    // Check if there is actually anything to update
    if (Object.keys(updateData).length === 0 && !req.file) {
      return next(createError(400, "No changes provided"));
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    let oldPublicId = user.avatar?.public_id;

    // 2. Handle avatar if exists
    if (req.file) {
      // Upload new avatar
      const uploaded = await uploadOnCloudinary(req.file.path);

      if (!uploaded) {
        console.log("Not uploaded");
        return next(createError(500, "Image upload failed"));
      }
      console.log("Uploaded");
      updateData.avatar = {
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };

      console.log("updateData", updateData);
    }

    // 3. Update only changed fields
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true },
    ).select("-password");
    console.log("After upload image , old public_id", oldPublicId);
    console.log("After upload image , updatedUser", updatedUser);

    // Send the SUCCESS response immediately
    res.status(200).json(updatedUser);
    // Delete old avatar AFTER DB update succeeds
    if (req.file && oldPublicId) {
      try {
        await deleteFromCloudinary(oldPublicId);
        console.log("Old image deleted successfully");
      } catch (err) {
        console.error("Cleanup Error (Old image not deleted):", err.message);
      }
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(createError(403, "You are not allowed to delete this user"));
  }

  try {
    // 1. Find the user first to get the public_id
    const user = await User.findById(req.params.userId);
    if (!user) return next(createError(404, "User not found"));

    // 2. If user has an avatar, delete it from Cloudinary
    if (user.avatar && user.avatar.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

    // 3. Delete the user from MongoDB
    await User.findByIdAndDelete(req.params.userId);

    // 4. Clear the cookie so they are logged out
    res.clearCookie("access_token").status(200).json("User has been deleted.");
  } catch (error) {
    return next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};
