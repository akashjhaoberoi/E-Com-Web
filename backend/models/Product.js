const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Please add a description"]
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: [0, "Price cannot be negative"]
  },
  category: {
    type: String,
    required: [true, "Please add a category"]
  },
  imageUrl: {
    type: String,
    default: "https://via.placeholder.com/300"
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock cannot be negative"]
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  },
  reviews: [{
    user: mongoose.Schema.Types.ObjectId,
    comment: String,
    rating: Number
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
