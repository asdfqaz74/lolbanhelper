// 유저 정보를 저장하는 스키마 정의
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    main_position: {
      type: String,
      enum: ["탑", "정글", "미드", "원딜", "서포터"],
    },
    sub_position: {
      type: String,
    },
    main_character: {
      type: String,
    },
    today_player: {
      type: Boolean,
      default: false,
    },
    today_team: {
      type: String,
    },
    game_id: {
      type: String,
    },
  },
  { timestamps: true }
);

// User 모델 생성
const User = mongoose.model("user", UserSchema);

// 모듈 내보내기
module.exports = User;
