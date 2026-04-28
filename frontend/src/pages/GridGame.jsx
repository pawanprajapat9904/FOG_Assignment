import React, { useState, useEffect, useCallback, useRef } from "react";
import { scoresAPI } from "../hooks/useAPI";
import "./GridGame.css";

const TILE = { EMPTY: "empty", BLUE: "blue", RED: "red", GREEN: "green", PLAYER: "player" };
const MAX_LIVES = 5;
const TIMER = 30;

// --- TILE TYPES ---
// const TILE = {
//   EMPTY: 0,
//   RED: 1,
//   GREEN: 2,
//   BLUE: 3
// };

// --- Pattern generators ---

function generatePattern1(rows, cols) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(TILE.EMPTY));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const even = (r + c) % 2 === 0;

      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        grid[r][c] = TILE.RED;
      } else if (even) {
        grid[r][c] = Math.random() < 0.7 ? TILE.BLUE : TILE.GREEN;
      } else {
        grid[r][c] = TILE.GREEN;
      }
    }
  }

  grid[1][1] = TILE.GREEN;
  return grid;
}


function generatePattern2(rows, cols) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(TILE.RED));

  // base walkable area
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      grid[r][c] = TILE.GREEN;
    }
  }

  // diagonal styling
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const diag = Math.floor((r + c) / 3) % 3;

      if (diag === 0) {
        grid[r][c] = TILE.BLUE;
      } else if (diag === 1) {
        // light obstacles
        if (Math.random() < 0.3) {
          grid[r][c] = TILE.RED;
        }
      }
    }
  }

  // safe start area
  grid[0][0] = TILE.GREEN;
  grid[1][0] = TILE.GREEN;
  grid[0][1] = TILE.GREEN;
  grid[1][1] = TILE.GREEN;

  return grid;
}


// --- VALIDATOR (BFS) ---
function canReachAllBlue(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // 🔹 Find a valid start (first non-RED tile)
  let start = null;
  for (let r = 0; r < rows && !start; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== TILE.RED) {
        start = [r, c];
        break;
      }
    }
  }

  if (!start) return false; // full RED grid edge case

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [start];
  visited[start[0]][start[1]] = true;

  const dirs = [
    [1, 0], [-1, 0],
    [0, 1], [0, -1]
  ];

  while (queue.length) {
    const [r, c] = queue.shift();

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !visited[nr][nc] &&
        grid[nr][nc] !== TILE.RED
      ) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }

  // 🔹 check all BLUE reachable
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === TILE.BLUE && !visited[r][c]) {
        return false;
      }
    }
  }

  return true;
}

// --- SAFE WRAPPERS (IMPORTANT) ---

function generatePattern1Safe(rows, cols) {
  let grid;
  do {
    grid = generatePattern1(rows, cols);
  } while (!canReachAllBlue(grid));
  return grid;
}

function generatePattern2Safe(rows, cols) {
  let grid;
  do {
    grid = generatePattern2(rows, cols);
  } while (!canReachAllBlue(grid));
  return grid;
}

function countBlue(grid) {
  return grid.flat().filter((t) => t === TILE.BLUE).length;
}

