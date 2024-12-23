"use strict";

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();
// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
// const braintreeRoutes = require("./routes/braintree");
const mpesaRoutes = require("./routes/mpesa");
const coopBankRoutes = require("./routes/coopBank");
const chargeRoutes = require("./routes/charge");
const serviceRoutes = require("./routes/service");

// app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.error(err.message);
  });

// // middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// // routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
// app.use("/api", braintreeRoutes);
app.use("/api", mpesaRoutes);
app.use("/api", coopBankRoutes);
app.use("/api", chargeRoutes);
app.use("/api", serviceRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.listen(process.env.PORT, "0.0.0.0");

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});
