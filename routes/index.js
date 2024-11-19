const express = require("express");
const router = express.Router();
const userAPI = require("./user_api");
const resultAPI = require("./result_api");
const matchAPI = require("./match_api");

router.use("/user", userAPI);
router.use("/result", resultAPI);
router.use("/match", matchAPI);

module.exports = router;
