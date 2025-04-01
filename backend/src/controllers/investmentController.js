const { getInvestorStats, getFundingTrends, getInvestmentROI, investInProposal, updateInvestmentReturns } = require("../services/investmentService");
const Proposal = require("../models/Proposal");
const Investment = require("../models/Investment");
const mongoose = require("mongoose");

// Check if proposalId is valid ObjectId
const isValidProposalId = (proposalId) => {
    return mongoose.Types.ObjectId.isValid(proposalId) && proposalId.length === 24;
};

exports.investInProposal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, industry, investmentType, investmentStage } = req.body;

    // Validate the proposal ID
    if (!isValidProposalId(req.params.id)) {
      return res.status(400).json({ message: "Invalid proposal ID" });
    }

    const proposal = await Proposal.findById(req.params.id).session(session);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    // Validate investment details
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "Invalid investment amount" });
    if (!industry) return res.status(400).json({ message: "Industry is required" });
    if (!["equity", "debt", "convertible"].includes(investmentType)) return res.status(400).json({ message: "Invalid investment type" });
    if (!["seed", "seriesA", "seriesB", "IPO"].includes(investmentStage)) return res.status(400).json({ message: "Invalid investment stage" });

    // Update the proposal with the investor's contribution
    await proposal.updateInvestor(req.user.id, amount);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Investment successful", updatedProposal: proposal });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error in investment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get investor stats (including ROI)
exports.investorStats = async (req, res) => {
    try {
        const investorId = req.user.id;

        const stats = await getInvestorStats(investorId);
        res.status(200).json(stats);
    } catch (error) {
        console.error("❌ Error fetching investor stats:", error);
        res.status(500).json({ message: "Error fetching investor stats", error: error.message });
    }
};

// Get funding trends
exports.fundingTrends = async (req, res) => {
    try {
        const { interval = "monthly" } = req.query;
        const trends = await getFundingTrends(interval);
        res.status(200).json(trends);
    } catch (error) {
        console.error("❌ Error fetching funding trends:", error);
        res.status(500).json({ message: "Error fetching funding trends", error: error.message });
    }
};

// Get investment ROI
exports.getInvestmentROI = async (req, res) => {
    try {
        const investorId = req.user.id;

        const { totalInvested, totalReturns, roi } = await getInvestmentROI(investorId);

        res.status(200).json({ totalInvested, totalReturns, roi });
    } catch (error) {
        console.error("❌ Error fetching ROI:", error);
        res.status(500).json({ message: "Failed to fetch ROI", error: error.message });
    }
};

// Search Investments
exports.searchInvestments = async (req, res) => {
    try {
        const { industry, amount, status } = req.query;
        const filter = {};

        if (industry) filter.industry = { $regex: industry, $options: "i" };
        if (amount) filter.amount = { $gte: Number(amount) };

        let investmentsQuery = Investment.find(filter)
            .populate({
                path: "proposal",
                select: "title industry fundingGoal status",
                match: status ? { status: status } : {}, // Match proposals by status
            })
            .populate("investor", "name email")
            .sort({ createdAt: -1 });

        let investments = await investmentsQuery;

        // Remove null proposals (when match fails)
        investments = investments.filter((inv) => inv.proposal !== null);

        if (investments.length === 0) {
            return res.status(404).json({ message: "No investments found" });
        }

        res.status(200).json(investments);
    } catch (error) {
        console.error("❌ Error searching investments:", error);
        res.status(500).json({ message: "Error searching investments", error: error.message });
    }
};

// Set default returns for investments without returns
exports.setDefaultReturns = async (req, res) => {
    try {
        const result = await Investment.updateMany(
            { returns: { $exists: false } },
            { $set: { returns: 0 } }
        );
        res.json({ message: "Investment returns updated", result });
    } catch (error) {
        console.error("❌ Error updating investments:", error);
        res.status(500).json({ message: "Error updating investments", error: error.message });
    }
};
