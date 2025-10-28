import React from "react";
import { useGame } from "./GameLogic";
import Token from "./Token";

/**
 * Shows 4 home slots for a player and renders tokens that are currently at 'home'.
 */
export default function HomeBox({ parent }) {
  const { coins, currentPlayer, playersList } = useGame();
  const slots = Array.from({ length: 4 }).map((_, i) => parent[0] + i);

  return (
    <div className={"homeBox"}>
      {currentPlayer === parent && <div className={"homeBoxOverlay"} style={{ borderColor: parent }}></div>}
      {slots.map((slotKey) => (
        <div key={slotKey} className={"homeBoxInner"} style={{ border: `20px solid ${parent}` }}>
          {playersList.includes(parent) &&
            coins[parent] &&
            coins[parent][slotKey] &&
            coins[parent][slotKey].position === "home" && <Token tokenKey={slotKey} parent={parent} />}
        </div>
      ))}
    </div>
  );
}
