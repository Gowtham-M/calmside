const Ledger = require("../models/ledger-model");

const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

exports.downloadLedger = async (req, res) => {
  try {
    const { companyId, phoneNumber, startDate, endDate, format } = req.query;

    // Fetch ledger based on filters
    const query = { companyId };
    if (phoneNumber) query.userPhoneNumber = phoneNumber;
    if (startDate && endDate)
      query.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const ledger = await Ledger.find(query);

    if (format === "excel") {
      // Generate Excel file
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Ledger");

      // Add headers
      sheet.columns = [
        { header: "Order ID", key: "orderId", width: 15 },
        { header: "Customer Phone", key: "userPhoneNumber", width: 20 },
        { header: "Order Date", key: "orderDate", width: 20 },
        { header: "Total Amount", key: "totalAmount", width: 15 },
      ];

      // Add rows
      ledger.forEach((entry) => {
        sheet.addRow({
          orderId: entry.orderId,
          userPhoneNumber: entry.userPhoneNumber,
          orderDate: entry.orderDate.toDateString(),
          totalAmount: entry.totalAmount,
        });
      });

      // Send Excel file as response
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="ledger.xlsx"'
      );

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    } else if (format === "pdf") {
      // Generate PDF file
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="ledger.pdf"');

      doc.pipe(res);

      // Add ledger data to the PDF
      doc.fontSize(12).text("Ledger Report", { align: "center" });
      ledger.forEach((entry) => {
        doc
          .text(`Order ID: ${entry.orderId}`)
          .text(`Customer Phone: ${entry.userPhoneNumber}`)
          .text(`Order Date: ${entry.orderDate.toDateString()}`)
          .text(`Total Amount: ${entry.totalAmount}`)
          .moveDown();
      });

      doc.end();
    }
  } catch (error) {
    res.status(500).json({ message: "Error downloading ledger" });
  }
};

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
