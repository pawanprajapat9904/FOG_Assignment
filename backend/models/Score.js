const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: true },
    score: { type: Number, required: true },
    pattern: { type: Number, default: 1 },
    rows: { type: Number, default: 10 },
    cols: { type: Number, default: 10 },
    timeLeft: { type: Number, default: 0 },
    livesLeft: { type: Number, default: 0 },
    result: { type: String, enum: ["win", "lose"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
