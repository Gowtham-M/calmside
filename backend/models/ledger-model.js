const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  userPhoneNumber: { type: String },
  orderDate: { type: Date },
  orderDetails: { type: Array }, // Array of order items, with each item containing relevant details
  totalAmount: { type: Number },
});

module.exports = mongoose.model("Ledger", ledgerSchema);
