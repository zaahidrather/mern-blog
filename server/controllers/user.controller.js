import User from "../models/user.model.js";
import { createError } from "../utils/error.js";
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
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const updateData = {};

    // 1. Build update object dynamically
    if (req.body.username) {
      updateData.username = req.body.username;
    }

    if (req.body.email) {
      updateData.email = req.body.email;
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
