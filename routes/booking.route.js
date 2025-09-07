const express = require("express");
const Stripe = require("stripe");

const Booking = require("../models/Booking");
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
  try {
    const { clerkUserId, cart } = req.body;

    if (!clerkUserId) {
      return res.status(400).json({ error: "User not authenticated" });
    }
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    let line_items = [];
    let bookings = [];

    for (const item of cart) {
      // Save booking in MongoDB
      const booking = await Booking.create({
        clerkUserId,
        productName: item.name,
        hygraphProductId: item.hygraphId,
        quantity: item.quantity,
        totalAmount:req.body.totalAmount,
        status: "pending",
        bookingDetails: req.body.bookingDetails, // ✅ save extra info
      });

      bookings.push(booking);

      // Prepare Stripe line item
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.price * 100, // cents per unit
        },
        quantity: item.quantity,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Update bookings with Stripe session ID
    for (const booking of bookings) {
      booking.stripeSessionId = session.id;
      await booking.save();
    }

    res.json({ url: session.url, bookings });
  } catch (err) {
    console.error("Booking checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
