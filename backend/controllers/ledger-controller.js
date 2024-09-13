const Ledger = require("../models/ledger-model");

exports.getLedger = async (req, res) => {
  try {
    const { companyId, phoneNumber, startDate, endDate } = req.query;

    const query = { companyId };
    if (phoneNumber) query.userPhoneNumber = phoneNumber;
    if (startDate && endDate)
      query.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const ledger = await Ledger.find(query);
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ledger data" });
  }
};
