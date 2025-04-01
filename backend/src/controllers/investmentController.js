const { getInvestorStats, getFundingTrends, getInvestmentROI, investInProposal, updateInvestmentReturns } = require("../services/investmentService");
const Proposal = require("../models/Proposal");
const Investment = require("../models/Investment");
const mongoose = require("mongoose");

// Check if proposalId is valid ObjectId
const isValidProposalId = (proposalId) => {
    return mongoose.Types.ObjectId.isValid(proposalId) && proposalId.length === 24;
};

// Invest in a proposal
exports.investInProposal = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, industry, investmentType, investmentStage } = req.body;

        // Validate proposal ID
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

        let equityOwnership = 0;

        if (investmentType === "equity" && proposal.fundingGoal > 0) {
            equityOwnership = (amount / proposal.fundingGoal) * 100;
        }

        const newInvestment = new Investment({
            investor: req.user.id,
            amount,
            industry,
            proposal: proposal._id,
            equityOwnership,
            investmentType,
            investmentStage,
            status: "pending",
        });

        await newInvestment.save({ session });

        // Update the proposal with the investor's contribution
        await proposal.updateInvestor(req.user.id, amount);

        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Investment successful",
            investment: newInvestment,
        });
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
exports.getInvestmentROI = async (req, res) => {
    try {
        const investorId = req.user.id;

        // Fetch all investments made by the investor
        const investments = await Investment.find({ investor: investorId })
            .populate("proposal", "fundingGoal totalReturns"); // Populate proposals

        if (!investments.length) {
            return res.status(404).json({ message: "No investments found for this investor" });
        }

        // Aggregate data for each proposal
        let totalInvested = 0;
        let totalReturns = 0;
        let roiData = [];

        investments.forEach((investment) => {
            const proposal = investment.proposal;

            // Ensure proposal exists before trying to access its properties
            if (!proposal) {
                console.error("Proposal not found for investment", investment._id);
                return; // Skip this investment if no proposal is found
            }

            const investedAmount = investment.amount;

            // Sum total investments
            totalInvested += investedAmount;

            // Ensure totalReturns is defined
            const returns = proposal.totalReturns !== undefined ? proposal.totalReturns : 0; // Default to 0 if totalReturns is undefined
            totalReturns += returns;

            // Calculate ROI for this proposal
            const roi = investedAmount > 0 ? ((returns - investedAmount) / investedAmount) * 100 : 0; // Avoid division by zero
            roiData.push({
                proposal: proposal._id,
                roi: roi.toFixed(2), // ROI in percentage
                investedAmount: investedAmount,
                returns: returns,
            });
        });

        // Calculate total ROI for the investor across all investments
        const totalRoi = totalInvested > 0 ? ((totalReturns - totalInvested) / totalInvested) * 100 : 0;

        res.status(200).json({
            totalInvested,
            totalReturns,
            totalRoi: totalRoi.toFixed(2),
            roiByProposal: roiData,
        });
    } catch (error) {
        console.error("❌ Error fetching ROI:", error);
        res.status(500).json({ message: "Failed to fetch ROI", error: error.message });
    }
};


// exports.getInvestmentROI = async (req, res) => {
//     try {
//         const investorId = req.user.id;

//         // Fetch all investments made by the investor
//         const investments = await Investment.find({ investor: investorId })
//             .populate("proposal", "fundingGoal totalReturns"); // Populate proposals

//         if (!investments.length) {
//             return res.status(404).json({ message: "No investments found for this investor" });
//         }

//         // Aggregate data for each proposal
//         let totalInvested = 0;
//         let totalReturns = 0;
//         let roiData = [];

//         investments.forEach((investment) => {
//             const proposal = investment.proposal;
//             const investedAmount = investment.amount;

//             // Sum total investments
//             totalInvested += investedAmount;

//             // Calculate ROI for each proposal
//             const returns = proposal.totalReturns !== undefined ? proposal.totalReturns : 0; // Default to 0 if totalReturns is undefined
//             totalReturns += returns;

//             // Calculate ROI for this proposal
//             const roi = (returns - investedAmount) / investedAmount * 100;
//             roiData.push({
//                 proposal: proposal._id,
//                 roi: roi.toFixed(2), // ROI in percentage
//                 investedAmount: investedAmount,
//                 returns: returns,
//             });
//         });

//         // Calculate total ROI for the investor across all investments
//         const totalRoi = ((totalReturns - totalInvested) / totalInvested) * 100;

//         res.status(200).json({
//             totalInvested,
//             totalReturns,
//             totalRoi: totalRoi.toFixed(2),
//             roiByProposal: roiData,
//         });
//     } catch (error) {
//         console.error("❌ Error fetching ROI:", error);
//         res.status(500).json({ message: "Failed to fetch ROI", error: error.message });
//     }
// };


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
