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

    return {
      statsJson, // JSON 객체로 반환
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

module.exports = matchController;
