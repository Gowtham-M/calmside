const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.generateAnalytics = (req, res) => {
  const companyId = req.params.company; // Get companyId from URL parameter

  // Define paths
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

  // Define the command to run the Python script
  const pythonScriptPath = path.join(__dirname, `../../analytics/analyze.py`);
  const command = `python3 ${pythonScriptPath} ${inputFilePath} ${outputFilePath}`;

  // Execute the Python script
  exec(command, (error) => {
    if (error) {
      return res.status(500).json({ message: "Error generating analytics" });
    }

    // Return the path to the generated image
    res.json({ imageUrl: `/analytics/${companyId}_sales_analysis.png` });
  });
};
