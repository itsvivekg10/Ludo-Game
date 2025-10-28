import React, { useState } from "react";
import { useGame } from "./GameLogic";
import Dice from "./Dice";
import "../styles/player.css"; // optional (most styles in App.css)

export default function PlayerInfo() {
  const { playersList, currentPlayer, dice, rollDice, winners, resetGame, canAnyMove } = useGame();
  const [infoMsg, setInfoMsg] = useState("");

  const startGameWith = (n) => {
    resetGame(n);
    setInfoMsg("");
  };

  const onRollClick = () => {
    // prevent clicking if locked
    if (dice.isLocked) return;
    rollDice();
    // if this roll leads to no move, GameLogic will auto-end turn
  };

  return (
    <div className="controlPanel" aria-label="Game Control Panel">
      <h2>Ludo — Controls</h2>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
        <button className="playerBtn" onClick={() => startGameWith(2)}>2 Players</button>
        <button className="playerBtn" onClick={() => startGameWith(3)}>3 Players</button>
        <button className="playerBtn" onClick={() => startGameWith(4)}>4 Players</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <strong>Current:</strong>
          <div style={{ marginTop: 8, padding: 8, borderRadius: 8, background: "#f8fafc", minWidth: 120 }}>
            <div style={{ fontWeight: 700 }}>{currentPlayer}</div>
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 12, color: "#475569" }}>
              {dice.num ? `Rolled: ${dice.num}` : "Roll to play"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
        <div>
          <Dice />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={onRollClick} disabled={dice.isLocked} style={{ padding: "8px 12px" }}>
            Roll Dice
          </button>
          <button onClick={() => resetGame(4)} style={{ padding: "8px 12px" }}>
            Reset (4 players)
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ margin: "8px 0" }}>Players</h4>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {playersList.map((p) => (
            <div
              key={p}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: p === currentPlayer ? p : "#f2f4f7",
                color: p === currentPlayer ? "#fff" : "#0f172a",
                minWidth: 90,
                textAlign: "center",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ margin: "8px 0" }}>Winners</h4>
        {winners.length ? (
          winners.map((w) => (
            <div key={w} style={{ padding: 6, background: "#fff", borderRadius: 6, marginBottom: 6 }}>
              {w}
            </div>
          ))
        ) : (
          <div style={{ color: "#94a3b8" }}>—</div>
        )}
      </div>

      {infoMsg && (
        <div style={{ marginTop: 8, padding: 8, background: "#fff8", borderRadius: 6 }}>{infoMsg}</div>
      )}
    </div>
  );
}