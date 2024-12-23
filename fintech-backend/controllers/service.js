const Service = require("../models/service");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  const service = new Service(req.body);
  service.save((err, service) => {
    if (err) {
      console.log(err);
      return res.status(400).send({
        error: errorHandler(err),
      });
    }

    return res.send(service);
  });
};

exports.remove = (req, res) => {
  Service.remove(req.body, function (err, removed) {
    if (err) {
      console.log(err);

      return res.status(400).send({
        error: errorHandler(err),
      });
    }
    return res.send("Service deleted successfully ");
  });
};

exports.list = (req, res) => {
  Service.find().exec((err, data) => {
    if (err) {
      return res.status(400).send({
        error: errorHandler(err),
      });
    }
    res.send(data);
  });
};
