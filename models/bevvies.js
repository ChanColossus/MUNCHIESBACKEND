const mongoose = require("mongoose");

const bevviesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter bevvies name"],
    trim: true,
    maxLength: [100, "Bevvies name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter munchies price"],
    maxLength: [5, "Bevvies price cannot exceed 5 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter bevvies description"],
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
  category: {
    type: String,
    required: [true, "Please select category for this bevvies"],
    enum: {
      values: [
        "Smoothie",
        "Juice",
        "Cocktails",
        "1 shot",
        "Coffee",
        "Chocolates & Non-Coffee"
      ],
      message: "Please select correct category for service",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bevvies", bevviesSchema);
