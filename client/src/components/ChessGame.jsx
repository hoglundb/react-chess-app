import React from "react";
import { Chessboard } from "react-chessboard";
import ChessControlls from "./ChessControlls";
import useChessGame from "../hooks/useChessGame";
import useChessTimer from "../hooks/useChessTimer";
import useMoveAudio from "../hooks/useMoveAudio";
import EndGameOverlay from "./EndGameOverlay";
import styles from "../styles/ChessGame.module.css"; 

const defaultWidth = 700;
const moveSoundSrc = "/ChessMoveDefault.mp3";
const captureSoundSrc = "/ChessMoveCapture.mp3";

export default function ChessGame({selectedBot, timeControl}) {

  const playAudioForMove = useMoveAudio(moveSoundSrc, captureSoundSrc);
  const {
    game,
    onDrop,
    onTakeback,
    isPlayerTurn,
    gameResult

  } = useChessGame("w", 5 * 60, playAudioForMove, selectedBot.depth, selectedBot.rating);

  const { whiteTime, blackTime } = useChessTimer(game, 5 * 60);

  const onQuit = () => {
    window.location.reload();
  };

  const boardWidth = defaultWidth;

return (
  <div className={styles.page}>    
    <div className={styles.container}>
      <div>
        <Chessboard
          id="main-board"
          position={game.fen()}
          onPieceDrop={onDrop}
          arePiecesDraggable={isPlayerTurn && !gameResult}  // disable drag if game over
          boardWidth={boardWidth}
          customBoardStyle={{ borderRadius: "12px", boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)" }}
        />
      </div>

      <ChessControlls
        whiteTime={whiteTime}
        blackTime={blackTime}
        turn={game.turn()}
        boardWidth={boardWidth}
        onTakeback={onTakeback}
        onQuit={onQuit}
        selectedBot={selectedBot}
        timeControl={timeControl}
      />

      {/* Conditionally render the EndGameOverlay only when gameResult exists */}
      {gameResult && <EndGameOverlay gameResult={gameResult} />}
    </div>
  </div>
);
}