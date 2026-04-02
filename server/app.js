import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  const statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle MongoDB Duplicate Key Error globally
  if (err.code === 11000) {
    // console.log("aaaaaaaaaaaaaaa", err);
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
