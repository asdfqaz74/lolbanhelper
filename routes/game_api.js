const express = require("express");
const router = express.Router();
const gameController = require("../controller/game_controller");

router.put("/", gameController.updateChoice);

router.post("/finalize", gameController.isFinalized);

router.post("/cancel", gameController.cancelChoice);

router.get("/result", gameController.checkedResult);

module.exports = router;
