const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no user data" });
    }

    console.log("🔍 Checking Role:", req.user.role); // 🔍 Log user role

    if (!roles.includes(req.user.role)) {
      console.log("❌ Access Denied:", req.user.role); // 🔍 Log denial
      return res.status(403).json({ message: `Access denied for ${req.user.role}` });
    }

    console.log("✅ Access Granted:", req.user.role); // 🔍 Log success
    next();
  };
};

module.exports = { authorizeRole };
