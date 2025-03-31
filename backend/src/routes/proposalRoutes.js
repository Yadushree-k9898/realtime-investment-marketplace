const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");
const {
  createProposal,
  getProposals,
  getProposal,
  updateProposal,
  deleteProposal,
  addCommentToProposal,
  searchProposals,  // Included in the same object
} = require("../controllers/proposalController");

const router = express.Router();

router.get("/search", protect, searchProposals); // Move this above "/:id"

router.post("/", protect, authorizeRole("founder"), createProposal);
router.get("/", protect, getProposals);
router.get("/:id", protect, getProposal);
router.put("/:id", protect, authorizeRole("founder"), updateProposal);
router.delete("/:id", protect, authorizeRole("founder"), deleteProposal);
router.post("/:id/comments", protect, addCommentToProposal);

module.exports = router;
