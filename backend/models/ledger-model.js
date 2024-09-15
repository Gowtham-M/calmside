const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  userPhoneNumber: { type: String },
  orderDate: { type: Date },
  orderID: {
    type: String,
    unique: true,
    required: true,
  },
  orderDetails: [
    {
      itemName: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Ledger", ledgerSchema);
