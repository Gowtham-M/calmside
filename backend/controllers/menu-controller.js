const MenuItem = require("../models/menuItem-model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads/menu-images directory exists
const menuImagesUploadPath = path.join(__dirname, "../uploads/menu-images");

if (!fs.existsSync(menuImagesUploadPath)) {
  fs.mkdirSync(menuImagesUploadPath, { recursive: true });
}

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, menuImagesUploadPath); // Directory to save menu item images
  },
  filename: (req, file, cb) => {
    // Generate a unique file name using timestamp and original file name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept image files only
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Middleware to handle file uploads
exports.uploadImages = upload.array("images", 10); // Accept up to 10 images

// Controller to upload images
exports.uploadImagesHandler = (req, res) => {
  if (req.files && req.files.length > 0) {
    const imageUrls = req.files.map(
      (file) => `/uploads/menu-images/${file.filename}`
    );
    res.json({ imageUrls });
  } else {
    res.status(400).json({ message: "No files uploaded" });
  }
};

// Controller to add a menu item
exports.addMenuItem = async (req, res) => {
  const { itemName, category, price, company } = req.body;
  const imageUrl = req.body.imageUrl || []; // Image URLs from frontend

  try {
    const newMenuItem = new MenuItem({
      itemName,
      category,
      price,
      company,
      imageUrl,
    });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add menu item" });
  }
};

// Controller to update an existing menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const existingItem = await MenuItem.findById(req.params.id);

    if (!existingItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Append new images to existing images
    const updatedImageUrls = [
      ...(existingItem.imageUrl || []),
      ...(req.body.imageUrl || []),
    ];

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, imageUrl: updatedImageUrls },
      { new: true }
    );

    res.json(updatedItem);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ company: req.params.id });
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ company: req.params.id });
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
};
