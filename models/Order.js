// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  stripeSessionId: { type: String }, // link to Stripe checkout session
  stripePaymentIntentId: { type: String }, // link to payment intent
  amountTotal: { type: Number },
  currency: { type: String, default: "usd" },
  paymentStatus: { type: String, enum: ["paid", "unpaid", "canceled"], default: "unpaid" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
