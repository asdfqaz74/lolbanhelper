const MatchStats = require("../models/MatchStats");
const User = require("../models/User");
const Match = require("../models/Match");
const Champion = require("../models/Champion");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    // 요청 바디에서 이름 추출
    const { name, main_position, sub_position, main_character } = req.body;

    // 이름이 이미 존재하는지 확인
    const user = await User.findOne({ name });
    if (user) {
      throw new Error("이미 존재하는 이름입니다.");
    }

    // 이름이 존재하지 않으면 새로운 유저 생성
    const newUser = new User({
      name,
      main_position,
      sub_position,
      main_character,
      game_id: name,
    });
    await newUser.save();
    res.status(200).json({ status: "생성 성공", data: newUser });
  } catch (e) {
    res.status(400).json({ status: "생성 실패" });
    console.error(e);
  }
};

// 2. 선수 조회 API
userController.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userList = id
      ? await User.find({ _id: id }).select("-__v")
      : await User.find({}).select("-__v");
    res.status(200).json({ status: "조회 성공", data: userList });
  } catch (e) {
    res.status(400).json({ status: "조회 실패" });
    console.error(e);
  }
};

// 3. 선수 삭제 API
userController.deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "삭제 성공", data: deleteUser });
  } catch (e) {
    res.status(400).json({ status: "삭제 실패" });
    console.error(e);
  }
};

// 4. 선수 수정 API
userController.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id);
    if (!user) {
      throw new Error("해당하는 이름이 없습니다.");
    }
    const fields = Object.keys(req.body);
    fields.map((field) => (user[field] = req.body[field]));
    await user.save();
    res.status(200).json({ status: "수정 성공", data: user });
  } catch (e) {
    res.status(400).json({ status: "수정 실패" });
    console.error(e);
  }
};

// 5. 선수의 팀을 초기화하는 API
userController.resetUserTeam = async (req, res) => {
  try {
    await User.updateMany({}, { today_team: "" });
    res.status(200).json({ status: "팀 초기화 성공" });
  } catch (e) {
    res.status(400).json({ status: "팀 초기화 실패" });
    console.error(e);
  }
};

// 6. 전체 초기화하는 API
userController.resetWaitingList = async (req, res) => {
  try {
    await User.updateMany({}, { today_player: false });
    await User.updateMany({}, { today_team: "" });
    res.status(200).json({ status: "전체 초기화 성공" });
  } catch (e) {
    res.status(400).json({ status: "전체 초기화 실패" });
    console.error(e);
  }
};

// 7. 유저 디테일 가져오는 API
userController.getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    // 해당 유저의 매치 10판 가져오기
    const matchStats = await MatchStats.getRecentTenMatchStats(id);
    const winRate = await MatchStats.getRecentTenMatchWinRate(id);

    const recentPosition = [];
    const winOrLose = [];

    for (const match of matchStats) {
      const { position, victoryordefeat } = match;
      recentPosition.push(position);
      winOrLose.push(victoryordefeat);
    }
    const user = await User.findById(id).select(
      "name game_id main_character -_id"
    );
    const name = user.name;
    const nickname = user.game_id;
    const main_character = user.main_character;
    const main_character_image = await Champion.findById(main_character).select(
      "image -_id"
    );

    const image = main_character_image.image;

    const match = await Match.find({ "statsJson.summonerName": nickname })
      .sort({ createdAt: -1 })
      .limit(5);

    const matchMe = [];

    for (const matches of match) {
      const { statsJson } = matches;
      const findMe = statsJson.filter((user) => user.summonerName === nickname);
      matchMe.push(findMe);
    }

    const data = {
      recentPosition,
      winOrLose,
      name,
      nickname,
      match,
      image,
      winRate,
      matchMe,
    };

    res.status(200).json({ status: "조회 성공", data: data });

    // 해당 유저의 자주 사용하는 챔피언 가져오기
  } catch (e) {
    res.status(500).json({ status: "조회 실패" });
    console.error(e);
  }
};

module.exports = userController;
