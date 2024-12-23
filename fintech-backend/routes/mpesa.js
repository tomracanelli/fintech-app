const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const {
  generateMpesaToken,
  processPayment,
  mpesaWebHook,
} = require("../controllers/mpesa");

router.post(
  "/mpesa/payment/stk/:userId",
  requireSignin,
  isAuth,
  generateMpesaToken,
  processPayment
);
router.post("/mpesa/mpesaWebHook/:userId", mpesaWebHook);
router.param("userId", userById);

module.exports = router;
