const express = require("express");
const router = express.Router();
const userController = require("../controller/user_controller");

// 오늘의 선수 초기화 설정 API
router.put("/reset-today", userController.resetUserTeam);

// 대기명단 초기화 API
router.put("/reset-wait", userController.resetWaitingList);

// 선수 추가 API
router.post("/", userController.createUser);

// 선수 조회 API
router.get("/", userController.getUser);
router.get("/:id", userController.getUser);

// 선수 삭제 API
router.delete("/:id", userController.deleteUser);

// 선수 수정 API
router.put("/:id", userController.updateUser);

module.exports = router;
