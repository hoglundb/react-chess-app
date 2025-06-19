import React, { useState } from "react";
import ChessGame from "./components/ChessGame";
import GameSetupControls from "./components/GameSetupControls";
import "./App.css";

function App() {
  const [selectedBot, setSelectedBot] = useState(null);
  const [timeControlMinutes, setTimeControlMinutes] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="app-container">
      <h1 style={{ margin: "12px", fontSize:"26pt" }}>My React Chess App</h1>    
      {!gameStarted ? (
        <GameSetupControls
          selectedBot={selectedBot}
          onBotChange={setSelectedBot}
          selectedTimeControl={timeControlMinutes}
          onTimeControlChange={setTimeControlMinutes}
          onStartGame ={() => setGameStarted(true)}  // pass start callback
        />
      ) : (
       <ChessGame selectedBot={selectedBot} timeControl={timeControlMinutes} />
      )}
    </div>

  );
}

export default App;
