const fs = require("fs");
const Match = require("../models/Match");

const matchController = {};

const processRoflFileWithoutReader = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const metadataSizeBuffer = buffer.subarray(buffer.length - 4);
    const metadataSize = metadataSizeBuffer.readUInt32LE(0);

    const metadataPosition = buffer.length - metadataSize - 4;
    const rawMetadata = buffer.subarray(metadataPosition, buffer.length - 4);

    const parsedMetadata = JSON.parse(rawMetadata.toString());

    // statsJson을 JSON 객체로 변환
    const statsJson = JSON.parse(parsedMetadata.statsJson);

    const filteredStats = statsJson.map((player) => ({
      summonerName: "",
      champion: player.SKIN,
      team:
        player.TEAM === "100"
          ? "BLUE"
          : player.TEAM === "200"
          ? "RED"
          : "UNKNOWN",
      position: player.TEAM_POSITION,
      kills: player.CHAMPIONS_KILLED,
      deaths: player.NUM_DEATHS,
      assists: player.ASSISTS,
      cs: player.MINIONS_KILLED,
      totalDamage_dealt: player.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS,
      totalDamage_taken: player.TOTAL_DAMAGE_TAKEN,
      magicDamage_dealt: player.MAGIC_DAMAGE_DEALT_TO_CHAMPIONS,
      physicalDamage_dealt: player.PHYSICAL_DAMAGE_DEALT_TO_CHAMPIONS,
      trueDamage_dealt: player.TRUE_DAMAGE_DEALT_TO_CHAMPIONS,
      visionScore: player.VISION_SCORE,
      visionWardsBought: player.VISION_WARDS_BOUGHT_IN_GAME,
      wardsPlaced: player.WARDS_PLACED,
      wardsKilled: player.WARDS_KILLED,
      id: player.PUUID,
      win: player.WIN === "Win" ? true : false,
    }));

    return {
      statsJson: filteredStats,
    };
  } catch (e) {
    throw new Error("ROFL 파일 처리 오류: " + e.message);
  }
};

matchController.uploadAndProcessMatch = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "ROFL 파일을 업로드해주세요." });
  }

  const filePath = req.file.path;

  try {
    const processedData = await processRoflFileWithoutReader(filePath);

    const match = new Match(processedData);
    await match.save();

    fs.unlinkSync(filePath);

    res
      .status(200)
      .json({ message: "파일 업로드 및 분석 성공", data: processedData });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

matchController.getUnprocessedMatch = async (req, res) => {
  try {
    const match = await Match.findOne({ processed: false });

    if (!match) {
      return res
        .status(404)
        .json({ message: "처리되지 않은 파일이 없습니다." });
    }

    res
      .status(200)
      .json({ message: "처리되지 않은 파일 조회 성공", data: match });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

matchController.postProcessedMatch = async (req, res) => {};

module.exports = matchController;
