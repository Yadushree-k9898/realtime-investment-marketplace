const Proposal = require("../models/Proposal");
const User = require("../models/User");
const mongoose = require('mongoose')

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

// Get All Proposals (With Optional Status Filter)
exports.getProposals = async (req, res) => {
  try {
    const { status } = req.query; // Get status from query params
    const filter = {};

    if (status) {
      if (!["Under Review", "Negotiating", "Funded"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      filter.status = status;
    }

    const proposals = await Proposal.find(filter)
      .populate("founder", "name email")
      .populate("investors.investor", "name email")
      .populate("comments.user", "name email");

    res.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get Specific Proposal (Optional: Ensure Status)
exports.getProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query; // Optional status filter

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid proposal ID" });
    }

    const filter = { _id: id };
    if (status) {
      if (!["Under Review", "Negotiating", "Funded"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      filter.status = status;
    }

    const proposal = await Proposal.findOne(filter)
      .populate("founder", "name email")
      .populate("investors.investor", "name email")
      .populate("comments.user", "name email")
      .lean();

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// exports.getProposal = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const proposal = await Proposal.findById(id)
//       .populate("founder", "name email")
//       .populate("investors.investor", "name email")
//       .populate("comments.user", "name email");

//     if (!proposal) {
//       return res.status(404).json({ message: "Proposal not found" });
//     }

//     res.status(200).json(proposal);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// Update Proposal (Only for Founder or Admin)
exports.updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.founder.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this proposal" });
    }

    const allowedUpdates = ["title", "description", "fundingGoal", "status"];
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        proposal[key] = req.body[key];
      }
    });

    await proposal.save();

    if (req.io) {
      req.io.emit("proposalUpdated", {
        proposalId: proposal._id,
        updatedFields: req.body,
      });
    }

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

    await Proposal.findByIdAndDelete(req.params.id);
    res.json({ message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Invest in Proposal (Only for Investors)
exports.investInProposal = async (req, res) => {
  try {
    if (req.user.role !== "investor") {
      return res.status(403).json({ message: "Only investors can invest" });
    }

    const { amount } = req.body;
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid investment amount" });
    }

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

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
