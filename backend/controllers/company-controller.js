const Company = require("../models/company-model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads/logos directory exists
const logoUploadPath = path.join(__dirname, "../uploads/logos");

if (!fs.existsSync(logoUploadPath)) {
  fs.mkdirSync(logoUploadPath, { recursive: true });
}

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoUploadPath); // Directory to save logos
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

// Middleware to handle file upload
exports.uploadLogo = upload.single("logo");

// Controller to get companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch companies", error: err.message });
  }
};

// Controller to add a company
exports.addCompany = async (req, res) => {
  try {
    const companyData = req.body;

    // If a logo is uploaded, save its path
    if (req.file) {
      companyData.logo = `/uploads/logos/${req.file.filename}`; // Save relative path for the logo
    }

    const company = new Company(companyData);
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add company", error: err.message });
  }
};

// Controller to update a company
exports.updateCompany = async (req, res) => {
  try {
    const updatedData = req.body;

    // If a new logo is uploaded, update the logo path
    if (req.file) {
      updatedData.logo = `/uploads/logos/${req.file.filename}`; // Save relative path for the logo
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true, // Return the updated document
      }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update company", error: err.message });
  }
};
