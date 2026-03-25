const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-intent', async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        // Stripe expects amount in cents/paisa
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'inr',
            metadata: { orderId: orderId },
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('❌ Stripe Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
