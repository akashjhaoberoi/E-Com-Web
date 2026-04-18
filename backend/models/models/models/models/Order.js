const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  products: Array,
  amount: Number
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);