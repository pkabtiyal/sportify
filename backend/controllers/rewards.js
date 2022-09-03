//Author@Soham Kansodaria(B00865680)
const mongoose = require("mongoose");
require("dotenv").config();
const Reward = require("../models/rewards");
const Memebership = require("../models/membership");
const User = require("../models/user");
const mail = require("../service/mail");

const encodedReward = (reward) =>
  (({ _id, __v, ...newReward }) => newReward)(reward);

//   cite : https://stackoverflow.com/questions/53427046/how-to-add-space-between-every-4-characters-in-javascript
const string16gen = () => {
  let code = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 16; i++)
    code += chars.charAt(Math.floor(Math.random() * chars.length));

  codeSplit = code.match(/.{1,4}/g);
  const finalCode = codeSplit.join("-");
  return finalCode;
};

const getPoints = async (request, response) => {
  const requestBody = request.body;
  const userId = requestBody.id;

  try {
    const findMembership = await Memebership.find({ user_id: userId });
    // console.log(findMembership);
    if (findMembership.length > 0) {
      let totalSpentMoney = 0;
      for (const membership of findMembership) {
        if (membership.status !== "Cancelled") {
          totalSpentMoney += membership.total_cost;
        }
      }
      //   console.log(totalSpentMoney);
      let totalPoints = Math.round(totalSpentMoney * 10);
      //   console.log("total points" + totalPoints);
      const rewardCheck = await Reward.findOne({ user_id: userId });
      if (rewardCheck) {
        if (rewardCheck.total_spent_money !== totalSpentMoney) {
          const rewardUpdate = await Reward.findByIdAndUpdate(
            { _id: rewardCheck._id },
            {
              $set: {
                total_spent_money: totalSpentMoney,
                total_earned_points: totalPoints,
              },
            },
            { new: true }
          );
          console.log("update" + rewardUpdate);
          const encReward = encodedReward(rewardUpdate._doc);
          response.status(200).json({
            message: "Your points retrieve successfully.",
            reward: encReward,
          });
        } else {
          console.log("Not update" + rewardCheck);
          const encReward = encodedReward(rewardCheck._doc);
          response.status(200).json({
            message: "Your points retrieve successfully.",
            reward: encReward,
          });
        }
      } else {
        const rewardNew = new Reward({
          user_id: userId,
          total_spent_money: totalSpentMoney,
          reedemed_points: 0,
          total_earned_points: totalPoints,
        });
        const rewardCreate = await rewardNew.save();
        console.log("new creation" + rewardCreate);
        const encReward = encodedReward(rewardCreate._doc);
        response.status(200).json({
          message: "Your points retrieve successfully.",
          reward: encReward,
        });
      }
    } else {
      response.status(401).json({
        message: "No payments found",
        reward: {
          user_id: userId,
          total_spent_money: 0,
          reedemed_points: 0,
          total_earned_points: 0,
        },
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

const updatePoints = async (request, response) => {
  const requestBody = request.body;
  const userId = requestBody.id;
  const brand = requestBody.brand;
  const code = string16gen();
  const reedemed_points = requestBody.reedemed_points;
  const money = parseFloat((reedemed_points / 30).toFixed(2));
  let emailAddress = "sportify5709@gmail.com";
  console.log(code, money);

  try {
    const rewardUpdate = await Reward.findOneAndUpdate(
      { user_id: userId },
      {
        $set: {
          reedemed_points: reedemed_points,
        },
      },
      { new: true }
    );
    console.log("update" + rewardUpdate);
    const encReward = encodedReward(rewardUpdate._doc);
    const targetUser = await User.findOne({ _id: userId });
    console.log(targetUser);
    const mailContent = {
      from: emailAddress,
      to: targetUser.email,
      subject: "Sportify Redeem Points",
      html: `<p>Hi ${targetUser.firstName}, you successfully redeemed your points. <br/> Here is your redeemed voucher: <br/> Brand - ${brand} <br/> Cash - CA$ ${money} <br/> Voucher Code - <br/> ${code} <br/> <br/> Thanks, Sportify Team</p>`,
    };

    mail.sendMail(mailContent, function (error, info) {
      if (error) {
        console.log(error);
        response.status(200).json({
          message: "Voucher made, but mail not send.",
          reward: encReward,
        });
      } else {
        response.status(200).json({
          message: "Voucher mailed successfully.",
          reward: encReward,
        });
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  getPoints,
  updatePoints,
};
