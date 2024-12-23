const Charge = require("../models/charge");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  console.log("create charge", req.body);
  const charge = new Charge(req.body);

  charge.save((err, charge) => {
    if (err) {
      console.log(err);
      return res.status(400).send({
        error: errorHandler(err),
      });
    }

    return res.send(charge);
  });
};

exports.remove = (req, res) => {
  Charge.remove(req.body, function (err, removed) {
    if (err) {
      console.log(err);

      return res.status(400).send({
        error: errorHandler(err),
      });
    }
    return res.send("Charge deleted successfully");
  });
};

exports.list = (req, res) => {
  Charge.find().exec((err, data) => {
    if (err) {
      return res.status(400).send({
        error: errorHandler(err),
      });
    }
    res.send(data);
  });
};
