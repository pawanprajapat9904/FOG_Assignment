const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// GET leaderboard (top 20)
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(20);
    res.json({ success: true, data: scores });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST save score
router.post("/", async (req, res) => {
  try {
    const score = new Score(req.body);
    await score.save();
    res.status(201).json({ success: true, data: score });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
