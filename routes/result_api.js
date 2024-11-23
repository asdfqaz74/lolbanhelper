const express = require("express");
const router = express.Router();

const recordController = require("../controller/record_controller");

router.post("/", recordController.createRecords);

router.post("/many", recordController.createManyRecords);

router.get("/", recordController.getTotalMatchStats);

router.get("/champion", recordController.getChampion);

router.get("/ranking", recordController.getRanking);
module.exports = router;
