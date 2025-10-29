// middleware/role.middleware.js
import createError from "../utils/createError.js";

export const requireRole = (roles = []) => (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole) return next(createError(401, "Not authenticated"));
  if (!Array.isArray(roles)) roles = [roles];
  if (!roles.includes(userRole)) return next(createError(403, "Forbidden"));
  next();
};