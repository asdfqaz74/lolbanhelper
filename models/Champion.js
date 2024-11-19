// models/Champion.js
const mongoose = require("mongoose");

const ChampionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  en_name: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  small: { type: String, required: true },
});

const Champion = mongoose.model("Champion", ChampionSchema);

module.exports = Champion;
