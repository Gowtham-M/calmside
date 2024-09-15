const mongoose = require("mongoose");
const crypto = require("crypto");

const OrderSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    branchName: { type: String },
    orderID: {
      type: String,
      unique: true,
      // required: true,
    },
    razorOrderID: { type: String, unique: true },
    tableID: {
      type: String,
      // required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number },
    status: {
      type: String,
      enum: [
        "Pending",
        "Placed",
        "Received",
        "Preparing",
        "Delivered",
        "Cancelled",
      ],
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

// Middleware to generate unique order ID before saving
OrderSchema.pre("save", function (next) {
  if (!this.orderID) {
    // Generate a short and descriptive order ID
    const randomNumber = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
    this.orderID = `${this.company
      .substring(0, 3)
      .toUpperCase()}-${randomNumber}`;
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
