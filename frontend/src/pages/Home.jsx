import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, TrendingUp, Trophy, Zap, Cpu, Activity, 
  Gamepad2, Wallet, Bell, Search, Settings, 
  User, LayoutGrid, BarChart3, HardDrive, Battery
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ fps: 144, ping: 12, cpu: 45 });
  const [isReady, setIsReady] = useState(false);

  // Real-time stats simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        fps: Math.floor(Math.random() * (144 - 138) + 138),
        ping: Math.floor(Math.random() * (20 - 10) + 10),
        cpu: Math.floor(Math.random() * (60 - 30) + 30)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nexus-master-root">
      <div className="scanline"></div>
      <div className="cyber-grid-bg"></div>

      {/* --- SIDEBAR DOCK (Quick Navigation) --- */}
      <aside className="nexus-dock">
        <div className="dock-top">
          <div className="profile-preview">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pawan" alt="Avatar" />
            <div className="online-dot"></div>
          </div>
        </div>
        <div className="dock-mid">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><LayoutGrid /></button>
          <button className={activeTab === 'games' ? 'active' : ''} onClick={() => setActiveTab('games')}><Gamepad2 /></button>
          <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}><BarChart3 /></button>
          <button className={activeTab === 'social' ? 'active' : ''} onClick={() => setActiveTab('social')}><User /></button>
        </div>
        <div className="dock-bottom">
          <button><Settings /></button>
          <button><Bell /></button>
        </div>
      </aside>

      <main className="nexus-container">
        
        {/* --- TOP STATUS BAR --- */}
        <header className="nexus-header-hud">
          <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Search Games, Players, Missions..." />
          </div>
          <div className="system-pills">
            <div className="pill"><Cpu size={14}/> {stats.cpu}%</div>
            <div className="pill"><Activity size={14}/> {stats.ping}MS</div>
            <div className="pill orange"><Zap size={14}/> {stats.fps} FPS</div>
            <div className="pill wallet"><Wallet size={14}/> 2.5 ETH</div>
          </div>
        </header>

        <div className="content-scroll">
          {/* --- HERO SECTION --- */}
          <section className="hero-banner">
            <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="hero-text">
              <span className="badge">SEASON 01 // BATTLE PASS ACTIVE</span>
              <h1 className="glitch" data-text="NEURAL_NEXUS">NEURAL<br/>NEXUS</h1>
              <p>Experience the next evolution of MERN-based gaming. AI recommendations, Web3 rewards, and zero latency.</p>
              <div className="hero-btns">
                <button className={`btn-primary ${isReady ? 'ready' : ''}`} onClick={() => setIsReady(!isReady)}>
                  <Play fill="currentColor" /> {isReady ? "CANCELING..." : "PLAY NOW"}
                </button>
                <button className="btn-outline">VIEW TRAILER</button>
              </div>
            </motion.div>
            <div className="hero-visual">
                <div className="floating-card-ui">
                    <div className="card-header">NEW_LEADERBOARD</div>
                    <div className="rank-row"><span>#1 PAWAN</span> <span>24.5K XP</span></div>
                    <div className="rank-row"><span>#2 BOT_X</span> <span>21.0K XP</span></div>
                </div>
            </div>
          </section>

          {/* --- TECHNICAL HUD GRID (Working Specs) --- */}
          <section className="system-dashboard">
            <div className="dash-card">
              <div className="card-label">PERFORMANCE_MONITOR</div>
              <div className="graph-container">
                {[...Array(15)].map((_, i) => (
                  <motion.div key={i} className="bar" animate={{ height: `${Math.random() * 100}%` }} transition={{ repeat: Infinity, duration: 1 }} />
                ))}
              </div>
            </div>
            <div className="dash-card hardware">
              <div className="hw-row"><HardDrive size={16}/> <span>STORAGE:</span> <span>420GB FREE</span></div>
              <div className="hw-row"><Battery size={16}/> <span>BATTERY:</span> <span>98%</span></div>
              <div className="hw-row"><Settings size={16}/> <span>OS:</span> <span>NEXUS v4.0</span></div>
            </div>
          </section>

          {/* --- FEATURED GAMES (Grid) --- */}
          <section className="games-section">
            <div className="section-head"><h3>FEATURED_RELEASES</h3> <Link to="/games">VIEW ALL</Link></div>
            <div className="games-grid">
              {['Cyber Runner', 'Grid Master', 'Void Echo', 'Neon Snake'].map((game, i) => (
                <motion.div key={i} whileHover={{ y: -10 }} className="game-card">
                  <div className="game-img-placeholder"></div>
                  <div className="game-info">
                    <span className="g-title">{game}</span>
                    <span className="g-cat">MULTIPLAYER</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* --- MISSIONS & REWARDS --- */}
          <section className="missions-rewards">
             <div className="mission-card">
                <h4>DAILY_MISSIONS</h4>
                <div className="m-item"><span>Win 3 Matches</span> <span className="prog">1/3</span></div>
                <div className="m-item"><span>Earn 500 Credits</span> <span className="prog">COMPLETE</span></div>
             </div>
             <div className="reward-card">
                <h4>UNLOCKED_ACHIEVEMENTS</h4>
                <div className="ach-icons">🏆 🎖️ 🥇 💎</div>
             </div>
          </section>
        </div>

        {/* --- FOOTER --- */}
        <footer className="nexus-footer">
          <div className="footer-links">
            <span>ABOUT</span> <span>PRIVACY</span> <span>COMMUNITY</span> <span>HELP</span>
          </div>
          <div className="footer-copyright">©2026 NEURAL_NEXUS_SYSTEMS // JAIPUR_NODE</div>
        </footer>
      </main>
    </div>
  );
}