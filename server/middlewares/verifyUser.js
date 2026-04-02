import jwt from "jsonwebtoken";
import { devLogger } from "../utils/logger.js";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  // devLogger("verify token : ", token);
  if (!token) {
    return res.status(401).json({ message: "No token found in cookies" });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser; // Payload of token : {id: validUser._id, isAdmin: boolean}
    // devLogger("Verify token decoded user", decodedUser);
    next();
  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
  /* Old approach
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      next(createError(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
  */
};
