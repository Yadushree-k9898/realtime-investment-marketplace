const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  transactionId: { type: String, required: true },
  paymentGateway: { type: String, enum: ['Stripe', 'Razorpay'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
