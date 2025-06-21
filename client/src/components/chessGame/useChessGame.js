import { useState, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import { getStockfishMove } from "./stockfishApi";

export default function useChessGame(
  playerColor = "w",
  playAudioForMove,
  depth,
  elo
) {
  const [game, setGame] = useState(new Chess());
  const [gameResult, setGameResult] = useState(null);

  const isPlayerTurn = game.turn() === playerColor;
  const aiMovePending = useRef(false);
  const playerIsWhite = playerColor === "w";

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
      if (!isPlayerTurn || gameResult) return false;

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
        await delay(Math.floor(Math.random() * 3000) + 1000);
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
          if (result2) setGameResult(result2);
        }

        aiMovePending.current = false;
        return true;
      } catch (err) {
        console.log("Illegal move?", err);
        aiMovePending.current = false;
        return false;
      }
    },
    [game, isPlayerTurn, playAudioForMove, depth, elo, gameResult]
  );

  const onTakeback = useCallback(() => {
    aiMovePending.current = false;

    const newGame = new Chess();
    newGame.loadPgn(game.pgn());

    const currentTurn = newGame.turn();
    const playerToMove = (playerIsWhite && currentTurn === "w") || (!playerIsWhite && currentTurn === "b");

    if (playerToMove) {
      newGame.undo();
      newGame.undo();
    } else {
      newGame.undo();
    }

    setGame(newGame);
    setGameResult(null);
  }, [game, playerIsWhite]);

  const getStatusText = useCallback(() => {
    if (!gameResult) {
      return game.turn() === "w" ? "White to move" : "Black to move";
    }

    switch (gameResult.reason) {
      case "draw":
      case "stalemate":
      case "insufficient_material":
        return "Game Drawn.";
      case "checkmate":
        return gameResult.winner === "white" ? "White Wins!" : "Black Wins!";
      case "timeout":
        return gameResult.winner === "white" ? "White Wins by Timeout!" : "Black Wins by Timeout!";
      default:
        return "Game Over.";
    }
  }, [game, gameResult]);

  return {
    game,
    onDrop,
    onTakeback,
    isPlayerTurn,
    getStatusText,
    gameResult,
    setGameResult, // expose this to allow timeout setting externally
  };
}
