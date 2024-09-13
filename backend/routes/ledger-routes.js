const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledger-controller");

router.get("/api/ledger", ledgerController.getLedger);

module.exports = router;
