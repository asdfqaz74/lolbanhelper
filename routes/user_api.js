const express = require("express");
const router = express.Router();
const userController = require("../controller/user_controller");

// 선수의 팀 초기화 API
router.put("/reset-today", userController.resetUserTeam);

// 대기명단 초기화 API
router.put("/reset-wait", userController.resetWaitingList);

// 선수 추가 API
router.post("/", userController.createUser);

// 선수 전체 조회 API
router.get("/", userController.getUser);

// 선수 조회 API
router.get("/:id", userController.getUser);

// 선수 삭제 API
router.delete("/:id", userController.deleteUser);

// 선수 수정 API
router.put("/:id", userController.updateUser);

// 선수 디테일 API
router.get("/detail/:id", userController.getUserDetail);

module.exports = router;
