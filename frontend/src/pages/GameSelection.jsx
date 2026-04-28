import React, { useState, useEffect, useRef, useCallback } from "react";
import { gamesAPI } from "../hooks/useAPI";
import "./GameSelection.css";

const DUMMY_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

export default function GameSelection() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const videoRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    gamesAPI
      .getAll()
      .then((res) => setGames(res.data.data || []))
      .catch(() =>
        setGames([
          { _id: "1", title: "Cyber Assault", genre: "Action", rating: 4.8, players: "1-4", description: "High-octane combat in a neon dystopia.", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop", tags: ["FPS", "Multiplayer"] },
          { _id: "2", title: "Void Runners", genre: "Racing", rating: 4.5, players: "1-8", description: "Race through collapsing dimensions.", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop", tags: ["Racing", "Space"] },
          { _id: "3", title: "Neural Wars", genre: "Strategy", rating: 4.7, players: "1-2", description: "Command AI legions in digital war.", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop", tags: ["Strategy", "AI"] },
          { _id: "4", title: "Phantom Protocol", genre: "Stealth", rating: 4.6, players: "1", description: "Ghost through enemy networks.", thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=600&fit=crop", tags: ["Stealth", "Thriller"] },
          { _id: "5", title: "Quantum Breach", genre: "Puzzle", rating: 4.9, players: "1", description: "Bend quantum physics to solve puzzles.", thumbnail: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&h=600&fit=crop", tags: ["Puzzle", "Physics"] },
          { _id: "6", title: "Dark Nexus", genre: "RPG", rating: 4.4, players: "1-6", description: "Enter the underworld of a dying megacity.", thumbnail: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=600&fit=crop", tags: ["RPG", "Dark"] },
        ])
      )
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback(
    (idx) => {
      setActiveIdx((idx + games.length) % games.length);
      setPlayingVideo(false);
    },
    [games.length]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") goTo(activeIdx - 1);
      if (e.key === "ArrowRight") goTo(activeIdx + 1);
    },
    [activeIdx, goTo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(activeIdx + (diff > 0 ? 1 : -1));
    setTouchStart(null);
  };

  const handleSelect = (idx) => {
    if (idx === activeIdx) {
      setPlayingVideo(true);
    } else {
      goTo(idx);
    }
  };

  if (loading) return (
    <div className="gs-loading">
      <div className="loading-ring" />
      <p>LOADING GAMES...</p>
    </div>
  );

  const active = games[activeIdx];

  const getCardClass = (i) => {
    const len = games.length;
    const diff = ((i - activeIdx) + len) % len;
    if (diff === 0) return "card-active";
    if (diff === 1 || diff === len - 1) return diff === 1 ? "card-right" : "card-left";
    return "card-hidden";
  };

  return (
    <div className="gs-page" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="gs-header"><br/>
        <div className="gs-badge">// SELECT YOUR GAME</div>
        <h2 className="gs-title">GAME LIBRARY</h2>
        <p className="gs-hint">SWIPE or use ← → to navigate</p>
      </div>

      {/* Card Carousel */}
      <div className="carousel" ref={trackRef}>
        {games.map((game, i) => {
          const cls = getCardClass(i);
          return (
            <div
              key={game._id}
              className={`game-card ${cls}`}
              onClick={() => handleSelect(i)}
            >
              <div className="card-img-wrap">
                <img src={game.thumbnail} alt={game.title} className="card-img" />
                <div className="card-img-overlay" />
                {cls === "card-active" && (
                  <div className="card-play-hint">
                    <span className="play-icon">▶</span>
                    <span>CLICK TO PLAY</span>
                  </div>
                )}
              </div>
              <div className="card-info">
                <div className="card-genre">{game.genre}</div>
                <h3 className="card-title">{game.title}</h3>
                <div className="card-rating">
                  {"★".repeat(Math.round(game.rating))}{"☆".repeat(5 - Math.round(game.rating))}
                  <span className="rating-num">{game.rating}</span>
                </div>
                <div className="card-tags">
                  {(game.tags || []).map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div className="card-border-glow" />
            </div>
          );
        })}
      </div>

      {/* Dots nav */}
      <div className="gs-dots">
        {games.map((_, i) => (
          <button key={i} className={`dot ${i === activeIdx ? "active" : ""}`} onClick={() => goTo(i)} />
        ))}
      </div>

      {/* Arrow buttons */}
      <button className="arrow-btn arrow-left" onClick={() => goTo(activeIdx - 1)}>‹</button>
      <button className="arrow-btn arrow-right" onClick={() => goTo(activeIdx + 1)}>›</button>

      {/* Game Detail Panel */}
      {active && (
        <div className="gs-detail glass-panel">
          <div className="detail-left">
            <div className="detail-genre">{active.genre} · {active.players} PLAYERS</div>
            <h2 className="detail-title">{active.title}</h2>
            <p className="detail-desc">{active.description}</p>
            <div className="detail-meta">
              <span className="meta-item">⭐ {active.rating}/5.0</span>
              {active.releaseYear && <span className="meta-item">📅 {active.releaseYear}</span>}
            </div>
          </div>
          <div className="detail-right">
            <button
              className="btn-play"
              onClick={() => setPlayingVideo(true)}
            >
              <span>▶</span> PLAY TRAILER
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {playingVideo && (
        <div className="video-modal" onClick={() => setPlayingVideo(false)}>
          <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <span className="video-title">{active?.title} — TRAILER</span>
              <button className="video-close" onClick={() => setPlayingVideo(false)}>✕</button>
            </div>
            <video
              ref={videoRef}
              src={DUMMY_VIDEO}
              autoPlay
              controls
              className="video-player"
            />
            <div className="video-scanlines" />
          </div>
        </div>
      )}
    </div>
  );
}
