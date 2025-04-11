// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // ✅ Middleware to protect routes using JWT
// const protect = async (req, res, next) => {
//   let token;

//   // Check for Bearer token in Authorization header
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, token missing" });
//   }

//   try {
//     // Decode token and attach user to request object
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     console.log("✅ Authenticated:", req.user.email); // Optional: Debug log
//     next();
//   } catch (error) {
//     console.error("❌ JWT verification failed:", error.message);
//     res.status(401).json({ message: "Token is invalid or expired" });
//   }
// };

// // ✅ Middleware for role-based access control
// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Not authorized, user missing" });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
//     }

//     console.log(`✅ Access granted to ${req.user.role}`);
//     next();
//   };
// };

// module.exports = { protect, restrictTo };



const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Auth Middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

// ✅ Role-based Restriction
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user missing" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
    }

    next();
  };
};

// ✅ Optional shortcut
const adminOnly = restrictTo("admin");

module.exports = { protect, restrictTo, adminOnly };
