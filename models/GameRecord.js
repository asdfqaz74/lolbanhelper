const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameRecordSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    champion: {
      type: Schema.Types.ObjectId,
      ref: "ChampionWinRate",
      required: true,
    },
    result: {
      type: String,
      enum: ["win", "loss"],
      required: true,
    },
  },
  { timestamps: true }
);

const GameRecord = mongoose.model("GameRecord", GameRecordSchema);

module.exports = GameRecord;
