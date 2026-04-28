const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, default: 4.0 },
    players: { type: String, default: "1" },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    tags: [String],
    releaseYear: { type: Number, default: 2024 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
