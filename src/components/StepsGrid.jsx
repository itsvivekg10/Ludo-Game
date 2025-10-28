import React from "react";
import StepsBox from "./StepsBox";

export default function StepsGrid({ style, parent, adjacentDirection }) {
  return (
    <div style={style}>
      {Array(6)
        .fill()
        .map((_, i) => (
          <div key={i} className={"stepRow"}>
            {Array(3)
              .fill()
              .map((_, j) => (
                <StepsBox
                  key={i + "" + j}
                  index={i + "" + j}
                  parent={parent}
                  adjacentDirection={adjacentDirection}
                />
              ))}
          </div>
        ))}
    </div>
  );
}
