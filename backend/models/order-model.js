const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    branchName: { type: String },
    order:{type:Array},
    phoneNumber:{type:String,required:true}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
