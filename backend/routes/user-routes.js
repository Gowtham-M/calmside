const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();
const userController = require("../controllers/user-controller");

// Route to add a superuser (to be done via Postman)
router.post("/superuser", userController.addSuperUser);

// Route to add a company admin (requires superuser privileges)
router.post(
  "/admin",
  userController.authMiddleware(["superuser"]),
  userController.addCompanyAdmin
);

// Login for both superusers and company admins
router.post("/login", userController.login);

module.exports = router;
