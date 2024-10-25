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
      default: "탑",
    },
    sub_position: {
      type: String,
      enum: ["탑", "정글", "미드", "원딜", "서포터"],
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
    champion_stats: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChampionWinRate",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.updateMainCharacter = async function () {
  if (this.champion_stats && this.champion_stats.length > 0) {
    const populatedUser = await this.populate("champion_stats").execPopulate();
    const mostPlayedChampion = populatedUser.champion_stats.reduce(
      (prev, cur) => {
        return cur.games_played > prev.games_played ? cur : prev;
      }
    );

    this.main_character = mostPlayedChampion.champion;
    await this.save();
  }
};

// User 모델 생성
const User = mongoose.model("user", UserSchema);

// 모듈 내보내기
module.exports = User;
