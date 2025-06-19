export default function EndGameOverlay({ gameResult, playerColor = "w" }) {
  if (!gameResult) return null;

  const { winner, reason } = gameResult;
  let message;

  if (reason === "checkmate") {
    if (winner === (playerColor === "w" ? "white" : "black")) {
      message = "Checkmate — You win!";
    } else {
      message = "Checkmate — You lose!";
    }
  } else if (
    reason === "stalemate" ||
    reason === "insufficient_material" ||
    reason === "threefold_repetition" ||
    reason === "draw"
  ) {
    message = "Game Drawn.";
  } else {
    message = "Game Over.";
  }

  const onRestart = () => {
    window.location.reload();
  };

  return (
    <div style={overlayStyle}>
      <div style={{ textAlign: "center" }}>
        <h2>{message}</h2>
        <button onClick={onRestart} style={buttonStyle}>
          Restart
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2rem",
  zIndex: 1000,
};

const buttonStyle = {
  marginTop: "1rem",
  padding: "0.5rem 1.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#fff",
  color: "#000",
};
