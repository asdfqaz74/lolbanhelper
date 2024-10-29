const express = require("express");
const router = express.Router();
const userAPI = require("./user_api");
const gameAPI = require("./game_api");
const resultAPI = require("./result_api");

router.use("/user", userAPI);
router.use("/game", gameAPI);
router.use("/result", resultAPI);

module.exports = router;
