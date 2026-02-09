import jwt from "jsonwebtoken";
// import { devLog } from "../utils/logger.js";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  // devLog("verify token : ", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Payload of token : {id: validUser._id, isAdmin: boolean}
    // devLog("verify token decoded", decoded);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
