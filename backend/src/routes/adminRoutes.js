// import express from "express";
// import {
//   getAllUsers,
//   getUserById,
//   deleteUser,
//   getAllProposals,
//   getAllInvestments,
//   getInvestmentById,
//   deleteInvestment,
// } from "../controllers/adminController.js";

// import { protect, adminOnly } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // All routes are protected and admin-only
// router.use(protect);
// router.use(adminOnly);

// // ----- USERS -----
// router.get("/users", getAllUsers);
// router.get("/users/:id", getUserById);
// router.delete("/users/:id", deleteUser);

// // ----- PROPOSALS -----
// router.get("/proposals", getAllProposals);

// // ----- INVESTMENTS -----
// router.get("/investments", getAllInvestments);
// router.get("/investments/:id", getInvestmentById);
// router.delete("/investments/:id", deleteInvestment);

// export default router;


// const express = require("express");
// const router = express.Router();
// const {
//   getAllUsers,
//   getUserById,
//   deleteUser,
//   getAllProposals,
//   getAllInvestments,
//   getInvestmentById,
//   deleteInvestment,
//   getPlatformStats,
// } = require("../controllers/adminController");

// const { protect, restrictTo } = require("../middlewares/authMiddleware");

// router.use(protect);
// router.use(restrictTo("admin"));

// // Users
// router.get("/users", getAllUsers);
// router.get("/users/:id", getUserById);
// router.delete("/users/:id", deleteUser);

// // Proposals
// router.get("/proposals", getAllProposals);
// // Platform stats route
// router.get("/stats", getPlatformStats);


// // Investments
// router.get("/investments", getAllInvestments);
// router.get("/investments/:id", getInvestmentById);
// router.delete("/investments/:id", deleteInvestment);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  deleteUser,
  getAllProposals,
  getAllInvestments,
  getInvestmentById,
  deleteInvestment,
  getPlatformStats,
  getInvestmentAnalytics,
  getProposalAnalytics,
  getUserAnalytics,
} = require("../controllers/adminController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Apply admin-only middleware
router.use(protect);
router.use(restrictTo("admin"));

/* ----------------------------- USER ROUTES ----------------------------- */
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

/* --------------------------- PROPOSAL ROUTES --------------------------- */
router.get("/proposals", getAllProposals);

/* -------------------------- INVESTMENT ROUTES -------------------------- */
router.get("/investments", getAllInvestments);
router.get("/investments/:id", getInvestmentById);
router.delete("/investments/:id", deleteInvestment);

/* --------------------------- PLATFORM STATS ---------------------------- */
router.get("/stats", getPlatformStats);

/* ---------------------------- ANALYTICS ---------------------------- */
router.get("/analytics/investments", getInvestmentAnalytics);
router.get("/analytics/proposals", getProposalAnalytics);
router.get("/analytics/users", getUserAnalytics);

module.exports = router;
