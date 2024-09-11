const express = require("express");
const mongoose = require("mongoose");
const companyRoutes = require("./routes/companyRoutes");
const menuRoutes = require("./routes/menuRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

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

const oneTimeOrdersRoutes = require("./routes/one-time-orders-routes");

app.use("/api/items", oneTimeOrdersRoutes);

//routes here.
app.use("/api/companies", companyRoutes);
app.use("/api/menu", menuRoutes);
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
