const express = require("express");
const router = express.Router();
const FoodItemController = require("../controllers/one-time-orders  ");

// Create a new food item
router.post("/", FoodItemController.create);

// Get all food items
router.get("/", FoodItemController.getAll);

// Get a single food item by ID
router.get("/:id", FoodItemController.getById);

// Update a food item by ID
router.put("/:id", FoodItemController.update);

// Delete a food item by ID
router.delete("/:id", FoodItemController.delete);

module.exports = router;
