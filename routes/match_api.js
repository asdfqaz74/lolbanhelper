const express = require("express");
const multer = require("multer");
const {
  uploadAndProcessMatch,
  getUnprocessedMatch,
  putProcessedMatch,
} = require("../controller/match_controller");
const router = express.Router();

const upload = multer({
  dest: "uploads/", // 업로드된 파일을 저장할 디렉토리
  fileFilter: (req, file, cb) => {
    // 파일 확장자가 .rofl인지 확인
    if (!file.originalname.endsWith(".rofl")) {
      return cb(new Error("ROFL 파일만 업로드할 수 있습니다."), false);
    }
    cb(null, true); // 조건에 맞는 파일만 처리
  },
});

router.post("/upload", upload.single("roflFile"), uploadAndProcessMatch);

router.get("/", getUnprocessedMatch);

router.put("/", putProcessedMatch);

module.exports = router;
