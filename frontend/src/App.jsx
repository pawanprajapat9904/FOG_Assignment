import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GameSelection from "./pages/GameSelection";
import GridGame from "./pages/GridGame";
import Leaderboard from "./pages/Leaderboard";
import Home from "./pages/Home";

export default function App() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GameSelection />} />
        <Route path="/grid-game" element={<GridGame />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}
