const Proposal = require("../models/Proposal");
const User = require("../models/User");
const mongoose = require("mongoose");
const redis = require("../config/redis");
const asyncHandler = require('express-async-handler');


// Utility to delete Redis keys matching a pattern
const clearMatchingCache = (pattern) => {
  redis.keys(pattern, (err, keys) => {
    if (err) {
      console.error("Redis KEYS error:", err);
      return;
    }
    if (keys.length > 0) {
      redis.del(keys, (err) => {
        if (err) console.error("Redis DEL error:", err);
        else console.log("Deleted cache keys:", keys);
      });
    }
  });
};

exports.createProposal = async (req, res) => {
  try {
    if (req.user.role !== "founder") {
      return res.status(403).json({ message: "Only founders can create proposals" });
    }

    const { title, description, fundingGoal } = req.body;
    const proposal = new Proposal({
      founder: req.user.id,
      title,
      description,
      fundingGoal,
    });

    await proposal.save();

    // Optional: cache newly created proposal
    const proposalKey = `proposal:${proposal._id}`;
    redis.setex(proposalKey, 3600, JSON.stringify(proposal), (err) => {
      if (err) console.error("Redis SETEX error:", err);
    });

    // Invalidate proposals list cache
    clearMatchingCache("proposals:*");

    res.status(201).json({ message: "Proposal created successfully", proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProposals = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (req.user.role === "founder") {
      filter.founder = req.user.id;
    } else if (req.user.role === "admin" && req.query.founder) {
      filter.founder = req.query.founder;
    } else if (req.user.role !== "investor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    if (status) {
      if (!["Under Review", "Negotiating", "Funded"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      filter.status = status;
    }

    const cacheKey = `proposals:${JSON.stringify(filter)}`;

    redis.get(cacheKey, async (err, cachedData) => {
      if (err) return res.status(500).json({ message: "Redis error", error: err.message });

      if (cachedData) {
        console.log("Cache hit for proposals:", cacheKey);
        return res.json(JSON.parse(cachedData));
      }

      const proposals = await Proposal.find(filter)
        .populate("founder", "name email")
        .populate("investors.investor", "name email")
        .populate("comments.user", "name email");

      redis.setex(cacheKey, 3600, JSON.stringify(proposals), (err) => {
        if (err) console.error("Redis SETEX error:", err);
        else console.log("Cached proposals with key:", cacheKey);
      });

      return res.json(proposals);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid proposal ID" });
    }

    const filter = { _id: id };
    if (status) {
      if (!["Under Review", "Negotiating", "Funded"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      filter.status = status;
    }

    const cacheKey = status ? `proposal:${id}:status:${status}` : `proposal:${id}`;

    redis.get(cacheKey, async (err, cachedData) => {
      if (err) return res.status(500).json({ message: "Redis error", error: err.message });

      if (cachedData) {
        console.log("Cache hit for proposal:", cacheKey);
        return res.status(200).json(JSON.parse(cachedData));
      }

      const proposal = await Proposal.findOne(filter)
        .populate("founder", "name email")
        .populate("investors.investor", "name email")
        .populate("comments.user", "name email")
        .lean();

      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      redis.setex(cacheKey, 3600, JSON.stringify(proposal), (err) => {
        if (err) console.error("Redis SETEX error:", err);
        else console.log("Cached proposal with key:", cacheKey);
      });

      return res.status(200).json(proposal);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.updateProposal = async (req, res) => {
  try {
    const { id } = req.params;

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Only the founder who created the proposal or an admin can update it
    if (proposal.founder.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this proposal" });
    }

    const {
      title,
      description,
      fundingGoal,
      industry,
      expectedReturn,
      durationInMonths,
      equityOffered,
      valuation,
      pitchDeckUrl,
      milestones,
      tags,
      location,
      status,
      isPublic
    } = req.body;

    // Update only allowed fields if they exist in req.body
    if (title !== undefined) proposal.title = title;
    if (description !== undefined) proposal.description = description;
    if (fundingGoal !== undefined) proposal.fundingGoal = fundingGoal;
    if (industry !== undefined) proposal.industry = industry;
    if (expectedReturn !== undefined) proposal.expectedReturn = expectedReturn;
    if (durationInMonths !== undefined) proposal.durationInMonths = durationInMonths;
    if (equityOffered !== undefined) proposal.equityOffered = equityOffered;
    if (valuation !== undefined) proposal.valuation = valuation;
    if (pitchDeckUrl !== undefined) proposal.pitchDeckUrl = pitchDeckUrl;
    if (milestones !== undefined) proposal.milestones = milestones;
    if (tags !== undefined) proposal.tags = tags;
    if (location !== undefined) proposal.location = location;
    if (status !== undefined) proposal.status = status;
    if (isPublic !== undefined) proposal.isPublic = isPublic;

    await proposal.save();

    // Emit real-time update if socket.io available
    if (req.io) {
      req.io.emit("proposalUpdated", {
        proposalId: proposal._id,
        updatedFields: req.body,
      });
    }

    // Clear cache related to this proposal and list
    clearMatchingCache(`proposal:${proposal._id}*`);
    clearMatchingCache("proposals:*");

    res.status(200).json({ message: "Proposal updated successfully", proposal });
  } catch (error) {
    console.error("Update proposal error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.founder.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this proposal" });
    }

    await Proposal.findByIdAndDelete(req.params.id);

    clearMatchingCache(`proposal:${proposal._id}*`);
    clearMatchingCache("proposals:*");

    res.json({ message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.investInProposal = async (req, res) => {
  try {
    if (req.user.role !== "investor") {
      return res.status(403).json({ message: "Only investors can invest" });
    }

    const { amount } = req.body;
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid investment amount" });
    }

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const investorIndex = proposal.investors.findIndex(
      (inv) => inv.investor.toString() === req.user.id.toString()
    );

    if (investorIndex !== -1) {
      proposal.investors[investorIndex].amount += amount;
    } else {
      proposal.investors.push({ investor: req.user.id, amount });
    }

    proposal.currentFunding += amount;
    if (proposal.currentFunding >= proposal.fundingGoal) {
      proposal.status = "Funded";
    }

    await proposal.save();

    clearMatchingCache(`proposal:${proposal._id}*`);
    clearMatchingCache("proposals:*");

    res.json({ message: "Investment successful", proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addCommentToProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const comment = {
      user: req.user.id,
      text: req.body.comment,
      createdAt: new Date(),
    };

    proposal.comments.push(comment);
    await proposal.save();

    clearMatchingCache(`proposal:${proposal._id}*`);
    clearMatchingCache("proposals:*");

    res.status(201).json({ message: "Comment added successfully", proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.searchProposals = async (req, res) => {
  try {
    const { title, industry, fundingGoal, status } = req.query;
    let searchConditions = {};

    if (title) {
      searchConditions.title = { $regex: title, $options: "i" };
    }
    if (industry) {
      searchConditions.industry = { $regex: industry, $options: "i" };
    }
    if (fundingGoal) {
      searchConditions.fundingGoal = { $lte: fundingGoal };
    }
    if (status) {
      searchConditions.status = status;
    }

    const proposals = await Proposal.find(searchConditions);

    if (!proposals.length) {
      return res.status(404).json({ message: "No proposals found" });
    }

    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/proposals/:id/investors
// @desc    Get all investors who invested in a proposal (founder only)
// @access  Private
// exports.getProposalInvestorsForFounder = asyncHandler(async (req, res) => {
//   const proposalId = req.params.id;

//   const proposal = await Proposal.findById(proposalId);

//   if (!proposal) {
//     res.status(404);
//     throw new Error("Proposal not found");
//   }

//   if (proposal.founder.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error("Not authorized to view this proposal’s investors");
//   }

//   const investments = await Investment.find({ proposal: proposalId })
//     .populate("investor", "name email role profileImage")
//     .sort({ createdAt: -1 });

//   res.status(200).json({
//     proposal: {
//       id: proposal._id,
//       title: proposal.title,
//       fundingGoal: proposal.fundingGoal,
//       currentFunding: proposal.currentFunding,
//     },
//     totalInvestors: investments.length,
//     investors: investments.map((inv) => ({
//       investorId: inv.investor._id,
//       name: inv.investor.name,
//       email: inv.investor.email,
//       profileImage: inv.investor.profileImage || null,
//       amount: inv.amount,
//       investmentType: inv.investmentType,
//       equityOwnership: inv.equityOwnership,
//       expectedReturn: inv.expectedReturn,
//       ROI: inv.ROI,
//       status: inv.status,
//       investedAt: inv.createdAt,
//     })),
//   });
// });

// exports.getProposalInvestorsForFounder = asyncHandler(async (req, res) => {
//   const proposalId = req.params.id;
//   const userId = req.user._id.toString();

//   console.log("🔍 Fetching investors for proposal:", proposalId);
//   console.log("🔐 Request made by user:", userId);

//   // 1. Validate Proposal Exists
//   const proposal = await Proposal.findById(proposalId);
//   if (!proposal) {
//     console.error("❌ Proposal not found for ID:", proposalId);
//     res.status(404);
//     throw new Error("Proposal not found");
//   }

//   // 2. Check If Logged-In User Is the Founder
//   if (proposal.founder.toString() !== userId) {
//     console.error("❌ Not authorized. Founder:", proposal.founder.toString(), "User:", userId);
//     res.status(403);
//     throw new Error("Not authorized to view this proposal’s investors");
//   }

//   // 3. Fetch Investments Linked to This Proposal
//   const investments = await Investment.find({ proposal: proposalId })
//     .populate("investor", "name email role profileImage")
//     .sort({ createdAt: -1 });

//   console.log(`✅ Found ${investments.length} investments for proposal ${proposal.title}`);

//   // 4. Send Back Data
//   res.status(200).json({
//     proposal: {
//       id: proposal._id,
//       title: proposal.title,
//       fundingGoal: proposal.fundingGoal,
//       currentFunding: proposal.currentFunding,
//       industry: proposal.industry || "Not specified",
//       equityOffered: proposal.equityOffered || "N/A",
//       status: proposal.status,
//     },
//     totalInvestors: investments.length,
//     investors: investments.map((inv) => ({
//       investorId: inv.investor._id,
//       name: inv.investor.name,
//       email: inv.investor.email,
//       profileImage: inv.investor.profileImage || null,
//       amount: inv.amount,
//       investmentType: inv.investmentType,
//       equityOwnership: inv.equityOwnership,
//       expectedReturn: inv.expectedReturn,
//       ROI: inv.ROI,
//       status: inv.status,
//       investedAt: inv.createdAt,
//     })),
//   });
// });


exports.getProposalInvestorsForFounder = asyncHandler(async (req, res) => {
  const proposalId = req.params.id;
  const userId = req.user._id.toString();

  console.log("🔍 Fetching investors for proposal:", proposalId);
  console.log("🔐 Request made by user:", userId);

  // 1. Validate Proposal Exists
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) {
    console.error("❌ Proposal not found for ID:", proposalId);
    return res.status(404).json({ error: "Proposal not found" });
  }

  // 2. Check If Logged-In User Is the Founder or Admin
  if (proposal.founder.toString() !== userId && req.user.role !== 'admin') {
    console.error("❌ Not authorized. Founder:", proposal.founder.toString(), "User:", userId);
    return res.status(403).json({ error: "Not authorized to view this proposal’s investors" });
  }

  // 3. Fetch Investments Linked to This Proposal
  const investments = await Investment.find({ proposal: proposalId })
    .populate("investor", "name email role profileImage") // Populate investor data
    .sort({ createdAt: -1 });

  if (investments.length === 0) {
    console.log("⚠️ No investments found for this proposal.");
  } else {
    console.log(`✅ Found ${investments.length} investments for proposal ${proposal.title}`);
  }

  // 4. Send Back Data
  res.status(200).json({
    proposal: {
      id: proposal._id,
      title: proposal.title,
      fundingGoal: proposal.fundingGoal,
      currentFunding: proposal.currentFunding,
      industry: proposal.industry || "Not specified",
      equityOffered: proposal.equityOffered || "N/A",
      status: proposal.status,
    },
    totalInvestors: investments.length,
    investors: investments.map((inv) => ({
      investorId: inv.investor._id,
      name: inv.investor.name,
      email: inv.investor.email,
      profileImage: inv.investor.profileImage || null,
      amount: inv.amount,
      investmentType: inv.investmentType,
      equityOwnership: inv.equityOwnership,
      expectedReturn: inv.expectedReturn,
      ROI: inv.ROI,
      status: inv.status,
      investedAt: inv.createdAt,
    })),
  });
});
