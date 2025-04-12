const express = require("express");
const { 
    investorStats, 
    investInProposal, 
    fundingTrends, 
    getTotalInvestments,
    searchInvestments 
} = require("../controllers/investmentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Stats route should be before parameterized routes
router.get('/stats', protect, investorStats);  

// Get funding trends - Protected route
router.get("/trends", protect, fundingTrends); // Get funding trends

// Get total investments - Protected route
router.get("/total", protect, getTotalInvestments); // Get total investments

// Invest in a proposal - Protected route
router.post("/:id", protect, investInProposal); // Invest in a proposal
router.get("/search", protect, searchInvestments); // Invest in a proposal

module.exports = router;
