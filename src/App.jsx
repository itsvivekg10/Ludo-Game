import React from "react";
import Board from "./components/Board";
import GameLogicProvider from "./components/GameLogic";
import PlayerInfo from "./components/PlayerInfo";
import "./App.css";

function App() {
  return (
    <GameLogicProvider>
      <div className="App">
        <div style={{ minWidth: 450 }}>
          <Board />
        </div>
        <div style={{ width: 320 }}>
          <PlayerInfo />
        </div>
      </div>
    </GameLogicProvider>
  );
}

export default App;
