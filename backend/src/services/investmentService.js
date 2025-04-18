const Proposal = require("../models/Proposal");
const Investment = require("../models/Investment");
const mongoose = require("mongoose");

// Get investor stats (including ROI)
const getInvestorStats = async (investorId) => {
    try {
        const investments = await Investment.find({ investor: investorId }).populate("proposal");

        let totalInvested = 0;
        let totalReturns = 0;
        const statsByProposal = {};

        investments.forEach((investment) => {
            const proposalId = investment.proposal._id.toString();
            totalInvested += investment.amount;
            totalReturns += investment.returns;

            if (!statsByProposal[proposalId]) {
                statsByProposal[proposalId] = {
                    invested: investment.amount,
                    returns: investment.returns,
                    equityOwnership: investment.equityOwnership,
                    roi: investment.roi,
                };
            } else {
                statsByProposal[proposalId].invested += investment.amount;
                statsByProposal[proposalId].returns += investment.returns;
                statsByProposal[proposalId].equityOwnership += investment.equityOwnership;
                statsByProposal[proposalId].roi =
                    ((statsByProposal[proposalId].returns - statsByProposal[proposalId].invested) /
                        statsByProposal[proposalId].invested) *
                    100;
            }
        });

        const totalROI = totalInvested > 0 ? ((totalReturns - totalInvested) / totalInvested) * 100 : 0;

        return { totalInvested, totalReturns, statsByProposal, totalROI };
    } catch (error) {
        console.error("❌ Error in getInvestorStats:", error);
        throw error;
    }
};

const getInvestmentROI = async (investorId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(investorId)) {
            throw new Error("Invalid investor ID.");
        }

        const investments = await Investment.find({ investor: investorId }).populate("proposal");
        if (investments.length === 0) return { roiByProposal: {}, totalROI: "0.00" };

        let totalInvested = 0, totalReturns = 0;
        const roiByProposal = {};

        investments.forEach((investment) => {
            const proposal = investment.proposal;
            if (!proposal) return; // Skip if no proposal

            const returns = proposal.totalReturns || 0; // Ensure totalReturns is defined
            totalInvested += investment.amount;
            totalReturns += returns;
            const proposalTitle = proposal.title;

            if (!roiByProposal[proposalTitle]) {
                roiByProposal[proposalTitle] = { invested: 0, returns: 0, roi: 0, equityOwnership: 0 };
            }

            roiByProposal[proposalTitle].invested += investment.amount;
            roiByProposal[proposalTitle].returns += returns;
            roiByProposal[proposalTitle].equityOwnership += investment.equityOwnership || 0;
            roiByProposal[proposalTitle].roi = ((roiByProposal[proposalTitle].returns - roiByProposal[proposalTitle].invested) / roiByProposal[proposalTitle].invested) * 100;
        });

        const totalROI = totalInvested > 0 ? ((totalReturns - totalInvested) / totalInvested) * 100 : 0;

        return { totalInvested, totalReturns, totalROI: totalROI.toFixed(2), roiByProposal };
    } catch (error) {
        console.error("❌ Error calculating ROI:", error);
        throw new Error("Error calculating ROI.");
    }
};




// Invest in proposal
const investInProposal = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, industry, investmentType, investmentStage } = req.body;
        const proposalId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(proposalId)) {
            return res.status(400).json({ message: "Invalid proposal ID" });
        }

        const proposal = await Proposal.findById(proposalId).session(session);
        if (!proposal) return res.status(404).json({ message: "Proposal not found" });

        if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "Invalid investment amount" });

        let equityOwnership = 0;
        if (investmentType === "equity" && proposal.fundingGoal > 0) {
            equityOwnership = (amount / proposal.fundingGoal) * 100;
        }

        const newInvestment = new Investment({
            investor: req.user.id,
            proposal: proposalId,
            amount,
            industry,
            equityOwnership,
            investmentType,
            investmentStage,
            status: "pending",
        });

        await newInvestment.save({ session });
        await proposal.updateInvestor(req.user.id, amount);

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Investment successful", investment: newInvestment });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("❌ Error in investment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    getInvestorStats,
    getInvestmentROI,
    investInProposal,
};
