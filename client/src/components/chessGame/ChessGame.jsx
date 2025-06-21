import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import useChessGame from "./useChessGame";
import useChessTimer from "./useChessTimer";
import useMoveAudio from "./useMoveAudio";
import EndGameOverlay from "../EndGameOverlay";
import styles from "./ChessGame.module.css";

const moveSoundSrc = "/audio/ChessMoveDefault.mp3";
const captureSoundSrc = "/audio/ChessMoveCapture.mp3";

export default function ChessGame({ selectedBot, timeControl }) {
  const playAudioForMove = useMoveAudio(moveSoundSrc, captureSoundSrc);

  const {
    game,
    onDrop,
    onTakeback,
    isPlayerTurn,
    gameResult,
    setGameResult, // Added from updated hook
  } = useChessGame(
    "w",
    playAudioForMove,
    selectedBot.depth,
    selectedBot.rating
  );

  const { whiteTime, blackTime } = useChessTimer(game, timeControl * 60);

  const [displayWhiteTime, setDisplayWhiteTime] = useState(whiteTime);
  const [displayBlackTime, setDisplayBlackTime] = useState(blackTime);

  useEffect(() => {
    setDisplayWhiteTime(whiteTime);
  }, [whiteTime]);

  useEffect(() => {
    setDisplayBlackTime(blackTime);
  }, [blackTime]);

  // Timeout detection effects:
  useEffect(() => {
    if (displayWhiteTime <= 0 && !gameResult) {
      setGameResult({ winner: "black", reason: "timeout" });
    }
  }, [displayWhiteTime, gameResult, setGameResult]);

  useEffect(() => {
    if (displayBlackTime <= 0 && !gameResult) {
      setGameResult({ winner: "white", reason: "timeout" });
    }
  }, [displayBlackTime, gameResult, setGameResult]);

  const onQuit = () => {
    window.location.reload();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Dynamically size board to fit screen, with some margin for controls
  const boardWidth = Math.min(window.innerWidth - 32, window.innerHeight - 180, 700);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.boardAndControlsWrapper}>
          <div className={styles.boardSection}>
            {/* Top row: Bot info and Black timer */}
            <div className={styles.topRow}>
              <div className={styles.botInfo}>
                <img
                  src={selectedBot.image}
                  alt={selectedBot.name}
                  className={styles.botImage}
                />
                <div>
                  <div className={styles.botName}>{selectedBot.name}</div>
                  <div className={styles.botRating}>
                    Rating: {selectedBot.rating}
                  </div>
                </div>
              </div>
              <div className={styles.timer}>
                <strong>Black:</strong> {formatTime(displayBlackTime)}
              </div>
            </div>

            {/* Chessboard */}
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

            {/* Bottom row: You (White) timer */}
            <div className={styles.bottomRow}>
              <div className={styles.playerLabel}>You</div>
              <div className={styles.timer}>
                <strong>White:</strong> {formatTime(displayWhiteTime)}
              </div>
            </div>
          </div>

          {/* Control buttons */}
          <div className={styles.buttonsWrapper}>
            <button onClick={onQuit} className={styles.button}>
              Quit
            </button>
            <button onClick={onTakeback} className={styles.button} disabled={!!gameResult}>
              Takeback
            </button>
          </div>
        </div>

        {/* End game overlay */}
        {gameResult && <EndGameOverlay gameResult={gameResult} />}
      </div>
    </div>
  );
}