export default function GridGame() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [rowsInput, setRowsInput] = useState("10");
  const [colsInput, setColsInput] = useState("10");
  const [pattern, setPattern] = useState(1);
  const [gameState, setGameState] = useState("setup"); // setup | playing | win | lose
  const [grid, setGrid] = useState([]);
  const [playerPos, setPlayerPos] = useState({ r: 1, c: 1 });
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TIMER);
  const [score, setScore] = useState(0);
  const [blueLeft, setBlueLeft] = useState(0);
  const [blinkCells, setBlinkCells] = useState({});
  const [playerName, setPlayerName] = useState("PLAYER_01");
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLB, setShowLB] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const timerRef = useRef(null);
  const gridRef = useRef(null);

  // Start game
  const startGame = useCallback(() => {
    const r = Math.max(10, parseInt(rowsInput) || 10);
    const c = Math.max(10, parseInt(colsInput) || 10);
    setRows(r); setCols(c);
    const gen = pattern === 1 ? generatePattern1(r, c) : generatePattern2(r, c);
    setGrid(gen);
    setPlayerPos({ r: 1, c: 1 });
    setLives(MAX_LIVES);
    setTimeLeft(TIMER);
    setScore(0);
    setBlueLeft(countBlue(gen));
    setBlinkCells({});
    setScoreSaved(false);
    setGameState("playing");
  }, [rowsInput, colsInput, pattern]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setGameState("lose"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Keyboard movement
  const movePlayer = useCallback(
    (dr, dc) => {
      if (gameState !== "playing") return;
      setPlayerPos((pos) => {
        const nr = pos.r + dr, nc = pos.c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return pos;
        const tile = grid[nr][nc];
        if (tile === TILE.RED) {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) { setTimeout(() => setGameState("lose"), 100); }
            return nl;
          });
          // Blink
          const key = `${nr}-${nc}`;
          setBlinkCells((b) => ({ ...b, [key]: true }));
          setTimeout(() => setBlinkCells((b) => { const nb = { ...b }; delete nb[key]; return nb; }), 600);
          return pos;
        }
        if (tile === TILE.BLUE) {
          setGrid((g) => {
            const ng = g.map((row) => [...row]);
            ng[nr][nc] = TILE.GREEN;
            return ng;
          });
          setScore((s) => s + 10);
          setBlueLeft((bl) => {
            const nb = bl - 1;
            if (nb <= 0) {
              setTimeout(() => {
                if (pattern === 1) {
                  // Auto transition to pattern 2
                  setPattern(2);
                  setTimeout(() => {
                    const ng2 = generatePattern2(rows, cols);
                    setGrid(ng2);
                    setPlayerPos({ r: 0, c: 0 });
                    setBlueLeft(countBlue(ng2));
                    setTimeLeft(TIMER);
                    setBlinkCells({});
                  }, 800);
                } else {
                  setGameState("win");
                }
              }, 100);
              return nb;
            }
            return nb;
          });
        }
        return { r: nr, c: nc };
      });
    },
    [gameState, rows, cols, grid, pattern]
  );

  useEffect(() => {
    const handler = (e) => {
      const map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1] };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); movePlayer(...dir); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [movePlayer]);

  // Save score on game end
  useEffect(() => {
    if ((gameState === "win" || gameState === "lose") && !scoreSaved) {
      setScoreSaved(true);
      scoresAPI.saveScore({
        playerName,
        score: gameState === "win" ? score + timeLeft * 2 : score,
        pattern,
        rows,
        cols,
        timeLeft,
        livesLeft: lives,
        result: gameState,
      }).catch(() => {});
    }
  }, [gameState]);

  const fetchLB = () => {
    scoresAPI.getLeaderboard()
      .then((r) => setLeaderboard(r.data.data || []))
      .catch(() => setLeaderboard([]));
    setShowLB(true);
  };

  const tileClass = (tile, r, c) => {
    const isPlayer = playerPos.r === r && playerPos.c === c;
    const blink = blinkCells[`${r}-${c}`];
    if (isPlayer) return "tile tile-player";
    if (blink) return "tile tile-blink";
    return `tile tile-${tile}`;
  };

  const CELL_SIZE = Math.max(18, Math.min(44, Math.floor(Math.min(
    (window.innerWidth - 48) / cols,
    (window.innerHeight * 0.55) / rows
  ))));

  if (gameState === "setup") return (
    <div className="gg-setup">
      <div className="gg-panel glass-panel">
        <div className="gg-badge">// NEXUS GRID ENGINE v2.0</div>
        <h2 className="gg-title">GRID GAME</h2>
        <div className="setup-row">
          <div className="setup-field">
            <label>ROWS <span className="setup-min">(min 10)</span></label>
            <input type="number" min="10" max="30" value={rowsInput} onChange={(e) => setRowsInput(e.target.value)} className="setup-input" />
          </div>
          <div className="setup-field">
            <label>COLUMNS <span className="setup-min">(min 10)</span></label>
            <input type="number" min="10" max="30" value={colsInput} onChange={(e) => setColsInput(e.target.value)} className="setup-input" />
          </div>
        </div>
        <div className="setup-field full">
          <label>PLAYER NAME</label>
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="setup-input" maxLength={20} />
        </div>
        <div className="pattern-select">
          <label>SELECT PATTERN</label>
          <div className="pattern-btns">
            {[1, 2].map((p) => (
              <button key={p} className={`pattern-btn ${pattern === p ? "active" : ""}`} onClick={() => setPattern(p)}>
                PATTERN {p}
              </button>
            ))}
          </div>
        </div>
        <div className="setup-legend">
          <div className="legend-item"><span className="legend-box blue" />BLUE — collect (+10pts)</div>
          <div className="legend-item"><span className="legend-box red" />RED — danger (-1 life)</div>
          <div className="legend-item"><span className="legend-box green" />GREEN — safe zone</div>
          <div className="legend-item"><span className="legend-box player" />YOU — use WASD / ↑↓←→</div>
        </div>
        <div className="setup-rules">
          <span>⚡ {MAX_LIVES} lives · ⏱ {TIMER}s timer · Win by collecting all blue tiles</span>
        </div>
        <button className="btn-start" onClick={startGame}>INITIALIZE GRID ▶</button>
        <button className="btn-lb" onClick={fetchLB}>VIEW LEADERBOARD</button>
      </div>
      {showLB && (
        <div className="lb-modal" onClick={() => setShowLB(false)}>
          <div className="lb-inner glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lb-header">
              <span className="lb-title">// LEADERBOARD</span>
              <button className="lb-close" onClick={() => setShowLB(false)}>✕</button>
            </div>
            {leaderboard.length === 0 ? (
              <p className="lb-empty">No scores yet. Be the first!</p>
            ) : (
              <table className="lb-table">
                <thead><tr><th>#</th><th>PLAYER</th><th>SCORE</th><th>RESULT</th></tr></thead>
                <tbody>
                  {leaderboard.map((s, i) => (
                    <tr key={s._id} className={s.result === "win" ? "lb-win" : "lb-lose"}>
                      <td>{i + 1}</td>
                      <td>{s.playerName}</td>
                      <td>{s.score}</td>
                      <td>{s.result.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (gameState === "win" || gameState === "lose") return (
    <div className="gg-result">
      <div className={`result-panel glass-panel ${gameState}`}>
        <div className={`result-icon ${gameState}`}>{gameState === "win" ? "◈" : "✕"}</div>
        <h2 className="result-title">{gameState === "win" ? "MISSION COMPLETE" : "SYSTEM FAILURE"}</h2>
        <p className="result-sub">{gameState === "win" ? "ALL BLUE NODES COLLECTED" : lives <= 0 ? "LIVES DEPLETED" : "TIME EXPIRED"}</p>
        <div className="result-stats">
          <div className="result-stat"><span className="rs-num">{gameState === "win" ? score + timeLeft * 2 : score}</span><span className="rs-label">FINAL SCORE</span></div>
          <div className="result-stat"><span className="rs-num">{lives}</span><span className="rs-label">LIVES LEFT</span></div>
          <div className="result-stat"><span className="rs-num">{timeLeft}s</span><span className="rs-label">TIME LEFT</span></div>
        </div>
        <div className="result-actions">
          <button className="btn-start" onClick={startGame}>RETRY</button>
          <button className="btn-lb" onClick={() => setGameState("setup")}>MAIN MENU</button>
          <button className="btn-lb" onClick={fetchLB}>LEADERBOARD</button>
        </div>
      </div>
      {showLB && (
        <div className="lb-modal" onClick={() => setShowLB(false)}>
          <div className="lb-inner glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lb-header">
              <span className="lb-title">// LEADERBOARD</span>
              <button className="lb-close" onClick={() => setShowLB(false)}>✕</button>
            </div>
            {leaderboard.length === 0 ? <p className="lb-empty">No scores yet.</p> : (
              <table className="lb-table">
                <thead><tr><th>#</th><th>PLAYER</th><th>SCORE</th><th>RESULT</th></tr></thead>
                <tbody>
                  {leaderboard.map((s, i) => (
                    <tr key={s._id} className={s.result === "win" ? "lb-win" : "lb-lose"}>
                      <td>{i + 1}</td><td>{s.playerName}</td><td>{s.score}</td><td>{s.result.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="gg-game">
      {/* HUD */}
      <div className="gg-hud">
        <div className="hud-block">
          <span className="hud-label">PATTERN</span>
          <span className="hud-val">{pattern}</span>
        </div>
        <div className="hud-block">
          <span className="hud-label">LIVES</span>
          <span className="hud-val lives">{Array.from({ length: MAX_LIVES }, (_, i) => (
            <span key={i} className={i < lives ? "heart active" : "heart"}>♥</span>
          ))}</span>
        </div>
        <div className={`hud-block timer-block ${timeLeft <= 10 ? "danger" : ""}`}>
          <span className="hud-label">TIME</span>
          <span className="hud-val hud-timer">{timeLeft}s</span>
        </div>
        <div className="hud-block">
          <span className="hud-label">SCORE</span>
          <span className="hud-val hud-score">{score}</span>
        </div>
        <div className="hud-block">
          <span className="hud-label">BLUE LEFT</span>
          <span className="hud-val">{blueLeft}</span>
        </div>
        <button className="hud-quit" onClick={() => { clearInterval(timerRef.current); setGameState("setup"); }}>✕ QUIT</button>
      </div>

      {/* Grid */}
      <div
        className="gg-grid-wrap"
        ref={gridRef}
        tabIndex={0}
        style={{ outline: "none" }}
      >
        <div
          className="gg-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          }}
        >
          {grid.map((row, r) =>
            row.map((tile, c) => (
              <div
                key={`${r}-${c}`}
                className={tileClass(tile, r, c)}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            ))
          )}
        </div>
      </div>

      {/* Mobile controls */}
      <div className="mobile-dpad">
        <button className="dpad-btn dpad-up" onClick={() => movePlayer(-1, 0)}>▲</button>
        <div className="dpad-row">
          <button className="dpad-btn dpad-left" onClick={() => movePlayer(0, -1)}>◀</button>
          <div className="dpad-center" />
          <button className="dpad-btn dpad-right" onClick={() => movePlayer(0, 1)}>▶</button>
        </div>
        <button className="dpad-btn dpad-down" onClick={() => movePlayer(1, 0)}>▼</button>
      </div>
    </div>
  );
}
