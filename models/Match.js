const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    statsJson: {
      type: Object,
      required: true,
    },
    processed: {
      type: Boolean,
      required: true,
      default: false,
    },
    maxDamage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Match = mongoose.model("Match", MatchSchema);

module.exports = Match;
