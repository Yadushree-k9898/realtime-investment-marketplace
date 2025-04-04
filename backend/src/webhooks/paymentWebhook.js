// const Payment = require('../models/Payment');
// const { updatePaymentStatus } = require('../services/paymentService');
// const { stripeSecretKey } = require('../config/paymentConfig');
// const Stripe = require('stripe');
// const stripe = new Stripe(stripeSecretKey);

// exports.handleWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'payment_intent.succeeded') {
//     const transactionId = event.data.object.id;
//     await updatePaymentStatus(transactionId, 'Completed');
//   } else if (event.type === 'payment_intent.payment_failed') {
//     const transactionId = event.data.object.id;
//     await updatePaymentStatus(transactionId, 'Failed');
//   }

//   res.json({ received: true });
// };
