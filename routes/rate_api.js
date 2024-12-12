const express = require("express");
const router = express.Router();
const rateController = require("../controller/rate_controller");

router.post("/", rateController.createSeason);

module.exports = router;
