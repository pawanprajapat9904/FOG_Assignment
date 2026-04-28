const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

// GET all games
router.get("/", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json({ success: true, data: games });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single game
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ success: false, message: "Game not found" });
    res.json({ success: true, data: game });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new game
router.post("/", async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json({ success: true, data: game });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
