const Proposal = require("../models/Proposal");
const User = require("../models/User");

// Create Proposal (Only for Founders)
exports.createProposal = async (req, res) => {
  try {
    if (req.user.role !== "founder") {
      return res.status(403).json({ message: "Only founders can create proposals" });
    }

    const { title, description, fundingGoal } = req.body;
    const proposal = new Proposal({
      founder: req.user.id,
      title,
      description,
      fundingGoal,
    });

    await proposal.save();
    res.status(201).json({ message: "Proposal created successfully", proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Proposals
exports.getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find().populate("founder", "name email");
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Single Proposal
exports.getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate("founder", "name email");
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Proposal (Only Founder)
exports.updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.founder.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this proposal" });
    }

    Object.assign(proposal, req.body);
    await proposal.save();

    res.json({ message: "Proposal updated successfully", proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Delete Proposal (Only Founder)
exports.deleteProposal = async (req, res) => {
    try {
      const proposal = await Proposal.findById(req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
  
      if (proposal.founder.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this proposal" });
      }
  
      await Proposal.findByIdAndDelete(req.params.id); // ✅ Corrected deletion method
      res.json({ message: "Proposal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  exports.investInProposal = async (req, res) => {
    try {
      if (req.user.role !== "investor") {
        return res.status(403).json({ message: "Only investors can invest" });
      }
  
      const { amount } = req.body;
      const proposal = await Proposal.findById(req.params.id);
  
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
  
      // ✅ Ensure investors array is initialized
      if (!proposal.investors) {
        proposal.investors = [];
      }
  
      proposal.investors.push({ investor: req.user.id, amount });
      proposal.currentFunding += amount;
  
      if (proposal.currentFunding >= proposal.fundingGoal) {
        proposal.status = "Funded";
      }
  
      await proposal.save();
      res.json({ message: "Investment successful", proposal });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
// Add Comment to a Proposal
exports.addCommentToProposal = async (req, res) => {
    try {
      const proposal = await Proposal.findById(req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
  
      const comment = {
        user: req.user.id,
        text: req.body.comment,
        createdAt: new Date(),
      };
  
      proposal.comments.push(comment);
      await proposal.save();
  
      res.status(201).json({ message: "Comment added successfully", proposal });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  