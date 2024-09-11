// Import mongoose
const mongoose = require("mongoose");

// Define the FoodItem schema
const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name of the food item is mandatory
    trim: true, // Removes extra spaces from the name
  },
  pricePerUnit: {
    type: Number,
    required: true, // Price per unit is mandatory
    min: 0, // Price can't be negative
  },
  unit: {
    type: String,
    required: true, // Unit is mandatory (e.g., kg, lb, piece)
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date when created
  },
});

// Create the model for the FoodItem collection
const FoodItem = mongoose.model("FoodItem", foodItemSchema);

module.exports = FoodItem;
