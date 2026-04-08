import jwt from "jsonwebtoken";
// import { devLogger } from "../utils/logger.js";

export default function verifyUser(req, res, next) {
  const token = req.cookies.access_token;
  // devLogger("verify token : ", token);

  // 1. Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token found in cookies" });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decodedUser; // Payload of token : {id: validUser._id, isAdmin: boolean}
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
  //   catch (err) {
  //   if (err.name === "TokenExpiredError") {
  //     return res.status(401).json({ message: "Token expired" }); // Signals REFRESH
  //   }
  //   return res.status(403).json({ message: "Invalid token" }); // Signals STOP
  // }
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
