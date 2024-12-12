const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserWinRateSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    totalGames: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    tagNames: [{ type: String }],
  },
  { timestamps: true }
);

// 승률 업데이트
UserWinRateSchema.methods.updateWinRate = function () {
  if (this.totalGames > 0) {
    this.winRate = ((this.wins / this.totalGames) * 100).toFixed(0);
  } else {
    this.winRate = 0;
  }
};

// 시즌 종료
UserWinRateSchema.methods.endSeason = async function () {
  // 종료일 설정
  this.endDate = new Date();

  this.updateWinRate();

  await this.save();
};

// 시즌 시작
UserWinRateSchema.statics.startNewSeason = async function (userID) {
  const startDate = new Date();
  const newSeason = new this({
    user: userID,
    startDate,
    totalGames: 0,
    wins: 0,
    winRate: 0,
    tagNames,
  });

  await newSeason.save();
  return newSeason;
};
