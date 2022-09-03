//Author@Soham Kansodaria(B00865680)
const mongoDb = require("mongoose");
const Reward = mongoDb.model(
  "Reward",
  new mongoDb.Schema({
    user_id: String,
    total_spent_money: Number,
    reedemed_points: Number,
    total_earned_points: Number
  })
);
module.exports = Reward;