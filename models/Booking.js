const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true }, // Clerk user ID
    productName: String,
    hygraphProductId: String,
    quantity: Number,
    totalAmount: Number,
    stripeSessionId: String,
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },

    // Extra booking details
    bookingDetails: {
      startDate: Date,
      endDate: Date,
      pickupLocation: String,
      dropoffLocation: String,
      notes: String,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
