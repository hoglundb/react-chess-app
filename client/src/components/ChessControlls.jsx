import React from "react";
import styles from "../styles/ChessControlls.module.css";
import { useEffect, useRef, useState } from "react";

export default function ChessControlls({
  turn,
  boardWidth,
  onQuit,
  onTakeback,
  selectedBot,
  timeControl
}) {
  const clockHeight = boardWidth * 1;
  const clockWidth = clockHeight * 0.4;

  const fontSize = clockHeight * 0.05;
;
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
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return `${mm}:${ss}`;
};
  // Dynamic inline style only for font size (optional)
  const dynamicFontSizeStyle = { fontSize };

return (
  <div
    className={styles.container}
    style={{ height: clockHeight, width: clockWidth, fontSize }}
  >
    {/* Group black clock and bot info */}
    <div>
      <div className={turn === "b" ? styles.blackTurn : styles.blackNotTurn} style={dynamicFontSizeStyle}>
        Black: {formatTime(blackTime)}
      </div>

      {selectedBot && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: 0 }}>
          <img
            src={selectedBot.image}
            alt={selectedBot.name}
            style={{ width: 40, height: 55, borderRadius: "50%" }}
          />

          <div>
           <div style={{ fontSize: "25px"}}>{selectedBot.name}</div>
            <div style={{ fontSize: "19px"}}>Rating: {selectedBot.rating}</div>
          </div>
        </div>
      )}
    </div>

    <div className={styles.buttons}>
      <button onClick={onQuit} className={styles.button} style={{ fontSize: fontSize * 0.8 }}>
        Quit
      </button>
      <button onClick={onTakeback} className={styles.button} style={{ fontSize: fontSize * 0.8 }}>
        Takeback
      </button>
    </div>
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
);

}