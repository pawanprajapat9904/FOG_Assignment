import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Target, Zap, Shield, Search, Terminal, ChevronRight, Activity } from "lucide-react";
import { scoresAPI } from "../hooks/useAPI";
import "./Leaderboard.css";

const getTierData = (score) => {
  if (score >= 2000) return { name: "APEX PREDATOR", color: "#ff4b2b", bg: "rgba(255, 75, 43, 0.1)", icon: "🔥" };
  if (score >= 1500) return { name: "DIAMOND", color: "#00f2ff", bg: "rgba(0, 242, 255, 0.1)", icon: "💎" };
  return { name: "PLATINUM", color: "#00ff88", bg: "rgba(0, 255, 136, 0.1)", icon: "⚔️" };
};

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    scoresAPI.getLeaderboard().then(r => {
      const d = r.data.data || [];
      setScores(d); setFiltered(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFiltered(scores.filter(s => s.playerName.toLowerCase().includes(search.toLowerCase())));
  }, [search, scores]);

  return (
    <div className="god-tier-lb">
      <div className="bg-glitch-overlay"></div>
      <div className="atmospheric-smoke"></div>

      {/* --- TOP HUD: TACTICAL INFO --- */}
      <nav className="tactical-hud">
        <div className="hud-left">
          <Terminal size={18} color="#ff4b2b"/>
          <span className="hud-id">NEURAL_LINK // RECON_LEADERBOARD</span>
        </div>
        <div className="hud-right">
          <div className="search-wrapper">
            <Search size={14} className="s-icon"/>
            <input type="text" placeholder="FILTER_OPERATOR..." onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="live-ping"><Activity size={14}/> 12MS</div>
        </div>
      </nav>

      {loading ? (
        <div className="lb-booting">BOOTING_RANKINGS...</div>
      ) : (
        <main className="lb-viewport">
          {/* --- CHAMPION BANNERS (3D LOOK) --- */}
          <section className="champion-podium">
            {filtered.slice(0, 3).map((s, i) => {
              const tier = getTierData(s.score);
              return (
                <motion.div 
                  key={s._id} 
                  initial={{ scale: 0.9, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className={`champ-banner rank-${i + 1}`}
                >
                  <div className="banner-rank-tag">#{i + 1}</div>
                  <div className="banner-pfp">
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${s.playerName}`} alt="P" />
                    <div className="pfp-glow" style={{ background: tier.color }}></div>
                  </div>
                  <div className="banner-meta">
                    <h2 className="legend-name">{s.playerName}</h2>
                    <div className="tier-tag" style={{ color: tier.color, background: tier.bg }}>
                      {tier.icon} {tier.name}
                    </div>
                    <div className="rp-display">{s.score} <small>RP</small></div>
                  </div>
                  <div className="banner-stats-row">
                    <span><Target size={12}/> {s.rows}x{s.cols}</span>
                    <span><Shield size={12}/> {s.livesLeft}L</span>
                  </div>
                  <div className="banner-frame" style={{ borderColor: tier.color }}></div>
                </motion.div>
              );
            })}
          </section>

          {/* --- DATA TABLE: THE GRID --- */}
          <section className="data-grid-container">
            <div className="grid-header">
              <span>RANK</span>
              <span>OPERATOR_ID</span>
              <span className="hide-m">PATTERN</span>
              <span>RATING_RP</span>
              <span>STATUS</span>
            </div>
            <div className="grid-body">
              <AnimatePresence>
                {filtered.slice(3).map((s, i) => (
                  <motion.div 
                    key={s._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 15, backgroundColor: "rgba(255, 75, 43, 0.05)" }}
                    className="grid-row"
                  >
                    <span className="g-rank">#{i + 4}</span>
                    <span className="g-name">{s.playerName}</span>
                    <span className="g-pattern hide-m">P-{s.pattern}</span>
                    <span className="g-score">{s.score}</span>
                    <span className={`g-result ${s.result}`}>{s.result.toUpperCase()}</span>
                    <ChevronRight size={14} className="g-arrow" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER BAR */}
      <footer className="tactical-footer">
        <div className="f-left">NODE: JAIPUR_CENTER_01</div>
        <div className="f-right">GLOBAL_SYNC: 100% SUCCESS</div>
      </footer>
    </div>
  );
}