const Transaction = require("../models/transaction");
const prettyjson = require("prettyjson");
const request = require("request");
const moment = require("moment");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { encodeQuery } = require("../helpers/encodeQuery");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const options = {
  noColor: true,
};

//  webhook endpoint to receive webhooks from Safaricom
exports.mpesaWebHook = (req, res) => {
  console.log("-----------Received M-Pesa webhook-----------");
  // format and dump the request payload recieved from safaricom in the terminal
  console.log(prettyjson.render(req.body, options));
  console.log("-----------------------");
  if (req.body.Body.stkCallback.ResultCode === 0) {
    let hookData = req.body.Body.stkCallback.CallbackMetadata.Item;
    let { pay_for } = req.query;
    let userId = req.profile.id;
    // save transaction to database
    let fields = {
      user: userId,
      paid_for: pay_for,
      amount: hookData[0].Value,
      mode: "M-pesa",
      transaction_number: hookData[1].Value,
      transaction_date: hookData[3].Value,
      account_number: hookData[4].Value,
    };
    let transaction = new Transaction(fields);
    transaction.save((err, result) => {
      if (err) {
        console.log("TRANSACTION CREATE ERROR ", err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      console.log("transaction saved successfully");
      // send email alert to user
      const emailData = {
        to: `${req.profile.email}`,
        from: "coopbanktest77@gmail.com",
        subject: `Payment successful`,
        html: `
          <p>Customer name:  ${req.profile.username}</p>
 
          <p>Payment of amount ksh ${destination.amount} made successfuly via M-pesa  of  for ${destination.narration}.</p>
         
          <p>Payment Made to :  Organization Name</p>

          <p>Mobile Number:  ${hookData[4].Value}</p>

      `,
      };
      sgMail.send(emailData);
      sgMail
        .send(emailData)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error.response.body);
        });
      res.json(result);
    });
  } else {
    let hookResponse = req.body.Body.stkCallback.ResultDesc;
    console.log("error from M-pesa Webhook", hookResponse);
    res.json(hookResponse);
  }
};

exports.generateMpesaToken = (req, res, next) => {
  //Access token
  let consumer_key = process.env.MPESA_CONSUMER_KEY; //your app consumer key
  let consumer_secret = process.env.MPESA_CONSUMER_SECRET; //your app consumer secret
  let url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"; //Authentication url
  let auth = new Buffer.from(`${consumer_key}:${consumer_secret}`).toString(
    "base64"
  );
  request(
    {
      url: url,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
        res.json(error);
      } else {
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
};

exports.processPayment = (req, res) => {
  // Json object that should be
  // converted to query parameter
  let { phone, amount, pay_for } = req.body;
  let userId = req.profile.id;
  let username = req.profile.username;

  let data = {
    url: `https://chep-james.herokuapp.com/api/mpesa/mpesaWebHook/${userId}?`,
    params: {
      pay_for: pay_for,
      username: username,
    },
  };
  let callbackURL = encodeQuery(data);
  let endpoint =
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  let auth = `Bearer ${req.access_token}`;
  let shortcode = process.env.MPESA_SHORT_CODE;
  let passkey = process.env.MPESA_PASSKEY;
  let timestamp = moment().format("YYYYMMDDHHmmss");
  const password = new Buffer.from(
    `${shortcode}${passkey}${timestamp}`
  ).toString("base64");

  request(
    {
      url: endpoint,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: `${timestamp}`,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackURL,
        AccountReference: username,
        TransactionDesc: "Process activation",
      },
    },

    function (error, response, body) {
      if (error) {
        console.log("error from processPayment", error);
        return res.send(error);
      }
      return res.send(body);
    }
  );
};
