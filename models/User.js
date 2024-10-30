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
      enum: ["탑", "정글", "미드", "원딜", "서포터", "올라운드"],
      default: "탑",
    },
    sub_position: {
      type: String,
      enum: ["탑", "정글", "미드", "원딜", "서포터", "나머지"],
      default: "정글",
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
      default: "",
    },
    game_id: {
      type: String,
    },
  },
  { timestamps: true }
);

// 가장 많이 플레이한 챔피언을 가져오는 메소드
UserSchema.methods.updateMainCharacter = async function () {
  const MatchStats = require("./MatchStats");

  const records = await MatchStats.aggregate([
    { $match: { user: this._id } },
    { $group: { _id: "$champion", gamesPlayed: { $sum: 1 } } },
    { $sort: { gamesPlayed: -1 } },
    { $limit: 1 },
  ]);

  if (records.length > 0) {
    this.main_character = records[0]._id;
    await this.save();
  }
};

// User 모델 생성
const User = mongoose.model("user", UserSchema);

// 모듈 내보내기
module.exports = User;
