const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledger-controller");

router.get("/", ledgerController.getLedger); // Fetch Ledger
router.get("/download", ledgerController.downloadLedger); // Download Ledger

module.exports = router;
