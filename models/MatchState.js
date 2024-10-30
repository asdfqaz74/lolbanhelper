const mongoose = require("mongoose");
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
      enum: ["win", "loss"],
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

// 해당 유저의 해당 챔피언의 전적을 가져오는 메소드
MatchStatsSchema.statics.getMatchStats = async function (userID, championID) {
  return this.countDocuments({ user: userID, champion: championID });
};

const MatchStats = mongoose.model("MatchStats", MatchStatsSchema);

module.exports = MatchStats;
