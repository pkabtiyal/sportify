//Author@Soham Kansodaria(B00865680)
const mongoDb = require("mongoose");
const Coupon = mongoDb.model(
  "Coupon",
  new mongoDb.Schema({
    coupon_brand: String,
    coupon_code: String,
    coupon_discount: Number,
    coupon_description: String,
    coupon_link: String,
  })
);
module.exports = Coupon;