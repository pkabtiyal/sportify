//Author@Soham Kansodaria(B00865680)
const mongoDb = require("mongoose");
const InvalidToken = mongoDb.model(
  "InvalidToken",
  new mongoDb.Schema({
    jwtToken: String,
  })
);
module.exports = InvalidToken;