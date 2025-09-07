const express = require("express");
const Stripe = require("stripe");
const Booking = require("../models/Booking");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Raw body middleware needed for Stripe signatures
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET // Get this from Stripe Dashboard
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Find booking by Stripe session ID and update status
        const booking = await Booking.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: "paid" },
          { new: true }
        );

        console.log("✅ Booking updated to paid:", booking?._id);
      } catch (err) {
        console.error("Error updating booking status:", err);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
