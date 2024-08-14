const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

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

//write routes here.

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(process.env.PORT || 3030, () => {
      console.log("app started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
