const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
  {
    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    fundingGoal: {
      type: Number,
      required: true,
    },
    currentFunding: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Under Review", "Negotiating", "Funded"],
      default: "Under Review",
    },
    investors: [
      {
        investor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
      },
    ],
    comments: [ // ✅ Added comments field
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", ProposalSchema);
