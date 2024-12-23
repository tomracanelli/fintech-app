const User = require("../models/user");
const { Order } = require("../models/order");
const Transaction = require("../models/transaction");

const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.listPaymentAccounts = (req, res) => {
  console.log("payment Accounts", req.profile.payment_accounts);
  return res.send(req.profile.payment_accounts);
};
// exports.update = (req, res) => {
//     console.log('user update', req.body);
//     req.body.role = 0; // role will always be 0
//     User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'You are not authorized to perform this action'
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json(user);
//     });
// };

exports.update = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { name, password } = req.body;

  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password should be min 6 characters long",
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return res.status(400).json({
          error: "User update failed",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};

exports.addAccountToPaymentAccounts = (req, res) => {
  let payment_account = [];
  payment_account.push(req.body);
  //check if account already exists
  if (
    req.profile.payment_accounts.some(
      (account) => account.account_number === req.body.account_number
    )
  ) {
    return res.status(400).send("Account already exists");
  } else {
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { payment_accounts: req.body } },
      { new: true },
      (error, data) => {
        if (error) {
          return res.status(400).send("Could not update user payment account");
        } else {
          return res.send(data);
        }
      }
    );
  }
};

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update user purchase history",
        });
      }
      next();
    }
  );
};

//remove payment account
exports.removePaymentAccount = (req, res) => {
  console.log(req.body);
  console.log(req.profile);

  User.updateOne(
    { _id: req.profile._id },
    {
      $pull: {
        payment_accounts: {
          account_number: req.body.account_number,
          name: req.body.name,
        },
      },
      // $pull: { payment_accounts: { ...req.body } },
    },
    (error, data) => {
      if (error) {
        console.log(error);
        return res.status(400).send({ error: errorHandler(err) });
      }
      console.log(data);
      return res.send({ message: "Account deleted successfully" });
    }
  );
  // let product = req.product;
  // product.remove((err, deletedProduct) => {
  //     if (err) {
  //         return res.status(400).json({
  //             error: errorHandler(err)
  //         });
  //     }
  //     res.json({
  //         message: 'Product deleted successfully'
  //     });
  // });
};
exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};

exports.transactionHistory = (req, res, id) => {
  console.log("READ tRANSACTIONS");
  // res.json({
  //     user: 'executed'
  // });
  // let user = req.profile.id;
  Transaction.find({ user: req.profile._id })
    // .populate('category')
    // .sort("-createdAt")
    .exec((err, transactions) => {
      if (err) {
        console.log("error reading transactions");
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(transactions);
      // req.product = product;
      // next();
    });
};
