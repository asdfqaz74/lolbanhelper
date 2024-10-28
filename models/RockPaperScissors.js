const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RockPaperScissorsSchema = new Schema({
  team: {
    type: String,
    required: true,
  },
  team_choice: {
    type: String,
    required: true,
  },
  isFinalized: {
    type: Boolean,
    default: false,
  },
});

const RockPaperScissors = mongoose.model(
  "RockPaperScissors",
  RockPaperScissorsSchema
);

module.exports = RockPaperScissors;
