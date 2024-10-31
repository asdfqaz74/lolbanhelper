const MatchStats = require("../models/MatchState");
const Champion = require("../models/Champion");

const record_controller = {};

// 전적 생성
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

// 챔피언 조회
record_controller.getChampion = async (req, res) => {
  try {
    const response = await Champion.find({});
    res.status(200).json({ status: "조회 성공", data: response });
  } catch (e) {
    res.status(400).json({ status: "조회 실패" });
    console.error(e);
  }
};

// 모든 전적 조회
record_controller.getTotalMatchStats = async (req, res) => {
  try {
    const response = await MatchStats.find({}).sort({ createdAt: -1 });
    res.status(200).json({ status: "조회 성공", data: response });
  } catch (e) {
    res.status(400).json({ status: "조회 실패" });
    console.error(e);
  }
};

module.exports = record_controller;
