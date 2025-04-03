const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
  {
    founder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fundingGoal: { type: Number, required: true, min: 0 },
    currentFunding: { type: Number, default: 0 },
    returns: { type: Number, default: 0 },  // Added returns field
    status: { type: String, enum: ["Under Review", "Negotiating", "Funded"], default: "Under Review" },
    industry: { type: String, required: false }, // Optional industry field
    investors: [
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

// Update the returns for a proposal based on the current funding and funding goal
ProposalSchema.methods.updateProposalReturns = async function () {
    const performanceMultiplier = 1.2; // Example: 20% growth for the proposal
    const totalReturns = this.currentFunding * performanceMultiplier;

    this.returns = totalReturns;
    await this.save(); // Save the updated proposal
};

// Method to add or update an investor's contribution in the proposal
ProposalSchema.methods.updateInvestor = async function (investorId, amount) {
  const existingInvestor = this.investors.find(
    (inv) => inv.investor.toString() === investorId.toString()
  );

  if (existingInvestor) {
    // If the investor already exists, update their investment amount
    existingInvestor.amount += amount;
  } else {
    // If the investor does not exist, add them to the investors list
    this.investors.push({ investor: investorId, amount });
  }

  // Update the current funding
  this.currentFunding += amount;

  // Update the returns based on the new current funding
  await this.updateProposalReturns();
  
  // Save the updated proposal
  await this.save();
};

module.exports = mongoose.model("Proposal", ProposalSchema);
