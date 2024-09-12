const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const UserOrders = require('../models/order-model')

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

exports.getProductPage = (req, res) => {
  res.render('product', { key: process.env.RAZORPAY_ID_KEY });
};

exports.createOrder = async (req, res) => {
  const { amount} = req.body
  const options = {
    amount: amount * 100, // amount in smallest currency unit (e.g., paisa for INR)
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    const userOrders = new UserOrders(req.body)
    await userOrders.save()
    res.status(200).json({ success: true, order , key: process.env.RAZORPAY_ID_KEY });
  } catch (error) {
    console.log("error",error)
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.paymentSuccess = (req, res) => {
  res.render('success', { paymentId: req.body.razorpay_payment_id });
};
