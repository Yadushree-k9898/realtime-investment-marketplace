const { getInvestorStats, getFundingTrends, getInvestmentROI, investInProposal } = require("../services/investmentService");
const redis = require("../config/redis");
const Proposal = require("../models/Proposal");
const Investment = require("../models/Investment");
const mongoose = require("mongoose");

// Invest in a Proposal (Only for Investors)
exports.investInProposal = async (req, res) => {
    try {
        // Validate proposal ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid proposal ID" });
        }

        if (req.user.role !== "investor") {
            return res.status(403).json({ message: "Only investors can invest" });
        }

        const { amount, industry } = req.body;
        if (!industry) {
            return res.status(400).json({ message: "Industry is required" });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid investment amount" });
        }

        // Check Redis cache for proposal
        const proposalCacheKey = `proposal:${req.params.id}`;
        const cachedProposal = await redis.get(proposalCacheKey);

        let proposal;
        if (cachedProposal) {
            console.log('📌 Serving cached proposal...');
            proposal = JSON.parse(cachedProposal);
        } else {
            console.log('🔍 Fetching fresh proposal...');
            proposal = await Proposal.findById(req.params.id);
            if (!proposal) {
                return res.status(404).json({ message: "Proposal not found" });
            }
            // Cache proposal for 1 hour
            await redis.set(proposalCacheKey, JSON.stringify(proposal), 'EX', 3600);
        }

        // Create a new investment
        const investment = new Investment({
            investor: req.user.id,
            proposal: req.params.id,
            amount,
            industry,
            date: new Date(),
        });

        await investment.save();

        // Update the proposal's investors list and funding
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

        // Clear the cached proposal as it has been updated
        await redis.del(proposalCacheKey);

        res.json({ message: "Investment successful", investment, proposal });
    } catch (error) {
        console.error("❌ Error in investment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get investor stats (total investments & count)
exports.investorStats = async (req, res) => {
    try {
        const investorId = req.user.id;
        const cacheKey = `investorStats:${investorId}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("📌 Serving cached investor stats...");
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("🔍 Fetching fresh investor stats...");
        const stats = await getInvestorStats(investorId);

        await redis.set(cacheKey, JSON.stringify(stats), "EX", 600); // Cache for 10 minutes

        res.status(200).json(stats);
    } catch (error) {
        console.error("❌ Error fetching investor stats:", error);
        res.status(500).json({ message: "Error fetching investor stats", error: error.message });
    }
};

// Get funding trends (daily, weekly, monthly)
exports.fundingTrends = async (req, res) => {
    try {
        const { interval = "monthly" } = req.query;
        const cacheKey = `fundingTrends:${interval}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log(`📌 Serving cached funding trends (${interval})...`);
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log(`🔍 Fetching fresh funding trends (${interval})...`);
        const trends = await getFundingTrends(interval);

        await redis.set(cacheKey, JSON.stringify(trends), "EX", 600); // Cache for 10 minutes

        res.status(200).json(trends);
    } catch (error) {
        console.error("❌ Error fetching funding trends:", error);
        res.status(500).json({ message: "Error fetching funding trends", error: error.message });
    }
};

// Get investor ROI
exports.investmentROI = async (req, res) => {
    try {
        const cacheKey = `investmentROI:${req.user.id}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("📌 Serving cached ROI data...");
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("🔍 Fetching fresh ROI data...");
        const roiData = await getInvestmentROI(req.user.id);

        await redis.set(cacheKey, JSON.stringify(roiData), "EX", 600); // Cache for 10 minutes

        res.status(200).json(roiData);
    } catch (error) {
        console.error("❌ Error calculating ROI:", error);
        res.status(500).json({ message: "Error calculating ROI", error: error.message });
    }
};

// Add investment (new investment)
exports.addInvestment = async (req, res) => {
    try {
        const { investorId, amount, industry, proposalId } = req.body;

        if (!industry) {
            return res.status(400).json({ message: "Industry is required" });
        }

        const newInvestment = await Investment.create({
            investor: investorId,
            amount,
            industry,
            proposal: proposalId,
        });

        const cacheKey = `investorStats:${investorId}`;
        const updatedStats = await getInvestorStats(investorId);
        await redis.set(cacheKey, JSON.stringify(updatedStats), "EX", 600); // Cache for 10 minutes

        res.status(201).json({
            message: "Investment added successfully",
            investment: newInvestment,
        });
    } catch (error) {
        console.error("❌ Error adding investment:", error);
        res.status(500).json({ message: "Error adding investment", error: error.message });
    }
};

exports.searchInvestments = async (req, res) => {
    try {
        const { proposalTitle, industry, amount, status } = req.query;
        const filter = {};

        // Add filters based on query params
        if (proposalTitle) filter["proposal.title"] = { $regex: proposalTitle, $options: "i" }; // case-insensitive search
        if (industry) filter.industry = { $regex: industry, $options: "i" };
        if (amount) filter.amount = { $gte: amount }; // greater than or equal to amount
        if (status) filter.status = status;

        // Populate proposal and investor fields
        const investments = await Investment.find(filter)
            .populate("investor", "name email")
            .populate("proposal", "title industry fundingGoal status")  // Ensure proposal is populated
            .sort({ createdAt: -1 }); // Sort by creation date

        if (investments.length === 0) {
            return res.status(404).json({ message: "No investments found matching your criteria" });
        }

        res.status(200).json(investments);
    } catch (error) {
        console.error("❌ Error searching investments:", error);
        res.status(500).json({ message: "Error searching investments", error: error.message });
    }
};

