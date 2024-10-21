const express = require("express");
const router = express.Router();
const userAPI = require("./user_api");

router.use("/user", userAPI);

module.exports = router;
