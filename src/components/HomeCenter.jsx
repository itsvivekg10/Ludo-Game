import React from "react";
import { useGame } from "./GameLogic";
import Token from "./Token";

export function HomeCenterCoins({ parent, style }) {
  const { blocks } = useGame();
  const key = `${parent[0]}-won`;
  const winners = blocks[key] || [];
  return (
    <div className="homeCenterCoin" style={style}>
      {winners.map((item) => (
        <Token key={item} tokenKey={item} parent={parent} className="haveWon" />
      ))}
    </div>
  );
}

export default function HomeCenter() {
  return (
    <div className="homeCenter">
      <div>
        <HomeCenterCoins parent="yellow" />
      </div>
      <div>
        <HomeCenterCoins parent="palegreen" style={{ transform: "rotate(90deg)" }} />
        {/* Dice sits in middle visually */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}></div>
        <HomeCenterCoins parent="royalblue" style={{ transform: "rotate(90deg)" }} />
      </div>
      <div>
        <HomeCenterCoins parent="red" />
      </div>
    </div>
  );
}
