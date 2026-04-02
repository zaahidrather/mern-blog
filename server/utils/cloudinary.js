import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { devLogger } from "./logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploading image using basic authentication of cloudinary (for Profile image)
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return next(createError(400, "All fields are required"));
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: "mern-blog/avatars",
    });

    fs.unlinkSync(localFilePath); // cleanup local file
    devLogger("File is uploaded on cloudinary", response.url);
    devLogger("object from cloudinary", response);
    return response;
  } catch (error) {
    console.error("Cloudinary error:", error);
    // Incase file not successfully uploaded
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

const deleteFromCloudinary = async (public_Id) => {
  try {
    if (!public_Id) return null;

    const result = await cloudinary.uploader.destroy(public_Id, {
      resource_type: "image",
    });

    devLogger("Cloudinary delete result:", result);

    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
