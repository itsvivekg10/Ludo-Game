import React from "react";
import StepsGrid from "./StepsGrid";
import HomeBox from "./HomeBox";
import HomeCenter from "./HomeCenter";
import "./../styles/board.css";

export default function Board() {
  return (
    <div className="boardWrapper" role="application" aria-label="Ludo board">
      <div className="innerRow">
        <HomeBox parent="palegreen" />
        <StepsGrid parent="yellow" adjacentDirection="leftOrTop" />
        <HomeBox parent="yellow" />
      </div>

      <div className="innerRow">
        <StepsGrid style={{ transform: "rotate(90deg)" }} parent="palegreen" adjacentDirection="rightOrBottom" />
        <HomeCenter />
        <StepsGrid style={{ transform: "rotate(90deg)" }} parent="royalblue" adjacentDirection="leftOrTop" />
      </div>

      <div className="innerRow">
        <HomeBox parent="red" />
        <StepsGrid parent="red" adjacentDirection="rightOrBottom" />
        <HomeBox parent="royalblue" />
      </div>
    </div>
  );
}
