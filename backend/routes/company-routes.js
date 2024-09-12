const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company-controller");
const userController = require("../controllers/user-controller");

router.get("/", companyController.getCompanies);
router.post("/", companyController.uploadLogo, companyController.addCompany); // Handles logo upload
router.put(
  "/:id",
  companyController.uploadLogo,
  companyController.updateCompany
); // Handles logo update
router.get("/admins/:id", userController.getAdmins);
router.post("/admins", userController.addCompanyAdmin);
router.put("/admins/:id", userController.updateAdmins);

module.exports = router;
