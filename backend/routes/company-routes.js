const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company-controller");
const userController = require("../controllers/user-controller");

router.get("/", companyController.getCompanies);
router.post("/", companyController.addCompany);
router.put("/:id", companyController.updateCompany); //add update function
router.get("/admins", userController.getAdmins);
router.post("/admins", userController.addCompanyAdmin);
router.put("/admins/:id", userController.updateAdmins);

module.exports = router;
