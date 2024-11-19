const express = require("express");
const router = express.Router();

const matchController = require("../controller/match_controller");

router.get("/riot", matchController.getPUUID);

module.exports = router;
