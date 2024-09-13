const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    category: { type: String, default: "others" },
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: Array },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
