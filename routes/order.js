const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session & save order
router.post("/create-session", async (req, res) => {
  try {
    const { userId, items } = req.body; // items = [{ productId, quantity }]
    const products = await Product.find({ _id: { $in: items.map(i => i.productId) } });

    const line_items = products.map(product => {
      const item = items.find(i => i.productId == product._id.toString());
      return {
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Save order in MongoDB
    const order = new Order({
      user: userId,
      products: items,
      stripeSessionId: session.id,
      amountTotal: session.amount_total || 0,
      paymentStatus: "unpaid",
    });

    await order.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
