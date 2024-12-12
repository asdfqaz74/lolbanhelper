const UserWinRate = require("../models/UserWinRate");

const rateController = {};

rateController.createSeason = async (req, res) => {
  try {
    const { startDate, tagName } = req.body;

    // 진행 중인 시즌을 종료 (종료일이 없는 모든 사용자 시즌)
    const ongoingSeasons = await UserWinRate.find({ endDate: null });

    for (const season of ongoingSeasons) {
      // 각 사용자 시즌 종료
      await season.endSeason();
    }

    res.json({
      message: `모든 사용자의 시즌이 종료되었습니다.`,
      seonsanName: tagName,
    });
  } catch (error) {
    res.status(500).json({ message: "시즌 종료 중 에러 발생", error });
  }
};

module.exports = rateController;
