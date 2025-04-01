const express = require("express");
const { 
    investInProposal, 
    investorStats, 
    fundingTrends, 
    getInvestmentROI, 
    searchInvestments, 
    setDefaultReturns 
} = require("../controllers/investmentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get investor stats (including ROI) - Protected route
router.get('/investor-stats', protect, investorStats);  

// Get funding trends - Protected route
router.get("/trends", protect, fundingTrends); // Get funding trends

// Get investment ROI - Protected route
router.get("/roi", protect, getInvestmentROI); // Get investment ROI

// Invest in a proposal - Protected route
router.post("/:id/invest", protect, investInProposal); // Invest in a proposal

// Search investments - Protected route
router.get("/search", protect, searchInvestments); // Search investments

// Set default returns for investments without returns - Protected route
router.get("/update-returns", protect, setDefaultReturns); // Update returns to 0 for investments without returns

module.exports = router;
