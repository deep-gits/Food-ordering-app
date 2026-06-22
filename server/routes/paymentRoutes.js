const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @desc    Create Stripe PaymentIntent (simulated)
// @route   POST /api/payment/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise/cents

    // SIMULATED: In production, use real Stripe:
    // const stripe = require('../config/stripe');
    // const paymentIntent = await stripe.paymentIntents.create({ amount, currency: 'inr' });
    // res.json({ clientSecret: paymentIntent.client_secret });

    // Simulated response
    res.json({
      clientSecret: `pi_simulated_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      amount,
      currency: 'inr',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
