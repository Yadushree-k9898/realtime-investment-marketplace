const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");
const {
  createProposal,
  getProposals,
  getProposal,
  updateProposal,
  deleteProposal,
  investInProposal,
  addCommentToProposal, // ✅ Add this
} = require("../controllers/proposalController");
// const { authorizeRole } = require("../middlewares/roleMiddleware"); 

const router = express.Router();

// Proposal routes
router.post("/", protect, authorizeRole("founder"), createProposal);
router.get("/", protect, getProposals);
router.get("/:id", protect, getProposal);
router.put("/:id", protect, authorizeRole("founder"), updateProposal);
router.delete("/:id", protect, authorizeRole("founder"), deleteProposal);
router.post("/:id/invest", protect, authorizeRole("investor"), investInProposal);
router.post("/:id/comments", protect, addCommentToProposal); // ✅ Add comment route

module.exports = router;
