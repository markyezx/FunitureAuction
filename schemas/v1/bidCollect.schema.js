const mongoose = require("mongoose");

const bidCollectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    bidAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
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

const UserAuction = mongoose.model("UserAuction", bidCollectSchema);

module.exports = UserAuction;
