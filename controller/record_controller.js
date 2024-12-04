const MatchStats = require("../models/MatchStats");
const Champion = require("../models/Champion");
const User = require("../models/User");

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

    const userInstance = await User.findById(user);
    if (userInstance) {
      await userInstance.updateMainCharacter();
    }

    await MatchStats.getMVP(user);
    await MatchStats.getSad(user);

    res.status(200).json({ status: "생성 성공", data: newRecord });
  } catch (e) {
    res.status(400).json({ status: "생성 실패" });
    console.error(e);
  }
};

// 여러명의 전적 생성
record_controller.createManyRecords = async (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records)) {
      return res
        .status(400)
        .json({ status: "fail", message: "records는 배열이어야 합니다." });
    }

    const createdRecords = [];

    for (const record of records) {
      const { victoryordefeat, kills, deaths, assists, champion, user } =
        record;
      const newRecord = new MatchStats({
        user,
        champion,
        victoryordefeat,
        kills,
        deaths,
        assists,
      });
      await newRecord.save();
      createdRecords.push(newRecord);

      const userInstance = await User.findById(user);
      if (userInstance) {
        await userInstance.updateMainCharacter();
      }

      await MatchStats.getMVP(user);
      await MatchStats.getSad(user);
    }

    res.status(200).json({ status: "생성 성공", data: createdRecords });
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

record_controller.getRanking = async (req, res) => {
  try {
    const mostChampion = await MatchStats.getMostChampion();
    const mostWinRate = await MatchStats.getMostWinRate();
    const leastChampion = await MatchStats.getLeastWinRate();
    const mostUserWinRate = await MatchStats.getMostUserWinRate();

    res.status(200).json({
      status: "조회 성공",
      data: { mostChampion, mostWinRate, leastChampion, mostUserWinRate },
    });
  } catch (e) {
    res.status(400).json({ status: "조회 실패" });
    console.error(e);
  }
};

// 유저 별 최근 5전적 조회
record_controller.getRecentMatchStats = async (req, res) => {
  try {
    const userList = await User.find({});
    const response = [];

    for (const user of userList) {
      const getRecentMatchStats = await MatchStats.getRecentMatchStats(
        user._id
      );
      response.push({ user, getRecentMatchStats });
    }

    res.status(200).json({ status: "조회 성공", data: response });
  } catch (e) {
    res.status(500).json({ status: "조회 실패" });
  }
};

module.exports = record_controller;
