const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema(
    {
        investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Investor ID
        amount: { type: Number, required: true },  // Amount invested by the investor
        industry: { type: String, required: true }, 
        proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal", required: true }, 
        equityOwnership: { type: Number, default: 0 }, // Percentage of ownership in the proposal/company
        investmentType: { type: String, enum: ['equity', 'debt', 'convertible'], required: true }, // Type of investment (e.g., equity, debt)
        investmentStage: { type: String, enum: ['seed', 'seriesA', 'seriesB', 'IPO'], required: true }, // Stage of investment
        status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' }, // Investment status
        returns: { type: Number, default: 0 }, // The actual returns from the investment
        roi: { type: Number, default: 0 }, // ROI calculated dynamically
    },
    { timestamps: true }  // Automatically adds `createdAt` and `updatedAt`
);

const Investment = mongoose.model("Investment", InvestmentSchema);

module.exports = Investment;
