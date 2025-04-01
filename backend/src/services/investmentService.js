const Proposal = require("../models/Proposal");
const Investment = require("../models/Investment");
const mongoose = require("mongoose");


const getInvestorStats = async (investorId) => {
    try {
        console.log(`Fetching stats for investor ID: ${investorId}`);
        
        // Fetch the investments related to the investor
        const investments = await Investment.find({ investor: investorId });

        if (!investments || investments.length === 0) {
            throw new Error("No investments found for this investor.");
        }

        // Example: Calculate stats (you can modify this logic to match your needs)
        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalReturns = investments.reduce((sum, inv) => sum + (inv.returns || 0), 0);

        // Handle the case where returns are 0 (for ROI calculation)
        let roi = 0;
        if (totalInvested > 0) {
            roi = totalReturns > 0 ? ((totalReturns - totalInvested) / totalInvested) : 0;
        }

        console.log(`Total Invested: ${totalInvested}, Total Returns: ${totalReturns}, ROI: ${roi}`);

        return { totalInvested, totalReturns, roi };
    } catch (error) {
        console.error("❌ Error in getInvestorStats:", error);
        throw new Error("Error calculating investor stats.");
    }
};

const getInvestmentROI = async (investorId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(investorId)) {
            throw new Error("Invalid investor ID.");
        }
        const investorObjectId = new mongoose.Types.ObjectId(investorId);
        
        console.log(`Calculating ROI for investor ID: ${investorId}`);

        const investments = await Investment.find({ investor: investorObjectId });
        if (investments.length === 0) {
            console.warn(`No investments found for investor ${investorId}`);
            return { totalInvested: 0, totalReturns: 0, roi: 0 };
        }

        const totalInvested = await Investment.aggregate([
            { $match: { investor: investorObjectId } },
            { $group: { _id: null, totalInvested: { $sum: "$amount" } } }
        ]);

        const totalReturns = await Investment.aggregate([
            { $match: { investor: investorObjectId } },
            { $group: { _id: null, totalReturns: { $sum: { $ifNull: ["$returns", 0] } } } }
        ]);

        const totalInvestedAmount = totalInvested.length > 0 ? totalInvested[0].totalInvested : 0;
        const totalReturnsAmount = totalReturns.length > 0 ? totalReturns[0].totalReturns : 0;

        let roi = 0;
        if (totalInvestedAmount > 0) {
            roi = ((totalReturnsAmount - totalInvestedAmount) / totalInvestedAmount) * 100;
        }

        console.log(`✅ ROI Calculated: Invested: ${totalInvestedAmount}, Returns: ${totalReturnsAmount}, ROI: ${roi}%`);

        return {
            totalInvested: totalInvestedAmount,
            totalReturns: totalReturnsAmount,
            roi: roi.toFixed(2),
        };
    } catch (error) {
        console.error("❌ Error calculating ROI:", error);
        throw new Error("Error calculating ROI.");
    }
};






const getFundingTrends = async (interval = "monthly") => {
    try {
        const matchStage = {
            "monthly": { $dateToString: { format: "%Y-%m", date: "$date" } },
            "yearly": { $dateToString: { format: "%Y", date: "$date" } },
            "weekly": { $isoWeek: "$date" },
        }[interval] || { $dateToString: { format: "%Y-%m", date: "$date" } };

        const trends = await Investment.aggregate([
            { $group: { _id: matchStage, totalInvested: { $sum: "$amount" } } },
            { $sort: { _id: 1 } }
        ]);

        return trends;
    } catch (error) {
        console.error("❌ Error getting funding trends:", error);
        throw new Error("Error fetching funding trends.");
    }
};


const updateInvestmentReturns = async (investmentId, proposalId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(investmentId) || !mongoose.Types.ObjectId.isValid(proposalId)) {
            throw new Error("Invalid investment or proposal ID.");
        }

        const investment = await Investment.findById(investmentId);
        if (!investment) {
            throw new Error(`Investment with ID ${investmentId} not found.`);
        }

        const proposal = await Proposal.findById(proposalId);
        if (!proposal) {
            throw new Error(`Proposal with ID ${proposalId} not found.`);
        }

        // Calculate returns based on proposal status
        let returns = 0;
        if (proposal.status === "Funded") {
            const roiPercentage = 0.1; // Example: 10% return
            returns = investment.amount * roiPercentage;
        }

        investment.returns = returns;
        investment.roi = (returns / investment.amount) * 100;
        await investment.save();

        return { investment, returns };
    } catch (error) {
        console.error("❌ Error updating investment returns:", error);
        throw new Error("Error updating investment returns.");
    }
};

const setDefaultReturns = async () => {
    try {
        const result = await Investment.updateMany(
            { returns: { $exists: false } },
            { $set: { returns: 0 } }
        );
        return result;
    } catch (error) {
        console.error("❌ Error updating default returns:", error);
        throw new Error("Error setting default returns.");
    }
};

module.exports = {
    getInvestorStats,
    getFundingTrends,
    getInvestmentROI,
    updateInvestmentReturns,
    setDefaultReturns,
};


