import React from "react";
import { useGame } from "./GameLogic";

/**
 * Token component - simple colored circle that reacts to clicks.
 * tokenKey: e.g. 'r0'
 * parent: e.g. 'royalblue'
 */
export default function Token({ tokenKey, parent, className = "" }) {
  const { coins, onTokenClick, currentPlayer } = useGame();

  // Determine position from coins map. If missing (defensive), treat as home.
  let pos = "home";
  if (coins[parent] && coins[parent][tokenKey]) pos = coins[parent][tokenKey].position;

  // Render a colored circle — clicking triggers onTokenClick(parent, tokenKey)
  return (
    <div
      className={"coin" + (currentPlayer === parent ? " current-player-animation" : "") + (className ? " " + className : "")}
      onClick={() => onTokenClick(parent, tokenKey)}
      title={`${tokenKey} → ${pos}`}
      role="button"
      aria-label={`token ${tokenKey}`}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: parent,
          boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
        }}
      />
    </div>
  );
}
