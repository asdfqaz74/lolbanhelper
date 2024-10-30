const express = require("express");
const router = express.Router();

const recordController = require("../controller/record_controller");

router.post("/", recordController.createRecords);

module.exports = router;
