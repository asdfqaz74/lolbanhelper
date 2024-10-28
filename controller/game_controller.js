const Game = require("../models/RockPaperScissors");

const gameController = {};

// 가위바위보 선택 API
gameController.updateChoice = async (req, res) => {
  try {
    const { team, team_choice } = req.body;

    let game = await Game.findOne({ team });

    if (game && game.isFinalized) {
      return res
        .status(400)
        .json({ status: "선택이 확정되어 더 이상 수정할 수 없습니다." });
    }

    if (game) {
      game.team_choice = team_choice;
    } else {
      game = new Game({ team, team_choice });
    }

    await game.save();
    res.status(200).json({ status: "선택 성공", data: game });
  } catch (e) {
    res.status(400).json({ status: "선택 실패" });
    console.error(e);
  }
};

// 가위바위보 선택 확정 API
gameController.isFinalized = async (req, res) => {
  try {
    await Game.updateMany({}, { isFinalized: true });
    res.status(200).json({ status: "가위바위보 선택 완료" });
  } catch (e) {
    res.status(400).json({ status: "가위바위보 선택 실패" });
    console.error(e);
  }
};

// 가위바위보 선택 취소 API
gameController.cancelChoice = async (req, res) => {
  try {
    await Game.updateMany({}, { isFinalized: false });
    res.status(200).json({ status: "가위바위보 선택 취소" });
  } catch (e) {
    res.status(400).json({ status: "가위바위보 선택 취소 실패" });
    console.error(e);
  }
};

// 가위바위보 결과 확인 API
gameController.checkedResult = async (req, res) => {
  try {
    const teamA = await Game.findOne({ team: "A" });
    const teamB = await Game.findOne({ team: "B" });

    if (!teamA || !teamB) {
      return res.status(400).json({ status: "가위바위보 결과 확인 실패" });
    }

    const choiceA = teamA.team_choice;
    const choiceB = teamB.team_choice;

    let result;

    if (choiceA === choiceB) {
      result = "무승부";
    } else if (
      (choiceA === "Rock" && choiceB === "Scissors") ||
      (choiceA === "Scissors" && choiceB === "Paper") ||
      (choiceA === "Paper" && choiceB === "Rock")
    ) {
      result = "A팀 승리";
    } else {
      result = "B팀 승리";
    }

    res.status(200).json({
      status: "가위바위보 결과 확인 성공",
      choiceA,
      choiceB,
      data: result,
    });
  } catch (e) {
    res.status(400).json({ status: "가위바위보 결과 확인 실패" });
    console.error(e);
  }
};

module.exports = gameController;
