const express = require("express");
const router = express.Router();

const { userById } = require("../controllers/user");

const { create, remove, list } = require("../controllers/service");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.post("/service/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/service/remove/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.get("/services", list);

router.param("userId", userById);

module.exports = router;
