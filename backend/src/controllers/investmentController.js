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
        const proposalId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(proposalId)) {
            return res.status(400).json({ message: "Invalid proposal ID" });
        }

        const proposal = await Proposal.findById(proposalId).session(session);
        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found" });
        }

        // Calculate initial values
        const returns = amount * 1.2; // 20% returns
        const roi = ((returns - amount) / amount) * 100;
        const equityOwnership = (amount / proposal.fundingGoal) * 100;
        const expectedReturn = amount * 1.5; // 50% expected return

        const investment = new Investment({
            investor: req.user.id,
            proposal: proposalId,
            amount,
            industry: industry || proposal.industry,
            investmentType,
            investmentStage,
            status: 'active',
            returns,
            roi,
            equityOwnership,
            riskLevel: 'medium',
            expectedReturn,
            performanceMetrics: {
                currentValue: amount,
                growthRate: 20,
                volatility: 10
            }
        });

        await investment.save({ session });

        // Update proposal
        proposal.currentFunding = (proposal.currentFunding || 0) + amount;
        proposal.returns = (proposal.returns || 0) + returns;
        
        if (!proposal.investors) {
            proposal.investors = [];
        }
        
        proposal.investors.push({
            investor: req.user.id,
            amount
        });

        await proposal.save({ session });
        await session.commitTransaction();

        res.status(201).json({
            message: "Investment successful",
            investment
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("❌ Error creating investment:", error);
        res.status(500).json({ message: "Error creating investment", error: error.message });
    } finally {
        session.endSession();
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
        const investments = await Investment.aggregate([
            {
                $match: {
                    createdAt: { $exists: true }
                }
            },
            {
                $group: {
                    _id: {
                        month: { 
                            $dateToString: { 
                                format: "%Y-%m", 
                                date: "$createdAt" 
                            }
                        }
                    },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                    averageAmount: { $avg: "$amount" }
                }
            },
            {
                $sort: { "_id.month": -1 }
            },
            {
                $project: {
                    _id: 0,
                    period: "$_id.month",
                    totalAmount: 1,
                    count: 1,
                    averageAmount: { $round: ["$averageAmount", 2] }
                }
            }
        ]);

        if (investments.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(investments);
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
        
        // Build base query
        let query = {};

        // Add investor filter
        if (req.user && req.user.id) {
            query.investor = new mongoose.Types.ObjectId(req.user.id);
        }

        // Add industry filter (case insensitive)
        if (industry) {
            query.industry = { $regex: industry, $options: 'i' };
        }

        // Add amount filter
        if (amount && !isNaN(parseFloat(amount))) {
            query.amount = { $gte: parseFloat(amount) };
        }

        // Add status filter only if explicitly provided and not "all"
        if (status && status !== 'all' && status !== 'undefined') {
            query.status = status.toLowerCase();
        }

        console.log('Executing Query:', JSON.stringify(query, null, 2));

        // Execute query and get results
        const investments = await Investment.find(query)
            .populate({
                path: 'proposal',
                select: 'title industry fundingGoal status createdAt'
            })
            .sort('-createdAt')
            .lean();

        console.log(`Found ${investments.length} matching investments`);

        // Format response
        const response = {
            success: true,
            message: `Found ${investments.length} investments`,
            count: investments.length,
            investments,
            appliedFilters: {
                industry: industry || 'all',
                amount: amount ? parseFloat(amount) : 'all',
                status: status || 'all'
            },
            query
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Search Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error searching investments',
            error: error.message
        });
    }
};

// Set default returns
exports.setDefaultReturns = async (req, res) => {
    try {
        const investments = await Investment.find({ investor: req.user.id });
        let updatedCount = 0;

        for (let investment of investments) {
            if (!investment.returns) {
                investment.returns = investment.amount * 1.2; // 20% returns
                await investment.save();
                updatedCount++;
            }
        }

        res.status(200).json({
            message: "Investment returns updated",
            updated: updatedCount,
            total: investments.length
        });
    } catch (error) {
        console.error("❌ Error updating returns:", error);
        res.status(500).json({ message: "Error updating returns", error: error.message });
    }
};
