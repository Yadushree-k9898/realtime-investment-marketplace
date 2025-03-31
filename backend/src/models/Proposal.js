const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
  {
    founder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fundingGoal: { type: Number, required: true, min: 0 },
    currentFunding: { type: Number, default: 0 },
    status: { type: String, enum: ["Under Review", "Negotiating", "Funded"], default: "Under Review" },
    industry: { type: String, required: false }, // Optional industry field
    investors: [ // Array of investors
      {
        investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true }
      }
    ],
    comments: [ // Array of comments
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Indexes to optimize search and filtering
ProposalSchema.index({ founder: 1 });
ProposalSchema.index({ status: 1 });
ProposalSchema.index({ industry: 1 });
ProposalSchema.index({ fundingGoal: 1 }); // Consider adding an index for fundingGoal

// Pre-save hook to check if the investor is already added
ProposalSchema.pre('save', function(next) {
  if (this.isModified('investors')) {
    const investorIds = this.investors.map(inv => inv.investor.toString());
    const uniqueInvestorIds = new Set(investorIds);
    if (uniqueInvestorIds.size !== investorIds.length) {
      return next(new Error('An investor can only invest once in the same proposal.'));
    }
  }
  next();
});

module.exports = mongoose.model("Proposal", ProposalSchema);
