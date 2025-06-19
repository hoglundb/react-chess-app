import { useState, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import { getStockfishMove } from "../utils/stockfishApi";

export default function useChessGame(
  playerColor = "w",
  initialTimeSeconds = 5 * 60,
  playAudioForMove,
  depth,
  elo
) {
  const [game, setGame] = useState(new Chess());
  const [gameResult, setGameResult] = useState(null);

  const isPlayerTurn = game.turn() === playerColor;
  const aiMovePending = useRef(false);

  const getGameResult = (chessInstance) => {
    if (!chessInstance.isGameOver()) return null;

    if (chessInstance.isCheckmate()) {
      return {
        winner: chessInstance.turn() === "w" ? "black" : "white",
        reason: "checkmate",
      };
    }

    if (chessInstance.isStalemate()) {
      return { winner: null, reason: "stalemate" };
    }

    if (chessInstance.isInsufficientMaterial()) {
      return { winner: null, reason: "insufficient_material" };
    }

    if (chessInstance.isDraw()) {
      return { winner: null, reason: "draw" };
    }

    return { winner: null, reason: "unknown" };
  };

  const onDrop = useCallback(
    async (source, target) => {
      if (!isPlayerTurn) return false;

      try {
        const gameCopy = new Chess();
        gameCopy.loadPgn(game.pgn());

        const move = gameCopy.move({
          from: source,
          to: target,
          promotion: "q",
        });

        if (!move) return false;

        playAudioForMove(move);
        setGame(gameCopy);

        const result = getGameResult(gameCopy);
        if (result) {
          setGameResult(result);
          return true;
        }

        aiMovePending.current = true;

        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        const waitMs = Math.floor(Math.random() * 3000) + 1000;
        await delay(waitMs);

        if (!aiMovePending.current) return true;

        const response = await getStockfishMove(gameCopy.fen(), depth, elo);
        if (!response) {
          aiMovePending.current = false;
          return true;
        }

        const updatedGame = new Chess();
        updatedGame.loadPgn(gameCopy.pgn());

        const move2 = updatedGame.move({
          from: response.bestmove.slice(0, 2),
          to: response.bestmove.slice(2, 4),
          promotion: response.bestmove[4] || "q",
        });

        if (move2) {
          playAudioForMove(move2);
          setGame(updatedGame);

          const result2 = getGameResult(updatedGame);
          if (result2) {
            setGameResult(result2);
          }
        }

        aiMovePending.current = false;
        return true;
      } catch (err) {
        console.log("Illegal move?", err);
        aiMovePending.current = false;
        return false;
      }
    },
    [game, isPlayerTurn, playAudioForMove, depth, elo]
  );

  const onTakeback = useCallback(() => {
    aiMovePending.current = false;

    const newGame = new Chess();
    newGame.loadPgn(game.pgn());

    const playerIsWhite = playerColor === "w";
    const currentTurn = newGame.turn();

    if ((playerIsWhite && currentTurn === "w") || (!playerIsWhite && currentTurn === "b")) {
      newGame.undo();
      newGame.undo();
    } else {
      newGame.undo();
    }

    setGame(newGame);
    setGameResult(null);
  }, [game, playerColor]);

  const getStatusText = useCallback(() => {
    if (!gameResult) {
      return game.turn() === "w" ? "White to move" : "Black to move";
    }
    if (
      gameResult.reason === "draw" ||
      gameResult.reason === "stalemate" ||
      gameResult.reason === "insufficient_material"
    ) {
      return "Game Drawn.";
    }
    if (gameResult.winner === "white") return "White Wins!";
    if (gameResult.winner === "black") return "Black Wins!";
    return "Game Over.";
  }, [game, gameResult]);

  return {
    game,
    onDrop,
    onTakeback,
    isPlayerTurn,
    getStatusText,
    gameResult,
  };
}