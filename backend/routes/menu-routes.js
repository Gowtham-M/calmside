const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu-controller");

// Setup multer for file uploads
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/menu-images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routes
router.post(
  "/upload",
  upload.array("images", 10),
  menuController.uploadImagesHandler
);

router.get("/admin/:id", menuController.getMenuItems);
router.post("/admin", menuController.addMenuItem);
router.put("/admin/:id", menuController.updateMenuItem);

// User menu routes
router.get("/:id", menuController.getUserMenuItems);

module.exports = router;
