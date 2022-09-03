//Author@Soham Kansodaria(B00865680)
const mongoDb = require("mongoose");
const User = mongoDb.model(
  "User",
  new mongoDb.Schema({
    firstName: String,
    lastName: String,
    email: String,
    contactNo: String,
    address: String,
    profile: String,
    password: String,
    verificationToken: String,
    isVerify: Boolean
  })
);
module.exports = User;