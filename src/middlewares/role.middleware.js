/**
 * Middleware factory to restrict access based on user roles.
 * @param {...string} roles - Allowed roles.
 * @returns Express middleware function.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { authorize };
