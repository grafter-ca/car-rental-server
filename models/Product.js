const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }, // store in cents
  image: { type: String },
  stripeProductId: { type: String }, // optional, link to Stripe
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
