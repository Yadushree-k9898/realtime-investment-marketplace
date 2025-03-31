const express = require("express");
const { investorStats, fundingTrends, investmentROI, investInProposal } = require("../controllers/investmentController");
const { protect } = require("../middlewares/authMiddleware");
const { searchInvestments } = require('../controllers/investmentController');

const router = express.Router();

router.get("/stats", protect, investorStats);
router.get("/trends", protect, fundingTrends);
router.get("/roi", protect, investmentROI);
router.post("/:id/invest", protect, investInProposal);
router.get('/search', searchInvestments);

module.exports = router;
