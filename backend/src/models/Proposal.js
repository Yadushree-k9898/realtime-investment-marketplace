const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
  {
    founder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fundingGoal: { type: Number, required: true, min: 0 },
    currentFunding: { type: Number, default: 0 }, // Add this field if missing
    status: { type: String, enum: ["Under Review", "Negotiating", "Funded"], default: "Under Review" },
    investors: [ // ✅ Add investors field
      {
        investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true }
      }
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

ProposalSchema.index({ founder: 1 });
ProposalSchema.index({ status: 1 });

module.exports = mongoose.model("Proposal", ProposalSchema);
