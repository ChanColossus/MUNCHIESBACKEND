const mongoose = require("mongoose");


const munchiesreviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  Munchies: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Munchies",
    require: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MunchiesReview = mongoose.model("MunchiesReview", munchiesreviewSchema);

module.exports = MunchiesReview;
