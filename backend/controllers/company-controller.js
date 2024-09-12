const Company = require("../models/company-model");
const multer = require("multer");
const path = require("path");

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/logos"); // Directory to save logos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.addCompany = async (req, res) => {
  try {
    const companyData = req.body;
    if (req.file) {
      companyData.logo = `/uploads/logos/${req.file.filename}`; // Save file path in the database
    }
    const company = new Company(companyData);
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      updatedData.logo = `/uploads/logos/${req.file.filename}`; // Update file path if logo is uploaded
    }
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );
    res.json(company);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Middleware to handle file upload
exports.uploadLogo = upload.single("logo");
