const mongoose = require("mongoose");
const User = require("./User");
const { HAPPY_WIN_RATE, SAD_WIN_RATE } = require("../constants");
const Schema = mongoose.Schema;

const MatchStatsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    champion: {
      type: Schema.Types.ObjectId,
      ref: "Champion",
    },
    victoryordefeat: {
      type: String,
      enum: ["win", "lose"],
      required: true,
    },
    kills: {
      type: Number,
      required: true,
    },
    deaths: {
      type: Number,
      required: true,
    },
    assists: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// 해당 유저의 전적을 가져와서 승률 60% 이상이면 User의 isMVP를 true로 이하면 false로 설정하는 메소드
MatchStatsSchema.statics.getMVP = async function (userID) {
  const winCount = await this.countDocuments({
    user: userID,
    victoryordefeat: "win",
  });
  const totalCount = await this.countDocuments({ user: userID });
  const winRate = winCount / totalCount;

  if (winRate >= HAPPY_WIN_RATE && totalCount >= 20) {
    const user = await User.findById(userID);
    user.isMVP = true;
    await user.save();
  } else {
    const user = await User.findById(userID);
    user.isMVP = false;
    await user.save();
  }
};

// 해당 유저의 전적을 가져와서 승률 40% 이하이면 User의 isSad를 true로 이상이면 false로 설정하는 메소드
MatchStatsSchema.statics.getSad = async function (userID) {
  const winCount = await this.countDocuments({
    user: userID,
    victoryordefeat: "win",
  });
  const totalCount = await this.countDocuments({ user: userID });
  const winRate = winCount / totalCount;

  if (winRate <= SAD_WIN_RATE && totalCount >= 20) {
    const user = await User.findById(userID);
    user.isSad = true;
    await user.save();
  } else {
    const user = await User.findById(userID);
    user.isSad = false;
    await user.save();
  }
};

// 해당 유저의 해당 챔피언의 전적을 가져오는 메소드
MatchStatsSchema.statics.getMatchStats = async function (userID, championID) {
  return this.countDocuments({ user: userID, champion: championID });
};

// 해당 유저의 최근 5게임 전적을 가져오는 메소드
MatchStatsSchema.methods.getRecentMatchStats = async function (userID) {
  return this.find({ user: userID }).limit(5).sort({ createdAt: -1 });
};

const MatchStats = mongoose.model("MatchStats", MatchStatsSchema);

module.exports = MatchStats;
