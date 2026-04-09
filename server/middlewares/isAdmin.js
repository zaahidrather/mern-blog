import { createError } from "../utils/error.js";

export default function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return next(
      createError(403, "You are not authorized to perform this action."),
    );
  }
}
