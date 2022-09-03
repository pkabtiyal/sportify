//Author@Soham Kansodaria(B00865680)
const mongoose = require("mongoose");
require("dotenv").config();
const Reward = require("../models/rewards");
const Memebership = require("../models/membership");
const Coupon = require("../models/coupons");

const encodedReward = (reward) =>
  (({ _id, __v, ...newReward }) => newReward)(reward);

const getCoupons = async (request, response) => {
//   const requestBody = request.body;

  try {
    // const coupon = new Coupon({
    //   coupon_brand: "My Protein",
    //   coupon_code: "MP-JULY-22",
    //   coupon_discount: 22,
    //   coupon_description: "Enjoy 22% Discount on protein powders.",
    //   coupon_link: "https://ca.myprotein.com/"
    // });
    // const creatCoupon = await coupon.save();
    // console.log(creatCoupon);

    // const coupon2 = new Coupon({
    //   coupon_brand: "My Protein",
    //   coupon_code: "MP-SUMMER-22-15",
    //   coupon_discount: 15,
    //   coupon_description: "Enjoy 15% Discount on nutrition products.",
    //   coupon_link: "https://ca.myprotein.com/"
    // });
    // const creatCoupon2 = await coupon2.save();
    // console.log(creatCoupon2);

    const coupons = await Coupon.find();
    // console.log(coupons);
    // const encReward = encodedReward(rewardUpdate._doc);
    response.status(200).json({
      message: "Coupons retrieve successfully.",
      coupons: coupons,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  getCoupons,
};
