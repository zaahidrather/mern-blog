export default function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return next(createError(403, "You are not allowed to create a post"));
  }
}
