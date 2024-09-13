const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/user-routes");
const oneTimeOrdersRoutes = require("./routes/one-time-orders-routes");
const companyRoutes = require("./routes/company-routes");
const menuRoutes = require("./routes/menu-routes");
const paymentRoutes = require("./routes/payment-routes");
const ledgerRoutes = require("./routes/ledger-routes");
const analyticsRoutes = require("./routes/analytics-routes");

const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// parse application/json
var bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.xml());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS, DELETE, PUT, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-requested-with, Content-Type, origin, authorization, accept, client-security-token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/users", userRoutes);
app.use("/api/items", oneTimeOrdersRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(express.urlencoded({ extended: true }));
app.use("/api/payment", paymentRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("express is running!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
