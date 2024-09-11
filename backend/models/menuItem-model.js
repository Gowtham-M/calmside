const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    category: String,
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
