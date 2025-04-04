// const Payment = require('../models/Payment');
// const { createStripePayment, createRazorpayPayment } = require('../services/paymentService');

// exports.initiatePayment = async (req, res) => {
//   const { investorId, startupId, proposalId, amount, gateway } = req.body;

//   try {
//     let transactionId;
//     if (gateway === 'Stripe') {
//       transactionId = await createStripePayment(investorId, startupId, proposalId, amount);
//     } else if (gateway === 'Razorpay') {
//       transactionId = await createRazorpayPayment(investorId, startupId, proposalId, amount);
//     } else {
//       return res.status(400).json({ error: 'Invalid payment gateway' });
//     }

//     const payment = new Payment({ investorId, startupId, proposalId, amount, transactionId, paymentGateway: gateway });
//     await payment.save();

//     res.json({ success: true, transactionId });
//   } catch (error) {
//     console.error('Payment initiation failed:', error);
//     res.status(500).json({ error: 'Payment initiation failed' });
//   }
// };
