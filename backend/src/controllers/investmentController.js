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

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid proposal ID" });
        }

        const proposal = await Proposal.findById(req.params.id).session(session);
        if (!proposal) return res.status(404).json({ message: "Proposal not found" });

        if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "Invalid investment amount" });

        // Calculate initial returns (20% growth)
        const initialReturns = amount * 1.2;

        const newInvestment = new Investment({
            investor: req.user.id,
            proposal: proposal._id,
            amount,
            industry,
            investmentType,
            investmentStage,
            status: "active",
            returns: initialReturns, // Set initial returns
        });

        await newInvestment.save({ session });
        
        // Update proposal with new investment and returns
        proposal.totalInvestment = (proposal.totalInvestment || 0) + amount;
        proposal.totalReturns = (proposal.totalReturns || 0) + initialReturns;
        await proposal.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ 
            message: "Investment successful", 
            investment: newInvestment,
            returns: initialReturns
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
        const GROWTH_RATE = 1.2; // 20% growth

        // Get all investments directly with proposal details
        const investments = await Investment.find({ investor: investorId })
            .populate('proposal', 'fundingGoal')
            .lean();

        if (!investments.length) {
            return res.status(404).json({ message: "No investments found" });
        }

        let totalInvested = 0;
        let totalReturns = 0;
        const statsByProposal = {};

        // Group investments by proposal
        const groupedInvestments = investments.reduce((acc, inv) => {
            const proposalId = inv.proposal._id.toString();
            if (!acc[proposalId]) {
                acc[proposalId] = {
                    invested: 0,
                    returns: 0,
                    fundingGoal: inv.proposal.fundingGoal
                };
            }
            acc[proposalId].invested += inv.amount;
            acc[proposalId].returns += inv.amount * GROWTH_RATE;
            return acc;
        }, {});

        // Calculate statistics for each proposal
        Object.entries(groupedInvestments).forEach(([proposalId, data]) => {
            const invested = data.invested;
            const returns = data.returns;
            
            totalInvested += invested;
            totalReturns += returns;

            statsByProposal[proposalId] = {
                invested: invested,
                returns: returns,
                equityOwnership: Math.min(
                    Number(((invested / data.fundingGoal) * 100).toFixed(2)),
                    100
                ),
                roi: 20 // Fixed 20% ROI
            };
        });

        res.status(200).json({
            totalInvested: Math.round(totalInvested),
            totalReturns: Math.round(totalReturns),
            statsByProposal,
            totalROI: 20
        });

    } catch (error) {
        console.error("❌ Error fetching investor stats:", error);
        res.status(500).json({ 
            message: "Error fetching investor stats", 
            error: error.message 
        });
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

        const investments = await Investment.find({ investor: investorId })
            .populate("proposal", "fundingGoal totalReturns");

        if (!investments.length) {
            return res.status(404).json({ message: "No investments found for this investor" });
        }

        let totalInvested = 0;
        let totalReturns = 0;
        let roiData = [];

        investments.forEach((investment) => {
            const proposal = investment.proposal;
            if (!proposal) {
                console.error("Proposal not found for investment", investment._id);
                return;
            }

            const investedAmount = investment.amount;
            totalInvested += investedAmount;

            // Use investment's own returns instead of proposal returns
            const returns = investment.returns || (investedAmount * 1.2); // 20% default growth
            totalReturns += returns;

            // Calculate ROI
            const gainOrLoss = returns - investedAmount;
            const roi = ((returns - investedAmount) / investedAmount) * 100;

            roiData.push({
                proposal: proposal._id,
                roi: parseFloat(roi.toFixed(2)),
                investedAmount,
                returns,
                gainOrLoss
            });
        });

        // Calculate total ROI
        const totalGainOrLoss = totalReturns - totalInvested;
        const totalRoi = ((totalReturns - totalInvested) / totalInvested) * 100;

        res.status(200).json({
            totalInvested,
            totalReturns,
            totalRoi: totalRoi.toFixed(2),
            totalGainOrLoss,
            roiByProposal: roiData,
        });
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
