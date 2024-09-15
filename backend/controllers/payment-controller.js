const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const UserOrders = require("../models/order-model");
const Ledger = require("../models/ledger-model");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.getProductPage = (req, res) => {
  res.render("product", { key: process.env.RAZORPAY_ID_KEY });
};
// Used primarily for processing orders, tracking their status, and managing transactions.
exports.createOrder = async (req, res) => {
  const { amount, items, phoneNumber, company } = req.body;
  // Razorpay options
  const options = {
    amount: amount * 100, // amount in smallest currency unit (e.g., paisa for INR)
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    // Create and save order in the database (UserOrders)
    const userOrders = new UserOrders({
      company,
      phoneNumber,
      items,
      totalAmount: amount,
      status: "Pending", // Initially setting the status to Pending
      razorOrderID: order.id, // Add razorOrderID to the UserOrders document
    });
    await userOrders.save();

    // Now, save the order in the ledger for the company
    const ledgerEntry = {
      company,
      orderID: order.id, // Using Razorpay order ID
      userPhoneNumber: phoneNumber,
      orderDate: new Date(),
      orderDetails: items,
      totalAmount: amount,
      paymentStatus: "Pending", // Default payment status
    };

    await Ledger.create(ledgerEntry); // Save order details to the ledger

    res
      .status(200)
      .json({ success: true, order, key: process.env.RAZORPAY_ID_KEY });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.paymentSuccess = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    // Update payment status in the ledger
    await Ledger.updateOne(
      { orderID: razorpay_order_id },
      { $set: { paymentStatus: "Completed" } }
    );

    res.json({ success: true, message: "Payment verified successfully!" });
  } else {
    // Update payment status in the ledger for failure
    await Ledger.updateOne(
      { orderID: razorpay_order_id },
      { $set: { paymentStatus: "Failed" } }
    );
    res
      .status(400)
      .json({ success: false, message: "Invalid payment signature!" });
  }
};

exports.paymentFailed = async (req, res) => {
  const { razorpay_order_id } = req.body;

  try {
    // Update payment status in the ledger for failure
    await Ledger.updateOne(
      { orderID: razorpay_order_id },
      { $set: { paymentStatus: "Failed" } }
    );

    res.json({ success: true, message: "Payment marked as failed!" });
  } catch (error) {
    res.status(500).json({ message: "Error marking payment as failed" });
  }
};
