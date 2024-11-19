const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  statsJson: {
    type: Object,
    required: true,
  },
});

const Match = mongoose.model("Match", MatchSchema);

module.exports = Match;
