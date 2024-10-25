const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChampionWinRateSchema = new Schema(
  {
    champion: {
      type: String,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    games_played: {
      type: Number,
      default: 0,
    },
    win_rate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ChampionWinRateSchema.methods.calculateWinRate = function () {
  if (this.games_played > 0) {
    this.win_rate = (this.wins / this.games_played) * 100;
  } else {
    this.win_rate = 0;
  }
};

const ChampionWinRate = mongoose.model(
  "ChampionWinRate",
  ChampionWinRateSchema
);

module.exports = ChampionWinRate;
