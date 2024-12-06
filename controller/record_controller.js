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
    res.status(500).json({ status: "생성 실패" });
    console.error(e);
  }
};

// 여러명의 전적 생성
record_controller.createManyRecords = async (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records)) {
      return res
        .status(500)
        .json({ status: "fail", message: "records는 배열이어야 합니다." });
    }

    const createdRecords = [];

    for (const record of records) {
      const {
        victoryordefeat,
        kills,
        deaths,
        assists,
        champion,
        user,
        position,
      } = record;
      const newRecord = new MatchStats({
        user,
        champion,
        victoryordefeat,
        kills,
        deaths,
        assists,
        position,
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
    res.status(500).json({ status: "생성 실패" });
    console.error(e);
  }
};

// 챔피언 조회
record_controller.getChampion = async (req, res) => {
  try {
    const response = await Champion.find({});
    res.status(200).json({ status: "조회 성공", data: response });
  } catch (e) {
    res.status(500).json({ status: "조회 실패" });
    console.error(e);
  }
};

// 모든 전적 조회
record_controller.getTotalMatchStats = async (req, res) => {
  try {
    const response = await MatchStats.find({}).sort({ createdAt: -1 });
    res.status(200).json({ status: "조회 성공", data: response });
  } catch (e) {
    res.status(500).json({ status: "조회 실패" });
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
    res.status(500).json({ status: "조회 실패" });
    console.error(e);
  }
};

// 유저 별 최근 5전적 조회
record_controller.getRecentMatchStats = async (req, res) => {
  try {
    const userList = await User.find({});
    const response = [];

    for (const user of userList) {
      const recentMatches = await MatchStats.getRecentMatchStats(user._id);
      const winCount = await MatchStats.getWinCount(user._id);
      const loseCount = await MatchStats.getLoseCount(user._id);
      const totalCount = winCount + loseCount;
      const userWinRate = await MatchStats.getWinRate(user._id);
      const mainPosition = user.main_position;
      const subPosition = user.sub_position;
      const nickname = user.game_id ? user.game_id : user.name;
      const userName = user.name;
      const userId = user._id;
      const isMvp = user.isMVP;
      const isSad = user.isSad;

      if (totalCount === 0) {
        response.push({
          userName,
          userId,
          mainPosition,
          subPosition,
          nickname,
          winCount,
          loseCount,
          totalCount,
          recentMatches: "전적이 없습니다.",
          userWinRate: 0,
          isMvp,
          isSad,
        });
        continue;
      }

      response.push({
        userName,
        userId,
        mainPosition,
        subPosition,
        nickname,
        winCount,
        loseCount,
        totalCount,
        recentMatches,
        userWinRate,
        isMvp,
        isSad,
      });
    }

    const sortedResponse = response.sort((a, b) => {
      return a.userName.localeCompare(b.userName);
    });

    res.status(200).json({ status: "조회 성공", data: sortedResponse });
  } catch (e) {
    res.status(500).json({ status: "조회 실패" });
    console.error(e);
  }
};

module.exports = record_controller;
