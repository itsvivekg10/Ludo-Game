import React from "react";
import { markColorIndexes, markStarIndexes, colorMap } from "../config/constants";
import { useGame } from "./GameLogic";
import Token from "./Token";
import StarBg from "../assets/sounds/react.svg"; // optional star image

export default function StepsBox({ parent, adjacentDirection, index }) {
  const { blocks } = useGame();
  const parentKey = parent[0] + index;

  const isStar = markStarIndexes[adjacentDirection].markIndex.includes(index);
  const isColor = markColorIndexes[adjacentDirection].markIndex.includes(index);

  const style = {
    backgroundImage: isStar ? `url(${StarBg})` : "",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "60%",
    backgroundColor: isColor ? parent : "transparent",
    borderRadius: "6px",
    position: "relative",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const occupants = blocks[parentKey] || [];

  return (
    <div
      className="stepBox"
      style={style}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 8px rgba(0,0,0,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {occupants.map((t) => (
        <Token key={t} tokenKey={t} parent={colorMap[t[0]]} />
      ))}
    </div>
  );
}
