import React, { useEffect, useState } from "react";
import styles from "../styles/ChessControlls.module.css";

export default function ChessControlls({
  turn,
  boardWidth,
  onQuit,
  onTakeback,
  selectedBot,
  timeControl,
}) {
  const clockHeight = Math.min(boardWidth, 400);
  const clockWidth = clockHeight * 0.4;
  const fontSize = Math.max(clockHeight * 0.05, 14);

  const [whiteTime, setWhiteTime] = useState(timeControl * 60);
  const [blackTime, setBlackTime] = useState(timeControl * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      if (turn === "w") {
        setWhiteTime((prev) => Math.max(prev - 0.1, 0));
      } else if (turn === "b") {
        setBlackTime((prev) => Math.max(prev - 0.1, 0));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [turn]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const dynamicFontSizeStyle = { fontSize };

  return (
    <div
      className={styles.controlsWrapper}
      style={{ fontSize }}
    >
      {/* Clocks and bot info container */}
      <div
        className={styles.clocksBotContainer}
        style={{ height: clockHeight, width: clockWidth }}
      >
        {/* Black clock + Bot info */}
        <div>
          <div
            className={turn === "b" ? styles.blackTurn : styles.blackNotTurn}
            style={dynamicFontSizeStyle}
          >
            Black: {formatTime(blackTime)}
          </div>

          {selectedBot && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 0 }}>
              <img
                src={selectedBot.image}
                alt={selectedBot.name}
                style={{ width: 40, height: 55, borderRadius: "50%" }}
              />
              <div>
                <div style={{ fontSize: 25 }}>{selectedBot.name}</div>
                <div style={{ fontSize: 19 }}>
                  Rating: {selectedBot.rating}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* White clock */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ fontSize: fontSize * 0.8, marginBottom: 2 }}>You</div>
          <div
            className={turn === "w" ? styles.whiteTurn : styles.whiteNotTurn}
            style={dynamicFontSizeStyle}
          >
            White: {formatTime(whiteTime)}
          </div>
        </div>
      </div>

      {/* Buttons container - separated */}
      <div className={styles.buttonsContainer}>
        <button
          onClick={onQuit}
          className={styles.button}
          style={{ fontSize: fontSize * 0.8 }}
        >
          Quit
        </button>
        <button
          onClick={onTakeback}
          className={styles.button}
          style={{ fontSize: fontSize * 0.8 }}
        >
          Takeback
        </button>
      </div>
    </div>
  );
}
