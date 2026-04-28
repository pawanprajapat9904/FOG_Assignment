const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const gameRoutes = require("./routes/gameRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/games", gameRoutes);
app.use("/api/scores", scoreRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FOG API running" });
});

// MongoDB connect + seed
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/fogdb")
  .then(async () => {
    console.log("MongoDB connected");
    await seedGames();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB error:", err));

// Seed default games if none exist
async function seedGames() {
  const Game = require("./models/Game");
  const count = await Game.countDocuments();
  if (count === 0) {
    await Game.insertMany([
      {
        title: "Cyber Assault",
        genre: "Action",
        rating: 4.8,
        players: "1-4",
        description: "High-octane combat in a neon dystopia. Hack, slash and survive.",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
        tags: ["FPS", "Multiplayer", "Sci-Fi"],
        releaseYear: 2024,
      },
      {
        title: "Void Runners",
        genre: "Racing",
        rating: 4.5,
        players: "1-8",
        description: "Race through collapsing dimensions at impossible speeds.",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop",
        tags: ["Racing", "Competitive", "Space"],
        releaseYear: 2024,
      },
      {
        title: "Neural Wars",
        genre: "Strategy",
        rating: 4.7,
        players: "1-2",
        description: "Command AI legions in the battle for digital supremacy.",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop",
        tags: ["Strategy", "Turn-Based", "AI"],
        releaseYear: 2023,
      },
      {
        title: "Phantom Protocol",
        genre: "Stealth",
        rating: 4.6,
        players: "1",
        description: "Ghost through enemy networks. Leave no trace. Vanish.",
        thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=600&fit=crop",
        tags: ["Stealth", "Singleplayer", "Thriller"],
        releaseYear: 2024,
      },
      {
        title: "Quantum Breach",
        genre: "Puzzle",
        rating: 4.9,
        players: "1",
        description: "Bend quantum physics to solve impossible dimensional puzzles.",
        thumbnail: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&h=600&fit=crop",
        tags: ["Puzzle", "Physics", "Solo"],
        releaseYear: 2025,
      },
      {
        title: "Dark Nexus",
        genre: "RPG",
        rating: 4.4,
        players: "1-6",
        description: "Enter the underworld of a dying megacity. Your choices reshape fate.",
        thumbnail: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=600&fit=crop",
        tags: ["RPG", "Open World", "Dark"],
        releaseYear: 2023,
      },
    ]);
    console.log("Games seeded");
  }
}
