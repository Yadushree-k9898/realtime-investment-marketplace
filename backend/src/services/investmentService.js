const Investment = require("../models/Investment");
const Proposal = require("../models/Proposal");
const redisClient = require("../config/redis");
const mongoose = require("mongoose");


// Invest in a Proposal
// const investInProposal = async (investorId, proposalId, amount, industry) => {
//     try {
//         if (!industry) {
//             throw new Error("Industry is required");
//         }
//         if (isNaN(amount) || amount <= 0) {
//             throw new Error("Invalid investment amount");
//         }

//         const proposal = await Proposal.findById(proposalId);
//         if (!proposal) {
//             throw new Error("Proposal not found");
//         }

//         const investment = new Investment({
//             investor: investorId,
//             proposal: proposalId,
//             amount,
//             industry,
//             date: new Date(),
//         });

//         await investment.save();

//         // Update proposal investors list
//         const investorIndex = proposal.investors.findIndex(
//             (inv) => inv.investor.toString() === investorId.toString()
//         );

//         if (investorIndex !== -1) {
//             proposal.investors[investorIndex].amount += amount;
//         } else {
//             proposal.investors.push({ investor: investorId, amount });
//         }

//         proposal.currentFunding += amount;
//         if (proposal.currentFunding >= proposal.fundingGoal) {
//             proposal.status = "Funded";
//         }

//         await proposal.save();

//         // Update Redis cache
//         const cacheKey = `investorStats:${investorId}`;
//         const updatedStats = await getInvestorStats(investorId);
//         await redisClient.set(cacheKey, JSON.stringify(updatedStats), "EX", 600);

//         return { investment, proposal };
//     } catch (error) {
//         console.error("❌ Error investing in proposal:", error);
//         throw error;
//     }
// };

// Check if proposalId is valid ObjectId
const isValidProposalId = (proposalId) => {
    return mongoose.Types.ObjectId.isValid(proposalId) && proposalId.length === 24;
  };
  
const investInProposal = async (investorId, proposalId, amount, industry) => {
    try {
        if (!industry) {
            throw new Error("Industry is required");
        }
        if (isNaN(amount) || amount <= 0) {
            throw new Error("Invalid investment amount");
        }

        // Validate proposalId format
        if (!isValidProposalId(proposalId)) {
            throw new Error("Invalid proposal ID format");
        }

        // Fetch the proposal
        const proposal = await Proposal.findById(proposalId);
        if (!proposal) {
            throw new Error("Proposal not found");
        }

        const investment = new Investment({
            investor: investorId,
            proposal: proposalId,
            amount,
            industry,
            date: new Date(),
        });

        await investment.save();

        // Update proposal investors list
        const investorIndex = proposal.investors.findIndex(
            (inv) => inv.investor.toString() === investorId.toString()
        );

        if (investorIndex !== -1) {
            proposal.investors[investorIndex].amount += amount;
        } else {
            proposal.investors.push({ investor: investorId, amount });
        }

        proposal.currentFunding += amount;
        if (proposal.currentFunding >= proposal.fundingGoal) {
            proposal.status = "Funded";
        }

        await proposal.save();

        return { investment, proposal };
        console.log("Received proposalId:", proposalId); 

    } catch (error) {
        console.error("❌ Error investing in proposal:", error.message); // Log the error message
        throw error;
    }
};




// Get total investments and count for an investor
const getInvestorStats = async (investorId) => {
    try {
        const cacheKey = `investorStats:${investorId}`;
        await redisClient.del(cacheKey); // Ensure no old data is causing conflicts

        // Convert investorId to ObjectId
        const investorObjectId = new mongoose.Types.ObjectId(investorId);

        // Log the investorId to verify
        console.log("Investor ID:", investorObjectId);

        // Fetch investments and aggregate
        const totalInvestments = await Investment.aggregate([
            { $match: { investor: investorObjectId } },
            { $group: { _id: "$investor", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        console.log("Aggregated Investment Stats:", totalInvestments);

        // Default stats if no investments are found
        const stats = totalInvestments[0] || { totalAmount: 0, count: 0 };

        // Store in Redis
        await redisClient.set(cacheKey, JSON.stringify(stats), "EX", 300);

        return stats;
    } catch (error) {
        console.error("Error fetching investor stats:", error);
        return { error: "Failed to fetch investor stats" };
    }
};


// Get funding trends (daily, weekly, monthly)
const getFundingTrends = async (interval = "monthly") => {
    try {
        const timeFormat = {
            daily: { format: "%Y-%m-%d" },
            weekly: { format: "%Y-%U" },
            monthly: { format: "%Y-%m" },
        };

        const cacheKey = `fundingTrends:${interval}`;
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const trends = await Investment.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: timeFormat[interval].format, date: "$createdAt" } },
                    totalFunding: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } }
        ]);

        // Store trends in Redis cache
        await redisClient.set(cacheKey, JSON.stringify(trends), "EX", 600);

        return trends;
    } catch (error) {
        console.error("❌ Error in getFundingTrends:", error);
        return { error: "Failed to fetch funding trends" };
    }
};

// Calculate ROI (Return on Investment)
const getInvestmentROI = async (investorId) => {
    try {
        const investorObjectId = new mongoose.Types.ObjectId(investorId);

        const investments = await Investment.find({ investor: investorObjectId }).populate("proposal", "returns");

        let totalInvested = 0;
        let totalReturns = 0;

        investments.forEach((inv) => {
            totalInvested += inv.amount;
            if (inv.proposal && inv.proposal.returns) { // ✅ Check if proposal exists
                totalReturns += inv.proposal.returns;
            }
        });

        const roi = totalInvested > 0 ? ((totalReturns - totalInvested) / totalInvested) * 100 : 0;

        return { totalInvested, totalReturns, roi: roi.toFixed(2) };
    } catch (error) {
        console.error("❌ Error in getInvestmentROI:", error);
        return { error: "Failed to calculate ROI" };
    }
};

module.exports = { getInvestorStats, getFundingTrends, getInvestmentROI, investInProposal };
