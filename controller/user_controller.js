const User = require("../models/User");

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
    const userList = await User.find({}).select("-__v");
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

// 6. 대기명단을 초기화하는 API
userController.resetWaitingList = async (req, res) => {
  try {
    await User.updateMany({}, { today_player: false });
    res.status(200).json({ status: "대기명단 초기화 성공" });
  } catch (e) {
    res.status(400).json({ status: "대기명단 초기화 실패" });
    console.error(e);
  }
};

module.exports = userController;
