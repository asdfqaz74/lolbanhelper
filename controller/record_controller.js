const GameRecord = require("../models/GameRecord");

const recordController = {};

// 선수의 기록 조희 API
recordController.getRecords = async (req, res) => {
  try {
    const userID = req.params.userID;

    const records = await GameRecord.find({ user: userID }).populate(
      "champion",
      "champion win_rate games_played"
    );

    if (!records) {
      return res.status(404).json({ message: "Records not found" });
    }

    return res.status(200).json(records);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

module.exports = recordController;
