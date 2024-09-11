const FoodItem = require("../models/items-model");

class FoodItemController {
  // Create a new food item
  async create(req, res) {
    try {
      const { name, pricePerUnit, unit } = req.body;

      // Create a new instance of the FoodItem model
      const foodItem = new FoodItem({ name, pricePerUnit, unit });

      // Save the food item to the database
      const savedFoodItem = await foodItem.save();
      return res.status(201).json(savedFoodItem);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating food item", error });
    }
  }

  // Get all food items
  async getAll(req, res) {
    try {
      const foodItems = await FoodItem.find();
      return res.status(200).json(foodItems);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching food items", error });
    }
  }

  // Get a single food item by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const foodItem = await FoodItem.findById(id);

      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }

      return res.status(200).json(foodItem);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching food item", error });
    }
  }

  // Update a food item by ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, pricePerUnit, unit } = req.body;

      // Find the food item by ID and update its details
      const updatedFoodItem = await FoodItem.findByIdAndUpdate(
        id,
        { name, pricePerUnit, unit },
        { new: true, runValidators: true }
      );

      if (!updatedFoodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }

      return res.status(200).json(updatedFoodItem);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating food item", error });
    }
  }

  // Delete a food item by ID
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Find and delete the food item
      const deletedFoodItem = await FoodItem.findByIdAndDelete(id);

      if (!deletedFoodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }

      return res
        .status(200)
        .json({ message: "Food item deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting food item", error });
    }
  }
}

// Export an instance of the FoodItemController class
module.exports = new FoodItemController();
