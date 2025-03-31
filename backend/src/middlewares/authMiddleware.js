const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Authenticated User:", req.user); // 🔍 Debugging log
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

// Middleware for role-based access control
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied for ${req.user.role}` });
    }

    console.log(`✅ Access granted for ${req.user.role}`);
    next();
  };
};

module.exports = { protect, restrictTo };
