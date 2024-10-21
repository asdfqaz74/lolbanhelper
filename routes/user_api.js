const express = require("express");
const router = express.Router();
const userController = require("../controller/user_controller");

// 1. 선수 추가 API
router.post("/", userController.createUser);

// 2. 선수 조회 API
router.get("/", userController.getUser);

// 3. 선수 삭제 API
router.delete("/:id", userController.deleteUser);

// 4. 선수 수정 API
router.put("/:id", userController.updateUser);

module.exports = router;
