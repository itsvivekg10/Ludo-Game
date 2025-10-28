import React, { useState } from "react";
import { useGame } from "./GameLogic";
import "../styles/dice.css"; // (optional - main styles in App.css)

export default function Dice() {
  const { dice, rollDice, currentPlayer } = useGame();
  const [anim, setAnim] = useState(false);

  const onClick = async () => {
    if (anim || dice.isLocked) return;
    setAnim(true);
    setTimeout(() => {
      rollDice();
      setAnim(false);
    }, 600);
  };

  return (
    <div className="dice-container" style={{ display: "flex", justifyContent: "center" }}>
      <div
        className={"dice" + (anim ? " dice-animation" : "")}
        onClick={onClick}
        style={{
          borderColor: currentPlayer,
          boxShadow: anim ? `0 0 20px ${currentPlayer}70` : "0 4px 10px rgba(0, 0, 0, 0.06)",
          opacity: dice.isLocked ? 0.85 : 1,
        }}
        role="button"
        aria-disabled={dice.isLocked}
        title={dice.isLocked ? "Dice locked — move a token (or waiting to pass)" : "Roll dice"}
      >
        <span className="dice-number" style={{ fontSize: 22 }}>
          {dice.num || 1}
        </span>
      </div>
    </div>
  );
}
