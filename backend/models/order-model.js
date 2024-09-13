const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    branchName: { type: String },
    orderID: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
