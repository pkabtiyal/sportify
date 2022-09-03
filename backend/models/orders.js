const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema(
  {
    userId: { type: String, required: true },
    total: { type: Number, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;