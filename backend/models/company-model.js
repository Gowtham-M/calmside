const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    branchName: { type: String },
    address: { type: String, required: true },
    upiId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
