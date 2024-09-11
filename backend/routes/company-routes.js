const express = require("express");
const companyController = require("../controllers/company-controller");

const router = express.Router();

router.get("/", companyController.getAllCompanies);
router.post("/", companyController.addCompany);

module.exports = router;
