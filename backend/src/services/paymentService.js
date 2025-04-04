// const Stripe = require('stripe');
// const Razorpay = require('razorpay');
// const Payment = require('../models/Payment');
// const { stripeSecretKey, razorpayKeyId, razorpayKeySecret } = require('../config/paymentConfig');

// const stripe = new Stripe(stripeSecretKey);
// const razorpay = new Razorpay({
//   key_id: razorpayKeyId,
//   key_secret: razorpayKeySecret,
// });

// async function createStripePayment(investorId, startupId, proposalId, amount) {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amount * 100, // Stripe works in cents
//     currency: 'usd',
//     metadata: { investorId, startupId, proposalId },
//   });

//   return paymentIntent.client_secret;
// }

// async function createRazorpayPayment(investorId, startupId, proposalId, amount) {
//   const order = await razorpay.orders.create({
//     amount: amount * 100, // Razorpay works in paise
//     currency: 'INR',
//     receipt: `receipt_${Date.now()}`,
//   });

//   return order.id;
// }

// async function updatePaymentStatus(transactionId, status) {
//   return await Payment.findOneAndUpdate(
//     { transactionId },
//     { status },
//     { new: true }
//   );
// }

// module.exports = { createStripePayment, createRazorpayPayment, updatePaymentStatus };
