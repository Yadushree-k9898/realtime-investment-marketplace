const Proposal = require("../models/Proposal");
const User = require("../models/User");
const mongoose = require("mongoose");
const redis = require("../config/redis"); 


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

    
    redis.del("proposals:*");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getProposals = async (req, res) => {
  try {
    const { status } = req.query; 
    const filter = {};

    if (status) {
      if (!["Under Review", "Negotiating", "Funded"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      filter.status = status;
    }

    const cacheKey = `proposals:${JSON.stringify(filter)}`;


    redis.get(cacheKey, async (err, cachedData) => {
      if (err) {
        console.error("Redis error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
      }

      if (cachedData) {
        // Cache hit - return data from Redis
        return res.json(JSON.parse(cachedData));
      } else {
        // Cache miss - query database and store the result in Redis
        const proposals = await Proposal.find(filter)
          .populate("founder", "name email")
          .populate("investors.investor", "name email")
          .populate("comments.user", "name email");

        // Store data in Redis for future use
        redis.setex(cacheKey, 3600, JSON.stringify(proposals)); // Cache data for 1 hour
        return res.json(proposals);
      }
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query; // Optional status filter

    console.log('Received Proposal ID:', id);  // Debugging log for received ID

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid Proposal ID format:', id);  // Log invalid ID format
      return res.status(400).json({ message: "Invalid proposal ID" });
    }

    // Proceed with the rest of the logic
    const filter = { _id: id };
    if (status) {
      if (!["Under Review", "Negotiating", "Funded"].includes(status)) {
        console.log('Invalid status value:', status);  // Log invalid status value
        return res.status(400).json({ message: "Invalid status value" });
      }
      filter.status = status;
    }

    const cacheKey = `proposal:${id}`;
    console.log('Cache Key:', cacheKey);  // Log the cache key being used

    // Check cache first
    redis.get(cacheKey, async (err, cachedData) => {
      if (err) {
        console.error("Redis error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
      }

      if (cachedData) {
        console.log('Cache hit for proposal:', id);  // Log cache hit
        return res.status(200).json(JSON.parse(cachedData));
      } else {
        console.log('Cache miss for proposal:', id);  // Log cache miss
        // Cache miss - query database and store the result in Redis
        const proposal = await Proposal.findOne(filter)
          .populate("founder", "name email")
          .populate("investors.investor", "name email")
          .populate("comments.user", "name email")
          .lean();

        if (!proposal) {
          console.log('Proposal not found in database:', id);  // Log proposal not found
          return res.status(404).json({ message: "Proposal not found" });
        }

        // Store data in Redis for future use
        redis.setex(cacheKey, 3600, JSON.stringify(proposal)); // Cache data for 1 hour
        console.log('Stored proposal in cache:', id);  // Log data being cached
        return res.status(200).json(proposal);
      }
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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

    // Clear the cache as the proposal was updated
    redis.del(`proposal:${proposal._id}`);
    redis.del("proposals:*");

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

    // Clear the cache as the proposal was deleted
    redis.del(`proposal:${proposal._id}`);
    redis.del("proposals:*");

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

    // Clear cache after investment is made
    redis.del(`proposal:${proposal._id}`);
    redis.del("proposals:*");

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

    // Clear cache after comment is added
    redis.del(`proposal:${proposal._id}`);
    redis.del("proposals:*");

    res.status(201).json({ message: "Comment added successfully", proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.searchProposals = async (req, res) => {
  try {
    const { title, industry, fundingGoal, status } = req.query;
    let searchConditions = {};

    if (title) {
      searchConditions.title = { $regex: title, $options: 'i' }; // Case-insensitive match
    }
    if (industry) {
      searchConditions.industry = { $regex: industry, $options: 'i' }; // Case-insensitive match
    }
    if (fundingGoal) {
      searchConditions.fundingGoal = { $lte: fundingGoal }; // Filter by fundingGoal
    }
    if (status) {
      searchConditions.status = status;
    }

    const proposals = await Proposal.find(searchConditions);

    if (!proposals.length) {
      return res.status(404).json({ message: "No proposals found" });
    }

    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


