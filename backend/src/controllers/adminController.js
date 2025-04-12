// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");
// const Proposal = require("../models/Proposal");
// const Investment = require("../models/Investment");

// // @desc    Get all users
// // @route   GET /api/admin/users
// // @access  Admin only
// const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find().select("-password");
//   res.json(users);
// });

// // @desc    Get individual user by ID
// // @route   GET /api/admin/users/:id
// // @access  Admin only
// const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }
//   res.json(user);
// });

// // @desc    Delete a user
// // @route   DELETE /api/admin/users/:id
// // @access  Admin only
// const deleteUser = asyncHandler(async (req, res) => {
//   const user = await User.findByIdAndDelete(req.params.id);
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }
//   res.json({ message: "User deleted successfully" });
// });

// // @desc    Get all proposals
// // @route   GET /api/admin/proposals
// // @access  Admin only
// const getAllProposals = asyncHandler(async (req, res) => {
//   const proposals = await Proposal.find().populate("founder investors.investor", "-password");
//   res.json(proposals);
// });

// // @desc    Get all investments
// // @route   GET /api/admin/investments
// // @access  Admin only
// const getAllInvestments = asyncHandler(async (req, res) => {
//   const investments = await Investment.find()
//     .populate("investor", "name email role")
//     .populate("proposal", "title fundingGoal currentFunding");
//   res.json(investments);
// });

// // @desc    Get individual investment by ID
// // @route   GET /api/admin/investments/:id
// // @access  Admin only
// const getInvestmentById = asyncHandler(async (req, res) => {
//   const investment = await Investment.findById(req.params.id)
//     .populate("investor", "name email role")
//     .populate("proposal", "title fundingGoal currentFunding");
//   if (!investment) {
//     res.status(404);
//     throw new Error("Investment not found");
//   }
//   res.json(investment);
// });

// // @desc    Delete an investment
// // @route   DELETE /api/admin/investments/:id
// // @access  Admin only
// const deleteInvestment = asyncHandler(async (req, res) => {
//   const investment = await Investment.findById(req.params.id);
//   if (!investment) {
//     res.status(404);
//     throw new Error("Investment not found");
//   }

//   const proposal = await Proposal.findById(investment.proposal);
//   if (proposal) {
//     proposal.currentFunding -= investment.amount;
//     proposal.investors = proposal.investors.filter(
//       (inv) => inv.investor.toString() !== investment.investor.toString()
//     );
//     await proposal.save();
//   }

//   await investment.deleteOne();
//   res.json({ message: "Investment deleted successfully" });
// });

// // @desc    Get platform stats (total users and proposals)
// // @route   GET /api/admin/stats
// // @access  Admin only
// const getPlatformStats = asyncHandler(async (req, res) => {
//   const totalUsers = await User.countDocuments();
//   const totalProposals = await Proposal.countDocuments();

//   res.json({ totalUsers, totalProposals });
// });


// module.exports = {
//   getAllUsers,
//   getUserById,
//   deleteUser,
//   getAllProposals,
//   getAllInvestments,
//   getInvestmentById,
//   deleteInvestment,
//   getPlatformStats,
// };


const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Proposal = require("../models/Proposal");
const Investment = require("../models/Investment");

/* ----------------------------- ADMIN CONTROLS ----------------------------- */

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// @desc    Get individual user by ID
// @route   GET /api/admin/users/:id
// @access  Admin only
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ message: "User deleted successfully" });
});

// @desc    Get all proposals
// @route   GET /api/admin/proposals
// @access  Admin only
const getAllProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find().populate("founder investors.investor", "-password");
  res.json(proposals);
});

// @desc    Get all investments
// @route   GET /api/admin/investments
// @access  Admin only
const getAllInvestments = asyncHandler(async (req, res) => {
  const investments = await Investment.find()
    .populate("investor", "name email role")
    .populate("proposal", "title fundingGoal currentFunding");
  res.json(investments);
});

// @desc    Get individual investment by ID
// @route   GET /api/admin/investments/:id
// @access  Admin only
const getInvestmentById = asyncHandler(async (req, res) => {
  const investment = await Investment.findById(req.params.id)
    .populate("investor", "name email role")
    .populate("proposal", "title fundingGoal currentFunding");
  if (!investment) {
    res.status(404);
    throw new Error("Investment not found");
  }
  res.json(investment);
});

// @desc    Delete an investment
// @route   DELETE /api/admin/investments/:id
// @access  Admin only
const deleteInvestment = asyncHandler(async (req, res) => {
  const investment = await Investment.findById(req.params.id);
  if (!investment) {
    res.status(404);
    throw new Error("Investment not found");
  }

  const proposal = await Proposal.findById(investment.proposal);
  if (proposal) {
    proposal.currentFunding -= investment.amount;
    proposal.investors = proposal.investors.filter(
      (inv) => inv.investor.toString() !== investment.investor.toString()
    );
    await proposal.save();
  }

  await investment.deleteOne();
  res.json({ message: "Investment deleted successfully" });
});

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Admin only
const getPlatformStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProposals = await Proposal.countDocuments();
  res.json({ totalUsers, totalProposals });
});

/* ----------------------------- ANALYTICS HELPERS ----------------------------- */

const groupByMonth = (data, dateField) => {
  const result = {};

  data.forEach((item) => {
    const date = new Date(item[dateField]);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    result[key] = (result[key] || 0) + 1;
  });

  return result;
};

// @desc    Get monthly investment trends
// @route   GET /api/admin/analytics/investments
// @access  Admin only
const getInvestmentAnalytics = asyncHandler(async (req, res) => {
  const investments = await Investment.find({}, "createdAt");
  const monthlyData = groupByMonth(investments, "createdAt");
  res.json(monthlyData);
});

// @desc    Get monthly proposal creation trends
// @route   GET /api/admin/analytics/proposals
// @access  Admin only
const getProposalAnalytics = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find({}, "createdAt");
  const monthlyData = groupByMonth(proposals, "createdAt");
  res.json(monthlyData);
});

// @desc    Get monthly user signup trends
// @route   GET /api/admin/analytics/users
// @access  Admin only
const getUserAnalytics = asyncHandler(async (req, res) => {
  const users = await User.find({}, "createdAt");
  const monthlyData = groupByMonth(users, "createdAt");
  res.json(monthlyData);
});

/* ----------------------------- EXPORT CONTROLLER ----------------------------- */

module.exports = {
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
};
