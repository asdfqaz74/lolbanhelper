const MatchStats = require("../models/MatchState");

const record_controller = {};

record_controller.createRecords = async (req, res) => {
  try {
    const { victoryordefeat, kills, deaths, assists, champion, user } =
      req.body;
    const newRecord = new MatchStats({
      user,
      champion,
      victoryordefeat,
      kills,
      deaths,
      assists,
    });
    await newRecord.save();
    res.status(200).json({ status: "생성 성공", data: newRecord });
  } catch (e) {
    res.status(400).json({ status: "생성 실패" });
    console.error(e);
  }
};

module.exports = record_controller;
