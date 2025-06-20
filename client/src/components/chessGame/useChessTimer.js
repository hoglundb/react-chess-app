import { useState, useEffect } from "react";

export default function useChessTimer(game, initialTimeSeconds = 5 * 60) {
  const [whiteTime, setWhiteTime] = useState(initialTimeSeconds);
  const [blackTime, setBlackTime] = useState(initialTimeSeconds);

  useEffect(() => {
    if (game.isGameOver()) return;

    const timer = setInterval(() => {
      if (game.turn() === "w") {
        setWhiteTime((t) => Math.max(t - 1, 0));
      } else {
        setBlackTime((t) => Math.max(t - 1, 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [game]);

  return { whiteTime, blackTime };
}