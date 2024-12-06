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
    position: {
      type: String,
      enum: ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"],
      required: true,
    },
  },
  { timestamps: true }
);

// 해당 유저의 승률을 가져오는 메소드
MatchStatsSchema.statics.getWinRate = async function (userID) {
  const winCount = await this.countDocuments({
    user: userID,
    victoryordefeat: "win",
  });
  const totalCount = await this.countDocuments({ user: userID });
  const winRate = ((winCount / totalCount) * 100).toFixed(2);

  return winRate;
};

// 해당 유저의 승 판수를 가져오는 메소드
MatchStatsSchema.statics.getWinCount = async function (userID) {
  const winCount = await this.countDocuments({
    user: userID,
    victoryordefeat: "win",
  });

  return winCount;
};

// 해당 유저의 패 판수를 가져오는 메소드
MatchStatsSchema.statics.getLoseCount = async function (userID) {
  const loseCount = await this.countDocuments({
    user: userID,
    victoryordefeat: "lose",
  });

  return loseCount;
};

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

// 해당 유저의 최근 5게임 전적을 가져와서 win, lose 를 구분하여 반환하는 메소드
MatchStatsSchema.statics.getRecentMatchStats = async function (userID) {
  const response = await this.find({ user: userID })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentMatch = [];
  for (const match of response) {
    const { victoryordefeat } = match;
    recentMatch.push(victoryordefeat);
  }

  return recentMatch;
};

// 해당 유저의 최근 10게임 전적 가져오기
MatchStatsSchema.statics.getRecentTenMatchStats = async function (userID) {
  const response = await this.find({ user: userID })
    .sort({ createdAt: -1 })
    .limit(10);

  return response;
};

// 챔피언 모스트 10 : 모든 매치 중에서 해당 챔피언이 가장 많이 픽된 챔피언 10개를 가져오는 메소드
MatchStatsSchema.statics.getMostChampion = async function () {
  const response = await this.aggregate([
    {
      $group: {
        _id: "$champion",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  return response;
};

// 승률 모스트 5 : 모든 매치 중에서 승률이 가장 높은 챔피언 5개를 가져오는 메소드
MatchStatsSchema.statics.getMostWinRate = async function () {
  const response = await this.aggregate([
    {
      $group: {
        _id: "$champion",
        win: {
          $sum: {
            $cond: [{ $eq: ["$victoryordefeat", "win"] }, 1, 0],
          },
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        winRate: {
          $divide: ["$win", "$total"],
        },
        total: 1,
      },
    },
    {
      $match: { total: { $gte: 5 } },
    },
    {
      $sort: { winRate: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  return response;
};

// 승률 워스트 5 : 모든 매치 중에서 승률이 가장 낮은 챔피언 5개를 가져오는 메소드
MatchStatsSchema.statics.getLeastWinRate = async function () {
  const response = await this.aggregate([
    {
      $group: {
        _id: "$champion",
        win: {
          $sum: {
            $cond: [{ $eq: ["$victoryordefeat", "win"] }, 1, 0],
          },
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        winRate: {
          $divide: ["$win", "$total"],
        },
        total: 1,
      },
    },
    {
      $match: { total: { $gte: 5 } },
    },
    {
      $sort: { winRate: 1 },
    },
    {
      $limit: 5,
    },
  ]);

  return response;
};

// 승률 모스트 5 : 모든 매치 중에서 승률이 가장 높은 유저 5명을 가져오는 메소드
MatchStatsSchema.statics.getMostUserWinRate = async function () {
  const response = await this.aggregate([
    {
      $group: {
        _id: "$user",
        win: {
          $sum: {
            $cond: [{ $eq: ["$victoryordefeat", "win"] }, 1, 0],
          },
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        winRate: {
          $divide: ["$win", "$total"],
        },
        total: 1,
      },
    },
    {
      $match: { total: { $gte: 10 } },
    },
    {
      $sort: { winRate: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  return response;
};

const MatchStats = mongoose.model("MatchStats", MatchStatsSchema);

module.exports = MatchStats;
