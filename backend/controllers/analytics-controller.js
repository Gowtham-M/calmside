const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.generateAnalytics = (req, res) => {
  const companyId = req.params.company; // Get companyId from URL parameter

  // Adjust the paths to your CSV and output files
  const inputFilePath = path.join(
    __dirname,
    `../data/${companyId}_order_data.csv`
  );
  const outputFilePath = path.join(
    __dirname,
    `../public/analytics/${companyId}_sales_analysis.png`
  );

  // Ensure the output directory exists
  if (!fs.existsSync(path.dirname(outputFilePath))) {
    fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  }

  exec(
    `python3 path/to/your/analytics/analyze.py ${inputFilePath} ${outputFilePath}`,
    (error) => {
      if (error) {
        return res.status(500).json({ message: "Error generating analytics" });
      }

      // Return the path to the generated image
      res.json({ imageUrl: `/analytics/${companyId}_sales_analysis.png` });
    }
  );
};
