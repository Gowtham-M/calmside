const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    branchName: { type: String },
    address: { type: String, required: true },
    upiId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    logo: { type: String }, // Store the logo as a URL or file path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
