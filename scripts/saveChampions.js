// scripts/saveChampions.js
const axios = require("axios");
const mongoose = require("mongoose");
const Champion = require("../models/Champion");
require("dotenv").config();

const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;

const saveChampionsToDB = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(MONGODB_URI_PROD);
    // API에서 데이터 가져오기
    const response = await axios.get(
      "https://ddragon.leagueoflegends.com/cdn/14.21.1/data/ko_KR/champion.json"
    );
    const championData = response.data.data;

    // 각 챔피언을 DB에 저장
    const championPromises = Object.values(championData).map(
      async (champion) => {
        const { name, title } = champion;
        const newChampion = new Champion({
          name,
          title,
        });

        // 중복된 챔피언을 덮어쓰지 않고, 존재하지 않을 때만 추가
        return Champion.findOneAndUpdate({ name }, newChampion, {
          upsert: true,
          new: true,
        });
      }
    );

    await Promise.all(championPromises);

    console.log("모든 챔피언이 성공적으로 저장되었습니다.");
  } catch (error) {
    console.error("챔피언 저장 중 오류 발생:", error);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = saveChampionsToDB;
