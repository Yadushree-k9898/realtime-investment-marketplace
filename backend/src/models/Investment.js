const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema({
    investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    industry: { type: String, required: true },
    proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }
});

const Investment = mongoose.model("Investment", InvestmentSchema);
module.exports = Investment;