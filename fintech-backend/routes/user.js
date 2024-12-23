const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {
  userById,
  read,
  update,
  purchaseHistory,
  transactionHistory,
  addAccountToPaymentAccounts,
  removePaymentAccount,
  listPaymentAccounts,
} = require("../controllers/user");

router.get("/secret", requireSignin, (req, res) => {
  console.log(req.body);
  res.json({
    user: "got here yay",
  });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);
router.post(
  "/user/addPaymentAccount/:userId",
  requireSignin,
  isAuth,
  addAccountToPaymentAccounts
);
router.delete(
  "/user/removePaymentAccount/:userId",
  requireSignin,
  isAuth,
  removePaymentAccount
);

router.get(
  "/user/transactionHistory/:userId",
  requireSignin,
  isAuth,
  transactionHistory
);

router.get(
  "/user/listPaymentAccounts/:userId",
  requireSignin,
  isAuth,
  listPaymentAccounts
);

router.param("userId", userById);

module.exports = router;
