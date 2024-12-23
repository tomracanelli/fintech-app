const express = require("express");
const router = express.Router();

const { userById } = require("../controllers/user");

const { create, remove, list } = require("../controllers/charge");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.post("/charge/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete("/charge/remove/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/charges", list);

router.param("userId", userById);

module.exports = router;
