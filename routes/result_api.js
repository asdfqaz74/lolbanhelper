const express = require("express");
const router = express.Router();

const recordController = require("../controller/record_controller");

router.get("/:id", recordController.getRecords);

module.exports = router;
