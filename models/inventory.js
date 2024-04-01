const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [5, "Product price cannot exceed 5 characters"],
    default: 0.0,
  },
  stocks: {
    type: Number,
    required: [true, "Please enter product stocks"],
    maxLength: [5, "Product stock cannot exceed 5 characters"],
    default: 0.0,
  },
  category: {
    type: String,
    required: [true, "Please select category for this product"],
    enum: {
      values: ["Munchies", "Bevvies"],
      message: "Please select correct category for product",
    },
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Inventory", inventorySchema);
