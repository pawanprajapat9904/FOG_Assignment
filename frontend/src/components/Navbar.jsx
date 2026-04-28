import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { path: "/", label: "HOME" },
  { path: "/games", label: "GAMES" },
  { path: "/grid-game", label: "GRID" },
  { path: "/leaderboard", label: "RANKING" },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "nav-open" : ""}`}>
      <div className="navbar-inner">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <div className="logo-hex">
             <span className="logo-text">FOG</span>
          </div>
          <span className="logo-sub">NEXUS</span>
        </Link>

        {/* LINKS */}
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            >
              <span className="link-glitch" data-text={link.label}>{link.label}</span>
              <div className="link-indicator" />
            </Link>
          ))}
        </div>

        {/* LIVE HUD STATS (Right Side) */}
        <div className="nav-status-hud">
          <div className="status-item">
            <span className="status-label">CREDITS</span>
            <span className="status-value cyan">◈ 2,500</span>
          </div>
          <div className="status-item profile-box">
            <span className="status-label">LEVEL 12</span>
            <div className="mini-xp-bar"><div className="fill" style={{width: '60%'}}></div></div>
          </div>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}