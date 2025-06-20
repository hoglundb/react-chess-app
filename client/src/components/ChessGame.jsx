import React from "react";
import { Chessboard } from "react-chessboard";
import useChessGame from "../hooks/useChessGame";
import useChessTimer from "../hooks/useChessTimer";
import useMoveAudio from "../hooks/useMoveAudio";
import EndGameOverlay from "./EndGameOverlay";
import styles from "../styles/ChessGame.module.css";

export default function ChessGame({ selectedBot, timeControl }) {
  const playAudioForMove = useMoveAudio("/ChessMoveDefault.mp3", "/ChessMoveCapture.mp3");

  const {
    game,
    onDrop,
    onTakeback,
    isPlayerTurn,
    gameResult,
  } = useChessGame("w", timeControl * 60, playAudioForMove, selectedBot.depth, selectedBot.rating);

  const { whiteTime, blackTime } = useChessTimer(game, timeControl * 60);

  const onQuit = () => window.location.reload();

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const boardWidth = Math.min(window.innerWidth, window.innerHeight - 250);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.boardAndControlsWrapper}>

          {/* Left side: Board + Top and Bottom timers/info */}
          <div className={styles.boardSection}>
            <div className={styles.topRow}>
              <div className={styles.botInfo}>
                <img
                  src={selectedBot.image}
                  alt={selectedBot.name}
                  className={styles.botImage}
                />
                <div>
                  <div className={styles.botName}>{selectedBot.name}</div>
                  <div className={styles.botRating}>Rating: {selectedBot.rating}</div>
                </div>
              </div>
              <div className={styles.timer}>
                <strong>Black:</strong> {formatTime(blackTime)}
              </div>
            </div>

            <Chessboard
              id="main-board"
              position={game.fen()}
              onPieceDrop={onDrop}
              arePiecesDraggable={isPlayerTurn && !gameResult}
              boardWidth={boardWidth}
              customBoardStyle={{
                borderRadius: "12px",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
              }}
            />

            <div className={styles.bottomRow}>
              <div className={styles.playerLabel}>You</div>
              <div className={styles.timer}>
                <strong>White:</strong> {formatTime(whiteTime)}
              </div>
            </div>
          </div>

          {/* Right side: Control buttons */}
          <div className={styles.buttonsWrapper}>
            <button onClick={onQuit} className={styles.button}>Quit</button>
            <button onClick={onTakeback} className={styles.button}>Takeback</button>
          </div>

        </div>

        {gameResult && <EndGameOverlay gameResult={gameResult} />}
      </div>
    </div>
  );
}
