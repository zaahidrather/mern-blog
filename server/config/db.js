import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to : ", conn.connection.name);
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};
