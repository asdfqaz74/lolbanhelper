const express = require("express");
const router = express.Router();
const userAPI = require("./user_api");
const resultAPI = require("./result_api");
const matchAPI = require("./match_api");
const rateAPI = require("./rate_api");

router.use("/user", userAPI);
router.use("/result", resultAPI);
router.use("/match", matchAPI);
router.use("/rate", rateAPI);

module.exports = router;
