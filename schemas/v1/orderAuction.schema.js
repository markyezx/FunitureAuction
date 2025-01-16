const mongoose = require("mongoose");

const orderAuctionSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    lastBidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
    },
    paymentDetails: {
      stripePaymentId: { type: String, required: true },
      amountCharged: { type: Number, required: true },
      currency: { type: String, required: true },
      paymentDate: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

const OrderAuction = mongoose.model("OrderAuction", orderAuctionSchema);

module.exports = OrderAuction;
